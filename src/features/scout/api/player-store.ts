import { z } from "zod"

import { getDb, getRefreshDb } from "@/lib/db"

import { REFRESH, SCORE_VERSION } from "@/features/scout/constants/scoring.constants"
import { scorePlayer } from "@/features/scout/helpers/score-player"
import { scoredPlayerSchema, storedPlayerSchema } from "@/features/scout/schemas/player.schema"
import type { ScoredPlayer, StoredPlayer } from "@/features/scout/types/player.types"

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

/** Eski formül sürümüyle yazılmış özetleri ham veriden yeniden hesaplayıp günceller. */
async function rescore(logins: string[]): Promise<ScoredPlayer[]> {
  if (logins.length === 0) return []
  const sql = getDb()
  const rows = z
    .array(factsRowSchema)
    .parse(await sql`select login, facts, fetched_at from players where login in ${sql(logins)}`)

  const scored: ScoredPlayer[] = []
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
    const player = scoreStored(parsed.data)
    await sql`
      update players
      set scored = ${sql.json(player)}, score_version = ${SCORE_VERSION}, ovr = ${player.ovr}
      where login = ${row.login}
    `
    scored.push(player)
  }
  return scored
}

/** Bütün oyuncular, genel puana göre sıralı. */
export async function getScoredPlayers(): Promise<ScoredPlayer[]> {
  const sql = getDb()
  const rows = z
    .array(summaryRowSchema)
    .parse(await sql`select login, scored, score_version from players order by ovr desc, login`)

  const current = rows.filter((row) => row.score_version === SCORE_VERSION).map((row) => row.scored)
  const outdated = rows.filter((row) => row.score_version !== SCORE_VERSION).map((row) => row.login)
  const players = [...current, ...(await rescore(outdated))]
  return players.sort((a, b) => b.ovr - a.ovr || a.login.localeCompare(b.login))
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
  if (row.score_version === SCORE_VERSION) return row.scored
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

/** Son bir saatte eklenen oyuncu sayısı; kişisel veri tutmadan toplu eklemeyi sınırlar. */
export async function countRecentPlayers(): Promise<number> {
  const sql = getDb()
  const [row] = z
    .array(z.object({ count: z.coerce.number() }))
    .parse(
      await sql`select count(*) as count from players where created_at > now() - interval '1 hour'`
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
