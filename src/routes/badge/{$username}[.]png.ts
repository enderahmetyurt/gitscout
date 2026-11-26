import { createFileRoute } from "@tanstack/react-router"

import { playerBadgeCardResponse } from "@/features/scout/api/badge-card.api"
import { badgeCardSizeSchema, badgeLocaleSchema } from "@/features/scout/schemas/badge.schema"

/**
 * README'nin kart rozeti: `?size=medium` (varsayılan) ya da `?size=full`, dil `?lang=tr` ile seçilir.
 * Adres kalıcıdır, dil önekine bağlı değildir; tanınmayan değerler README'yi kırmasın diye orta
 * karta ve İngilizceye düşer.
 */
export const Route = createFileRoute("/badge/{$username}.png")({
  server: {
    handlers: {
      GET: ({ params, request }) => {
        const search = new URL(request.url).searchParams
        const size = badgeCardSizeSchema.catch("medium").parse(search.get("size") ?? undefined)
        const locale = badgeLocaleSchema.catch("en").parse(search.get("lang") ?? undefined)
        return playerBadgeCardResponse(params.username, size, locale)
      }
    }
  }
})
