import { useMutation, useQueryClient } from "@tanstack/react-query"

import { viewerKeys } from "@/lib/auth.queries"

import { updateProfileCountry } from "@/features/scout/api/players.functions"
import { playerKeys } from "@/features/scout/api/query-keys"
import type { CountryCode } from "@/features/scout/constants/player-country.constants"

/** Kendi ülkesini kaydeder; ayarlar, profil ve listeler yeniden yüklenir. */
export function useUpdateProfileCountry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (country: CountryCode | null) => updateProfileCountry({ data: { country } }),
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: viewerKeys.all }),
        queryClient.invalidateQueries({ queryKey: playerKeys.all })
      ])
  })
}
