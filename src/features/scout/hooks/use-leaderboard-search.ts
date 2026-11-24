import { useNavigate, useSearch } from "@tanstack/react-router"

import { leaderboardSearchSchema } from "@/features/scout/schemas/leaderboard-search.schema"
import type { LeaderboardSearch } from "@/features/scout/schemas/leaderboard-search.schema"

/**
 * Tablonun sıralama ve filtre durumu; hangi sayfada olduğunu bilmeden URL'den okur ve yazar.
 * Ana sayfa ve liderlik sayfası aynı tabloyu kullanır.
 */
export function useLeaderboardSearch() {
  const search = leaderboardSearchSchema.parse(useSearch({ strict: false }))
  const navigate = useNavigate()

  const update = (patch: Partial<LeaderboardSearch>) => {
    void navigate({
      to: ".",
      search: (prev) => ({ ...prev, ...patch }),
      replace: true,
      resetScroll: false
    })
  }

  return { search, update }
}
