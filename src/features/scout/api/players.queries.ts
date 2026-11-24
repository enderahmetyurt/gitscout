import { queryOptions } from "@tanstack/react-query"

import { getLeaderboard, getPlayer } from "@/features/scout/api/players.functions"
import { playerKeys } from "@/features/scout/api/query-keys"

/** Oyuncu verisi bir kez çekilip değişmediği için istemci önbelleği bir gün taze sayılır. */
const DAY_MS = 24 * 60 * 60 * 1000

export const leaderboardQueryOptions = () =>
  queryOptions({
    queryKey: playerKeys.lists(),
    queryFn: ({ signal }) => getLeaderboard({ signal }),
    staleTime: DAY_MS
  })

export const playerQueryOptions = (username: string) =>
  queryOptions({
    queryKey: playerKeys.detail(username),
    queryFn: ({ signal }) => getPlayer({ data: { username }, signal }),
    staleTime: DAY_MS
  })
