import { notFound } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"

import { fetchPlayerFacts } from "@/features/scout/api/fetch-player-facts.api"
import { GithubError } from "@/features/scout/api/get-github-data.api"
import {
  countRecentPlayers,
  getLatestAdditions,
  getRecentLogins,
  getScoredPlayer,
  getScoredPlayers,
  insertPlayer
} from "@/features/scout/api/player-store"
import { NEW_PLAYERS_PER_HOUR } from "@/features/scout/constants/scoring.constants"
import { computeBenchmarks } from "@/features/scout/helpers/benchmarks"
import { computeRanking } from "@/features/scout/helpers/score-player"
import { addPlayerSchema, usernameSchema } from "@/features/scout/schemas/player.schema"
import type { PlayerDetail, ScoredPlayer } from "@/features/scout/types/player.types"

type Leaderboard = {
  players: ScoredPlayer[]
  /** Son 24 saatte eklenenler; vitrinde daha sık çıkarlar. */
  recentLogins: string[]
  /**
   * Vitrin tohumu: Unix saat numarası. Sunucuda hesaplanıp veriyle gider, böylece
   * sunucuda çizilen kart ile tarayıcıdaki kart saat dönümünde bile aynı kalır.
   */
  featuredSeed: number
  /** En son eklenenler, yeniden eskiye. */
  latest: LatestAddition[]
  /**
   * Verinin üretildiği an. "5 dk önce" gibi göreli zamanlar buna göre yazılır; sunucu ile
   * tarayıcı aynı metni üretir.
   */
  generatedAt: string
}

type LatestAddition = { login: string; addedAt: string }

const HOUR_MS = 60 * 60_000
const LATEST_LIMIT = 8

/**
 * Aynı sunucu örneği bu süre içinde gelen istekleri veritabanına gitmeden karşılar. Veri haftada bir yenilenir;
 * yeni eklenen kart, ekleyen kişinin örneğinde hemen, diğer örneklerde en geç bu süre sonra listeye girer.
 */
const LIST_CACHE_MS = 5 * 60_000
let listCache: {
  at: number
  players: ScoredPlayer[]
  recentLogins: string[]
  latest: LatestAddition[]
} | null = null

async function cachedList() {
  if (listCache && Date.now() - listCache.at < LIST_CACHE_MS) return listCache
  const [players, recentLogins, latest] = await Promise.all([
    getScoredPlayers(),
    getRecentLogins(),
    getLatestAdditions(LATEST_LIMIT)
  ])
  listCache = { at: Date.now(), players, recentLogins, latest }
  return listCache
}

async function cachedPlayers(): Promise<ScoredPlayer[]> {
  return (await cachedList()).players
}

/** Kayıtlı bütün oyuncular, genel puana göre sıralı. GitHub'a istek atmaz. */
export const getLeaderboard = createServerFn({ method: "GET" }).handler(
  async (): Promise<Leaderboard> => {
    const { at, players, recentLogins, latest } = await cachedList()
    return {
      players,
      recentLogins,
      latest,
      featuredSeed: Math.floor(Date.now() / HOUR_MS),
      generatedAt: new Date(at).toISOString()
    }
  }
)

export const getPlayer = createServerFn({ method: "GET" })
  // Geçersiz kullanıcı adı doğrulama hatası (500) değil, "bulunamadı" (404) sayılır.
  .validator(z.object({ username: z.string() }))
  .handler(async ({ data }): Promise<PlayerDetail> => {
    const username = usernameSchema.safeParse(data.username)
    if (!username.success) throw notFound()
    const player = await getScoredPlayer(username.data)
    if (!player) throw notFound()
    const all = await cachedPlayers()
    return {
      ...player,
      ranking: computeRanking(player, all),
      benchmarks: computeBenchmarks(player, all)
    }
  })

/**
 * GitHub hataları istemciye sabit bir kodla gider (`github:not-found`); mesaj arayüzde dile göre yazılır.
 * Sunucu tarafındaki ayrıntı `cause` içinde ve logda kalır.
 */
async function fetchFacts(login: string) {
  try {
    return await fetchPlayerFacts(login)
  } catch (error) {
    if (error instanceof GithubError) throw new Error(`github:${error.kind}`, { cause: error })
    throw error
  }
}

/**
 * Oyuncu kayıtlıysa GitHub'a gitmeden döner. Değilse bir kez çekilip kaydedilir;
 * kayıtlı veri sonradan değiştirilemez.
 */
export const addPlayer = createServerFn({ method: "POST" })
  .validator(addPlayerSchema)
  .handler(async ({ data }): Promise<ScoredPlayer> => {
    const existing = await getScoredPlayer(data.username)
    if (existing) return existing

    if ((await countRecentPlayers()) >= NEW_PLAYERS_PER_HOUR) {
      throw new Error("github:rate-limit")
    }

    const facts = await fetchFacts(data.username)
    const player = await insertPlayer({
      login: facts.login,
      fetchedAt: new Date().toISOString(),
      facts
    })
    listCache = null
    return player
  })
