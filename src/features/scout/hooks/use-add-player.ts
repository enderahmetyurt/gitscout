import { useMutation, useQueryClient } from "@tanstack/react-query"

import { addPlayer } from "@/features/scout/api/players.functions"
import { playerKeys } from "@/features/scout/api/query-keys"

/**
 * Vercel Firewall'daki IP sınırı aşılınca istek sunucu fonksiyonuna hiç ulaşmaz ve 429 döner.
 * Bu gövde TanStack Start'ın serileştirdiği bir yanıt olmadığından istemci onu sabit bir hata
 * koduna çeviremez; arayüzün doğru mesajı gösterebilmesi için 429 burada koda dönüştürülür.
 */
async function fetchWithRateLimit(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const response = await fetch(input, init)
  if (response.status === 429) throw new Error("limit:too-many-requests")
  return response
}

export function useAddPlayer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (username: string) => addPlayer({ data: { username }, fetch: fetchWithRateLimit }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: playerKeys.all })
  })
}
