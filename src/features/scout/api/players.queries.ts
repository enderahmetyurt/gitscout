import { queryOptions } from "@tanstack/react-query"

import { getLeaderboard, getPlayer } from "@/features/scout/api/players.functions"
import { playerKeys } from "@/features/scout/api/query-keys"

export const leaderboardQueryOptions = () =>
  queryOptions({
    queryKey: playerKeys.lists(),
    queryFn: ({ signal }) => getLeaderboard({ signal })
  })

export const playerQueryOptions = (username: string) =>
  queryOptions({
    queryKey: playerKeys.detail(username),
    queryFn: ({ signal }) => getPlayer({ data: { username }, signal })
  })
