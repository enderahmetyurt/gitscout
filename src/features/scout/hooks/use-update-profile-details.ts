import { useMutation, useQueryClient } from "@tanstack/react-query"

import { viewerKeys } from "@/lib/auth.queries"

import { updateProfileDetails } from "@/features/scout/api/players.functions"
import type { ProfileDetailsInput } from "@/features/scout/schemas/profile.schema"

/** Şehir, cinsiyet, rüya takımı ve favori takımı kaydeder; yalnızca ayarlar yeniden yüklenir, kart verisi değişmez. */
export function useUpdateProfileDetails() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (details: ProfileDetailsInput) => updateProfileDetails({ data: details }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: viewerKeys.all })
  })
}
