import { useMutation, useQueryClient } from "@tanstack/react-query"

import { addPlayer } from "@/features/scout/api/players.functions"
import { playerKeys } from "@/features/scout/api/query-keys"

export function useAddPlayer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (username: string) => addPlayer({ data: { username } }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: playerKeys.all })
  })
}
