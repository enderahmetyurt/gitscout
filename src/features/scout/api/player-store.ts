import { z } from "zod"

import { getDb, getRefreshDb } from "@/lib/db"

import { REFRESH, SCORE_VERSION } from "@/features/scout/constants/scoring.constants"
import { toListPlayer } from "@/features/scout/helpers/list-player"
import { scorePlayer } from "@/features/scout/helpers/score-player"
import {
  listPlayerSchema,
  scoredPlayerSchema,
  storedPlayerSchema
} from "@/features/scout/schemas/player.schema"
import type { ListPlayer, ScoredPlayer, StoredPlayer } from "@/features/scout/types/player.types"

/**
 * Oyuncular Supabase'deki `gitscout.players` tablosunda durur. Her oyuncu GitHub'dan bir kez çekilir ve
 * bir daha değişmez; uygulama rolünün silme ya da ham veriyi güncelleme yetkisi yoktur.
 * Listeler ~3 KB'lık puan özetinden beslenir; ~70 KB'lık ham veri yalnızca puanlamada okunur.
 */

const summaryRowSchema = z.object({
  login: z.string(),
  scored: scoredPlayerSchema,
  score_version: z.number()
})

const factsRowSchema = z.object({
  login: z.string(),
  facts: z.unknown(),
  fetched_at: z.date()
})

const keyOf = (login: string) => login.toLowerCase()

/** Ham veriden puanlar; veri çekildiği andaki haliyle puanlanır, böylece sonuç zamanla kaymaz. */
function scoreStored(stored: StoredPlayer): ScoredPlayer {
  return scorePlayer(stored, new Date(stored.fetchedAt))
}

/**
 * Bir liste isteğinde en fazla bu kadar eski özet yeniden puanlanır. Formül sürümü artınca bütün
 * oyuncular birden eskir; hepsini tek istekte puanlamak ~11 MB ham veri okur ve rolün 8 sn'lik
 * `statement_timeout` sınırına takılıp siteyi düşürür. Kalanlar o arada eski özetleriyle görünür.
 */
const RESCORE_PER_REQUEST = 25

/**
 * Yerel geliştirme canlı veritabanına bağlı. Yereldeki bir formül denemesi canlı puanların üstüne
 * yazmasın diye yeniden puanlama yerelde yalnızca bellekte yapılır, veritabanına yazılmaz.
 */
const PERSIST_RESCORE = !import.meta.env.DEV

/** Özet bu kodun formülünden eski mi? Daha yeni sürüm (yeni deploy) olduğu gibi kullanılır, geri puanlanmaz. */
const isOutdated = (version: number) => version < SCORE_VERSION

/** Eski formül sürümüyle yazılmış özetleri ham veriden yeniden hesaplar ve tek sorguyla günceller. */
async function rescore(logins: string[]): Promise<ScoredPlayer[]> {
  if (logins.length === 0) return []
  const sql = getDb()
  const rows = z
    .array(factsRowSchema)
    .parse(await sql`select login, facts, fetched_at from players where login in ${sql(logins)}`)

  const scored: { login: string; player: ScoredPlayer }[] = []
  for (const row of rows) {
    const parsed = storedPlayerSchema.safeParse({
      login: row.login,
      fetchedAt: row.fetched_at.toISOString(),
      facts: row.facts
    })
    if (!parsed.success) {
      // Biçimi artık uymayan kayıt listeden çıkar; ham veri olduğu gibi saklanır.
      console.error("[db] puanlanamayan kayıt", row.login)
      continue
    }
    scored.push({ login: row.login, player: scoreStored(parsed.data) })
  }

  if (PERSIST_RESCORE && scored.length > 0) {
    const values = scored.map(({ login, player }) => [login, JSON.stringify(player), player.ovr])
    await sql`
      update players as p
      set scored = v.scored::jsonb, score_version = ${SCORE_VERSION}, ovr = v.ovr::smallint
      from (values ${sql(values)}) as v(login, scored, ovr)
      where p.login = v.login
    `
  }
  return scored.map(({ player }) => player)
}

/** Bütün oyuncular, genel puana göre sıralı. */
const listRowSchema = z.object({
  login: z.string(),
  summary: listPlayerSchema,
  score_version: z.number()
})

/**
 * Bütün oyuncular, liste ekranlarının ihtiyacı kadar veriyle, genel puana göre sıralı. Hafifletme
 * SQL'de yapılır: veritabanı uzak bölgede olduğu için taşınan her bayt istek süresine yansır.
 * Rol dağılımı, repolar, arşetip ve stat parçaları atılır; statlardan yalnızca görünen puan kalır.
 */
export async function getListPlayers(): Promise<{ players: ListPlayer[]; pending: number }> {
  const sql = getDb()
  const rows = z.array(listRowSchema).parse(
    await sql`
      select login, score_version,
        (scored - 'positionBreakdown' - 'topRepos' - 'archetype' - 'stats')
          || jsonb_build_object('stats', (
            select jsonb_object_agg(k, jsonb_build_object('key', k, 'value', v -> 'value'))
            from jsonb_each(scored -> 'stats') as s(k, v)
          )) as summary
      from players
      order by ovr desc, login
    `
  )

  const outdated = rows.filter((row) => isOutdated(row.score_version)).map((row) => row.login)
  const rescored = new Map(
    (await rescore(outdated.slice(0, RESCORE_PER_REQUEST))).map((player) => [
      keyOf(player.login),
      toListPlayer(player)
    ])
  )
  const players = rows.map((row) => rescored.get(keyOf(row.login)) ?? row.summary)
  return {
    players: players.sort((a, b) => b.ovrExact - a.ovrExact || a.login.localeCompare(b.login)),
    // Yerelde yazılmadığı için hiç azalmaz; önbelleği kısaltmamak için sıfır sayılır.
    pending: PERSIST_RESCORE ? Math.max(0, outdated.length - rescored.size) : 0
  }
}

export async function getScoredPlayer(login: string): Promise<ScoredPlayer | null> {
  const sql = getDb()
  const rows = z
    .array(summaryRowSchema)
    .parse(
      await sql`select login, scored, score_version from players where login = ${keyOf(login)}`
    )
  const row = rows[0]
  if (!row) return null
  if (!isOutdated(row.score_version)) return row.scored
  return (await rescore([row.login]))[0] ?? null
}

/** Site haritası için bütün oyuncuların kullanıcı adı ve verinin tarihi; özet ya da ham veri okunmaz. */
export async function getSitemapPlayers(): Promise<{ login: string; fetchedAt: Date }[]> {
  const sql = getDb()
  const rows = z
    .array(z.object({ login: z.string(), fetched_at: z.date() }))
    .parse(await sql`select login, fetched_at from players order by ovr desc, login`)
  return rows.map((row) => ({ login: row.login, fetchedAt: row.fetched_at }))
}

/** Son 24 saatte eklenen oyuncuların kullanıcı adları; ana sayfa vitrininde öne çıkarılırlar. */
export async function getRecentLogins(): Promise<string[]> {
  const sql = getDb()
  const rows = z
    .array(z.object({ login: z.string() }))
    .parse(await sql`select login from players where created_at > now() - interval '24 hours'`)
  return rows.map((row) => row.login)
}

/** En son eklenen oyuncular, yeniden eskiye; ana sayfadaki "Son eklenenler" şeridi için. */
export async function getLatestAdditions(
  limit: number
): Promise<{ login: string; addedAt: string }[]> {
  const sql = getDb()
  const rows = z
    .array(z.object({ login: z.string(), created_at: z.date() }))
    .parse(await sql`select login, created_at from players order by created_at desc limit ${limit}`)
  return rows.map((row) => ({ login: row.login, addedAt: row.created_at.toISOString() }))
}

/** Son `hours` saatte eklenen oyuncu sayısı. Saatlik sayım kişisel veri tutmadan toplu eklemeyi sınırlar; günlük sayım ana sayfada gösterilir. */
export async function countRecentPlayers(hours = 1): Promise<number> {
  const sql = getDb()
  const [row] = z
    .array(z.object({ count: z.coerce.number() }))
    .parse(
      await sql`select count(*) as count from players where created_at > now() - make_interval(hours => ${hours})`
    )
  return row?.count ?? 0
}

/**
 * Yeni oyuncuyu kaydeder. Kayıt zaten varsa hiçbir şey değişmez ve var olan özet döner:
 * aynı anda gelen iki istekten ilki kazanır.
 */
export async function insertPlayer(input: StoredPlayer): Promise<ScoredPlayer> {
  const stored = storedPlayerSchema.parse(input)
  const player = scoreStored(stored)
  const sql = getDb()
  await sql`
    insert into players (login, facts, scored, score_version, ovr, fetched_at)
    values (
      ${keyOf(stored.facts.login)},
      ${sql.json(stored.facts)},
      ${sql.json(player)},
      ${SCORE_VERSION},
      ${player.ovr},
      ${stored.fetchedAt}
    )
    on conflict (login) do nothing
  `
  return (await getScoredPlayer(stored.facts.login)) ?? player
}

/* ---------- Haftalık yenileme (yalnızca gitscout_refresher rolüyle) ---------- */

/** Verisi en eski olan ve `maxAgeDays` günü geçmiş kartlar. */
export async function getStaleLogins(limit: number): Promise<string[]> {
  const sql = getRefreshDb()
  const rows = z.array(z.object({ login: z.string() })).parse(
    await sql`
      select login from players
      where fetched_at < now() - make_interval(days => ${REFRESH.maxAgeDays})
      order by fetched_at asc
      limit ${limit}
    `
  )
  return rows.map((row) => row.login)
}

/** Kartın ham verisini ve puan özetini GitHub'dan yeni çekilen veriyle değiştirir. */
export async function replacePlayerFacts(login: string, input: StoredPlayer): Promise<void> {
  const stored = storedPlayerSchema.parse(input)
  const player = scoreStored(stored)
  const sql = getRefreshDb()
  await sql`
    update players
    set facts = ${sql.json(stored.facts)},
        scored = ${sql.json(player)},
        score_version = ${SCORE_VERSION},
        ovr = ${player.ovr},
        fetched_at = ${stored.fetchedAt}
    where login = ${keyOf(login)}
  `
}

/** GitHub'da artık bulunamayan hesap sıranın sonuna alınır; veri olduğu gibi kalır. */
export async function postponePlayer(login: string): Promise<void> {
  const sql = getRefreshDb()
  await sql`update players set fetched_at = now() where login = ${keyOf(login)}`
}
