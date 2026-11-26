import { z } from "zod"

import { createApi } from "@/lib/api"
import { getDb } from "@/lib/db"
import { githubApi } from "@/lib/github"
import type { GithubIdentity } from "@/lib/supabase-auth"
import { isEligibleAccount } from "@/helpers/account-eligibility"

import { addPlayer } from "@/features/scout/api/players.functions"

const githubUserSchema = z.object({
  id: z.number().int().positive(),
  login: z.string().regex(/^[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,38}$/),
  type: z.string(),
  avatar_url: z.url().startsWith("https://avatars.githubusercontent.com/").max(500),
  followers: z.number().int().nonnegative(),
  created_at: z.iso.datetime()
})

type SyncedAccount = { githubId: number; login: string }

type GithubUser = z.infer<typeof githubUserSchema>

/**
 * Girişi yapan GitHub hesabı. Bu girişin anahtarı varsa GitHub'a "ben kimim" diye sorulur; böylece aynı
 * Supabase kullanıcısına bağlı başka bir GitHub hesabı yanlışlıkla seçilemez. Anahtar yoksa yalnızca tek
 * bağlı hesap kabul edilir, birden fazlaysa giriş reddedilir.
 */
async function getSignedInGithubUser(identity: GithubIdentity): Promise<GithubUser> {
  const { providerToken, githubIds } = identity
  const user = providerToken
    ? await createApi({
        baseUrl: "https://api.github.com",
        getHeaders: () => ({ Authorization: `bearer ${providerToken}`, "User-Agent": "gitscout" })
      }).get("/user", { schema: githubUserSchema, timeoutMs: 10_000 })
    : githubIds.length === 1
      ? await githubApi.get(`/user/${githubIds[0]}`, {
          schema: githubUserSchema,
          timeoutMs: 10_000
        })
      : null
  if (!user || !githubIds.includes(user.id)) throw new Error("GitHub kimliği eşleşmedi")
  return user
}

/**
 * Girişten sonra hesabı GitHub'ın kendisinden okuyup kaydeder. Kullanıcı adı, takipçi ve hesap tarihi
 * Supabase'in kullanıcıya açık meta verisinden değil, sunucunun GitHub API çağrısından gelir.
 */
export async function syncGithubAccount(identity: GithubIdentity): Promise<SyncedAccount> {
  const user = await getSignedInGithubUser(identity)
  if (user.type !== "User") throw new Error("Yalnızca kişisel hesaplar giriş yapabilir")

  const login = user.login.toLowerCase()
  const createdAt = new Date(user.created_at)
  const eligible = isEligibleAccount({ createdAt, followers: user.followers }, new Date())

  const sql = getDb()
  await sql.begin(async (tx) => {
    // Kullanıcı adı el değiştirdiyse eski sahibinden alınır; onay işareti ve ülke yeni sahibine geçmez.
    await tx`
      update accounts set login = null, updated_at = now()
      where login = ${login} and github_id <> ${user.id}
    `
    await tx`
      insert into accounts (github_id, auth_user_id, login, avatar_url, github_created_at, followers, eligible, verified_at)
      values (${user.id}, ${identity.authUserId}, ${login}, ${user.avatar_url}, ${createdAt}, ${user.followers}, ${eligible}, case when ${eligible}::boolean then now() end)
      on conflict (github_id) do update set
        auth_user_id = excluded.auth_user_id,
        login = excluded.login,
        avatar_url = excluded.avatar_url,
        github_created_at = excluded.github_created_at,
        followers = excluded.followers,
        eligible = excluded.eligible,
        -- İlk onay tarihi korunur; onay düşerse silinir, yeniden kazanılınca o anın tarihi yazılır.
        verified_at = case when excluded.eligible then coalesce(accounts.verified_at, now()) end,
        updated_at = now()
    `
  })

  // Kartı yoksa oluşturulur. Ekleme sınırı ya da GitHub hatası girişi bozmaz; profil sayfası ekleme formunu gösterir.
  try {
    await addPlayer({ data: { username: login } })
  } catch (error) {
    console.error("[auth] giriş yapan kişinin kartı eklenemedi", error)
  }

  return { githubId: user.id, login }
}
