import { useQuery } from "@tanstack/react-query"

import { leaderboardQueryOptions } from "@/features/scout/api/players.queries"

/** Sayfayı bekletmeden yüklenen oyuncu listesi; seçim kutuları için. */
export function useLeaderboardPlayers() {
  const { data, isPending } = useQuery(leaderboardQueryOptions())
  return { players: data?.players ?? [], isPending }
}
