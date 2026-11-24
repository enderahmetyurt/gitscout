import { notFound } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"

import { fetchPlayerFacts } from "@/features/scout/api/fetch-player-facts.api"
import {
  getPlayers,
  getStaleCount,
  getStoredPlayer,
  savePlayer
} from "@/features/scout/api/player-store"
import { computeRanking, scorePlayer } from "@/features/scout/helpers/score-player"
import { playerRequestSchema, usernameSchema } from "@/features/scout/schemas/player.schema"
import type { PlayerDetail, ScoredPlayer, StoredPlayer } from "@/features/scout/types/player.types"

type Leaderboard = {
  players: ScoredPlayer[]
  /** Veri biçimi değiştiği için yenilenmeyi bekleyen oyuncu sayısı. */
  staleCount: number
}

/** Kayıtlı bütün oyuncuları, saklanan veriden yeniden puanlayıp sıralar. GitHub'a istek atmaz. */
export const getLeaderboard = createServerFn({ method: "GET" }).handler(
  async (): Promise<Leaderboard> => {
    const [players, staleCount] = await Promise.all([getPlayers(), getStaleCount()])
    const now = new Date()
    return {
      players: players
        .map((player) => scorePlayer(player, now))
        .sort((a, b) => b.ovr - a.ovr || a.login.localeCompare(b.login)),
      staleCount
    }
  }
)

async function fetchAndSave(login: string, previous: StoredPlayer | null) {
  const facts = await fetchPlayerFacts(login)
  const stored: StoredPlayer = {
    login: facts.login,
    fetchedAt: new Date().toISOString(),
    timezone: previous?.timezone,
    facts
  }
  await savePlayer(stored)
  return stored
}

export const getPlayer = createServerFn({ method: "GET" })
  .validator(z.object({ username: usernameSchema }))
  .handler(async ({ data }): Promise<PlayerDetail> => {
    const stored = await getStoredPlayer(data.username)
    if (!stored) throw notFound()
    const now = new Date()
    const player = scorePlayer(stored, now)
    const all = (await getPlayers()).map((item) => scorePlayer(item, now))
    return { ...player, ranking: computeRanking(player, all) }
  })

/** Oyuncu kayıtlıysa istek atmadan döner; yoksa ya da `refresh` istenirse GitHub'dan çekip kaydeder. */
export const addPlayer = createServerFn({ method: "POST" })
  .validator(playerRequestSchema)
  .handler(async ({ data }): Promise<ScoredPlayer> => {
    const existing = await getStoredPlayer(data.username)
    if (existing && !data.refresh) return scorePlayer(existing)

    return scorePlayer(await fetchAndSave(data.username, existing))
  })
