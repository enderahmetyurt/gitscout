import { useSuspenseQuery } from "@tanstack/react-query"

import { leaderboardQueryOptions } from "@/features/scout/api/players.queries"

export function useLeaderboard() {
  return useSuspenseQuery(leaderboardQueryOptions())
}
