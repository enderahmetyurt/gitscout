import { useMutation, useQueryClient } from "@tanstack/react-query"

import { addPlayerStream } from "@/features/scout/api/players.functions"
import { playerKeys } from "@/features/scout/api/query-keys"
import type { ScoutingStage } from "@/features/scout/types/add-player.types"
import type { ScoredPlayer } from "@/features/scout/types/player.types"

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

type UseAddPlayerOptions = {
  /** GitHub'dan veri toplanırken biten her aşamada çağrılır; kayıtlı oyuncuda hiç çağrılmaz. */
  onStage?: (stage: ScoutingStage) => void
}

/** Kartı ekler; aşamaları akışla okuyup `onStage`'e iletir, sonunda kaydedilen kartı döner. */
export function useAddPlayer({ onStage }: UseAddPlayerOptions = {}) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (username: string): Promise<ScoredPlayer> => {
      const events = await addPlayerStream({ data: { username }, fetch: fetchWithRateLimit })
      for await (const event of events) {
        if (event.type === "done") return event.player
        onStage?.(event)
      }
      throw new Error("stream:incomplete")
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: playerKeys.all })
  })
}
