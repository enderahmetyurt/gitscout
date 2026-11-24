import { useMutation, useQueryClient } from "@tanstack/react-query"

import { addPlayer } from "@/features/scout/api/players.functions"
import { playerKeys } from "@/features/scout/api/query-keys"

type AddPlayerVariables = {
  username: string
  refresh?: boolean
}

export function useAddPlayer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ username, refresh = false }: AddPlayerVariables) =>
      addPlayer({ data: { username, refresh } }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: playerKeys.all })
  })
}
