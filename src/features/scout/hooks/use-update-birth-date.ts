import { useMutation, useQueryClient } from "@tanstack/react-query"

import { viewerKeys } from "@/lib/auth.queries"

import { updateBirthDate } from "@/features/scout/api/players.functions"
import { playerKeys } from "@/features/scout/api/query-keys"

/** Doğum tarihini kaydeder; ayarlar ve profil kartı yeniden yüklenir. */
export function useUpdateBirthDate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (birthDate: string) => updateBirthDate({ data: { birthDate } }),
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: viewerKeys.all }),
        queryClient.invalidateQueries({ queryKey: playerKeys.details() })
      ])
  })
}
