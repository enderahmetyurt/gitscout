import { useMutation, useQueryClient } from "@tanstack/react-query"

import { viewerKeys } from "@/lib/auth.queries"

import { updateProfileDetails } from "@/features/scout/api/players.functions"
import { playerKeys } from "@/features/scout/api/query-keys"
import type { ProfileDetailsInput } from "@/features/scout/schemas/profile.schema"

/**
 * Şehir, cinsiyet, rüya takımı, favori takım ve kalıcı kart yüzünü kaydeder. Ayarlarla birlikte oyuncu
 * detayları da yenilenir: profil sayfası kalıcı kart yüzünü oradan okur ve önbellekte bir gün taze kalır.
 */
export function useUpdateProfileDetails() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (details: ProfileDetailsInput) => updateProfileDetails({ data: details }),
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: viewerKeys.all }),
        queryClient.invalidateQueries({ queryKey: playerKeys.details() })
      ])
  })
}
