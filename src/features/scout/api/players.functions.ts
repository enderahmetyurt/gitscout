import { notFound } from "@tanstack/react-router"
import { createServerFn, createServerOnlyFn } from "@tanstack/react-start"
import { z } from "zod"

import { fetchPlayerFacts } from "@/features/scout/api/fetch-player-facts.api"
import { GithubError } from "@/features/scout/api/get-github-data.api"
import {
  countRecentPlayers,
  getLatestAdditions,
  getListPlayers,
  getRecentLogins,
  getScoredPlayer,
  insertPlayer
} from "@/features/scout/api/player-store"
import { NEW_PLAYERS_PER_HOUR } from "@/features/scout/constants/scoring.constants"
import { computeBenchmarks } from "@/features/scout/helpers/benchmarks"
import { computeRanking } from "@/features/scout/helpers/score-player"
import { addPlayerSchema, usernameSchema } from "@/features/scout/schemas/player.schema"
import type { ListPlayer, PlayerDetail, ScoredPlayer } from "@/features/scout/types/player.types"

type Leaderboard = {
  players: ListPlayer[]
  /** Son 24 saatte eklenenler; vitrinde daha sık çıkarlar. */
  recentLogins: string[]
  /**
   * Vitrin tohumu: Unix saat numarası. Sunucuda hesaplanıp veriyle gider, böylece
   * sunucuda çizilen kart ile tarayıcıdaki kart saat dönümünde bile aynı kalır.
   */
  featuredSeed: number
  /** En son eklenenler, yeniden eskiye. */
  latest: LatestAddition[]
  /** Verinin üretildiği andan önceki bir saatte eklenen oyuncu sayısı. */
  lastHourCount: number
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

type ListSnapshot = {
  at: number
  players: ListPlayer[]
  recentLogins: string[]
  latest: LatestAddition[]
  lastHourCount: number
}

let listCache: ListSnapshot | null = null
let listLoading: Promise<ListSnapshot> | null = null

/**
 * Liste sorgusu ~400 KB taşır ve uzak bölgedeki veritabanından birkaç saniye sürebilir. Aynı anda gelen
 * istekler (SSR, istemci, yeni sekme) aynı yüklemeyi bekler; sorgular da sırayla gider. Transaction
 * pooler'da aynı bağlantıda üst üste binen sorgular takılıp sunucuyu kilitliyordu.
 */
function loadList(): Promise<ListSnapshot> {
  listLoading ??= (async () => {
    const players = await getListPlayers()
    const recentLogins = await getRecentLogins()
    const latest = await getLatestAdditions(LATEST_LIMIT)
    const lastHourCount = await countRecentPlayers()
    listCache = { at: Date.now(), players, recentLogins, latest, lastHourCount }
    return listCache
  })().finally(() => {
    listLoading = null
  })
  return listLoading
}

async function cachedList(): Promise<ListSnapshot> {
  if (listCache && Date.now() - listCache.at < LIST_CACHE_MS) return listCache
  return loadList()
}

async function cachedPlayers(): Promise<ListPlayer[]> {
  return (await cachedList()).players
}

/**
 * Önbellekteki listenin ilk `limit` oyuncusu ve verinin anı; herkese açık `/api/top.json` için.
 * `createServerOnlyFn` şart: düz bir fonksiyon, rota dosyası üzerinden veritabanı istemcisini tarayıcı
 * paketine taşıyor ve sayfa açılışta çöküyordu.
 */
export const getTopPlayers = createServerOnlyFn(
  async (limit: number): Promise<{ generatedAt: string; players: ListPlayer[] }> => {
    const { at, players } = await cachedList()
    return { generatedAt: new Date(at).toISOString(), players: players.slice(0, limit) }
  }
)

/**
 * README rozeti için oyuncunun genel sıradaki yeri; kayıtlı değilse `null`. Önbellekteki listeden
 * okunur, böylece GitHub'ın görsel proxy'sinden gelen istekler veritabanına yük bindirmez.
 */
export const getBadgePlayer = createServerOnlyFn(
  async (login: string): Promise<{ rank: number; player: ListPlayer } | null> => {
    const key = login.toLowerCase()
    const players = await cachedPlayers()
    const index = players.findIndex((player) => player.login.toLowerCase() === key)
    const player = players[index]
    return player ? { rank: index + 1, player } : null
  }
)

/** Kayıtlı bütün oyuncular, genel puana göre sıralı. GitHub'a istek atmaz. */
export const getLeaderboard = createServerFn({ method: "GET" }).handler(
  async (): Promise<Leaderboard> => {
    const { at, players, recentLogins, latest, lastHourCount } = await cachedList()
    return {
      players,
      recentLogins,
      latest,
      lastHourCount,
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
