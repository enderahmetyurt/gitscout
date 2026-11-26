import { useQueryClient } from "@tanstack/react-query"

import { playerQueryOptions } from "@/features/scout/api/players.queries"

/** Oyuncu sayfasının verisini arka planda önceden çeker; kapışmaya geçiş beklemeden açılsın diye. */
export function usePrefetchPlayer() {
  const queryClient = useQueryClient()
  return (login: string) => {
    void queryClient.prefetchQuery(playerQueryOptions(login))
  }
}
