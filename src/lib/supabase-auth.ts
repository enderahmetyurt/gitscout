import { createServerClient, parseCookieHeader } from "@supabase/ssr"
import type { CookieOptions } from "@supabase/ssr"
import type { UserIdentity } from "@supabase/supabase-js"

import { serverEnv } from "@/env.server"

/**
 * Supabase Auth yalnızca GitHub OAuth aracısıdır ve yalnızca sunucuda çalışır. Tarayıcıda Supabase istemcisi,
 * anahtarı ya da oturumu yoktur: kod sunucuda oturuma çevrilir, kimlik okunur ve Supabase oturumu hemen kapatılır.
 * Uygulamanın kendi oturumu `lib/session.ts` içindedir.
 */

export type CookieWrite = { name: string; value: string; options: CookieOptions }

/** PKCE doğrulayıcısı yalnızca giriş akışı süresince yaşar. */
const FLOW_COOKIE_MAX_AGE = 10 * 60

/** Supabase'in çerez varsayılanı `httpOnly: false`; burada her çerez JavaScript'e kapalı yazılır. */
function hardenCookie({ name, value, options }: CookieWrite): CookieWrite {
  const removing = options.maxAge === 0 || value === ""
  return {
    name,
    value,
    options: {
      ...options,
      path: "/",
      httpOnly: true,
      secure: !import.meta.env.DEV,
      sameSite: "lax",
      maxAge: removing ? 0 : FLOW_COOKIE_MAX_AGE
    }
  }
}

export const isGithubLoginConfigured = () =>
  Boolean(serverEnv.SUPABASE_URL && serverEnv.SUPABASE_PUBLISHABLE_KEY)

/**
 * İstek çerezleriyle çalışan, tek isteklik Supabase istemcisi. Yazılan çerezler önce bellekte tutulur
 * (aynı istek içinde tekrar okunabilsin diye), sonra `onWrite` ile yanıta eklenmek üzere verilir.
 */
function createAuthClient(cookieHeader: string, onWrite: (cookie: CookieWrite) => void) {
  const { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } = serverEnv
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    throw new Error("GitHub ile giriş yapılandırılmamış")
  }
  const jar = new Map(parseCookieHeader(cookieHeader).map((cookie) => [cookie.name, cookie.value]))
  return createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { flowType: "pkce", autoRefreshToken: false, detectSessionInUrl: false },
    cookies: {
      getAll: () => [...jar].map(([name, value]) => ({ name, value })),
      setAll: (cookies) => {
        for (const cookie of cookies) {
          const hardened = hardenCookie(cookie)
          if (hardened.options.maxAge === 0) jar.delete(hardened.name)
          else jar.set(hardened.name, hardened.value)
          onWrite(hardened)
        }
      }
    }
  })
}

/**
 * GitHub yetkilendirme adresini üretir. PKCE doğrulayıcısı `onWrite` ile httpOnly çereze yazılır;
 * geri dönüşte yalnızca aynı tarayıcı kodu oturuma çevirebilir (giriş CSRF'ine karşı).
 */
export async function createGithubAuthorizeUrl(
  cookieHeader: string,
  redirectTo: string,
  onWrite: (cookie: CookieWrite) => void
): Promise<string> {
  const supabase = createAuthClient(cookieHeader, onWrite)
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: { redirectTo, skipBrowserRedirect: true }
  })
  if (error) throw new Error("GitHub yetkilendirme adresi üretilemedi", { cause: error })
  const url = new URL(data.url)
  // Kullanıcıyı yalnızca kendi Supabase projemize yönlendiririz.
  if (url.origin !== new URL(serverEnv.SUPABASE_URL ?? "").origin) {
    throw new Error("Beklenmeyen yetkilendirme adresi")
  }
  return url.toString()
}

/**
 * Girişin sonucu. `providerToken` GitHub'ın bu girişte verdiği kısa ömürlü erişim anahtarıdır; yalnızca
 * giriş yapan hesabı GitHub'a sordurmak için kullanılır, hiçbir yere kaydedilmez.
 */
export type GithubIdentity = {
  authUserId: string
  githubIds: number[]
  providerToken: string | null
}

const NUMERIC_ID = /^\d{1,15}$/

/**
 * GitHub'ın sayısal kullanıcı kimliği. `user_metadata` kullanıcı tarafından değiştirilebildiği için okunmaz;
 * kimlik kaydının alanları her girişte GitHub'dan gelir. Dolu olan bütün adaylar aynı sayıyı göstermeli.
 */
export function githubIdFromIdentity(identity: UserIdentity): number | null {
  const data = identity.identity_data ?? {}
  const candidates = [identity.id, data.provider_id, data.sub]
    .filter(
      (value): value is string | number => typeof value === "string" || typeof value === "number"
    )
    .map(String)
    .filter((value) => NUMERIC_ID.test(value))
  const [first] = candidates
  if (!first || candidates.some((value) => value !== first)) return null
  const id = Number(first)
  return Number.isSafeInteger(id) && id > 0 ? id : null
}

/**
 * Geri dönüş kodunu sunucuda oturuma çevirir, GitHub kimliğini okur ve Supabase oturumunu hemen kapatır.
 * Supabase'in erişim ve yenileme anahtarları hiçbir zaman tarayıcıya yazılmaz.
 */
export async function exchangeGithubCode(
  cookieHeader: string,
  code: string
): Promise<GithubIdentity> {
  const supabase = createAuthClient(cookieHeader, () => {
    // Bu istekte Supabase çerezi tarayıcıya gönderilmez; akış çerezleri yanıtta ayrıca silinir.
  })
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) throw new Error("GitHub kodu oturuma çevrilemedi", { cause: error })

  try {
    // Aynı Supabase kullanıcısına birden çok GitHub hesabı bağlanmış olabilir; hangisinin giriş yaptığı
    // sıraya bakılarak değil, `providerToken` ile GitHub'a sorularak belirlenir.
    const githubIds = (data.user.identities ?? [])
      .filter((item) => item.provider === "github")
      .map(githubIdFromIdentity)
    if (githubIds.length === 0 || githubIds.some((id) => id === null)) {
      throw new Error("GitHub kimliği okunamadı")
    }
    return {
      authUserId: data.user.id,
      githubIds: githubIds.filter((id): id is number => id !== null),
      providerToken: data.session.provider_token ?? null
    }
  } finally {
    // Yenileme anahtarları iptal edilir; Supabase oturumu bir daha kullanılmaz.
    const { error: signOutError } = await supabase.auth.signOut({ scope: "global" })
    if (signOutError) console.error("[auth] Supabase oturumu kapatılamadı", signOutError.message)
  }
}

/** İstekteki Supabase akış çerezlerini silen `Set-Cookie` değerleri için adlar. */
export function supabaseCookieNames(cookieHeader: string): string[] {
  return parseCookieHeader(cookieHeader)
    .map((cookie) => cookie.name)
    .filter((name) => name.startsWith("sb-"))
}
