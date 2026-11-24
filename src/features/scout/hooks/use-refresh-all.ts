import { useMutation, useQueryClient } from "@tanstack/react-query"

import { refreshAllPlayers } from "@/features/scout/api/players.functions"
import { playerKeys } from "@/features/scout/api/query-keys"

export function useRefreshAll() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => refreshAllPlayers(),
    onSettled: () => queryClient.invalidateQueries({ queryKey: playerKeys.all })
  })
}
