import { createFileRoute } from "@tanstack/react-router"

import { playerBadgeResponse } from "@/features/scout/api/badge.api"
import { badgeLocaleSchema } from "@/features/scout/schemas/badge.schema"

/**
 * Profil README'lerine eklenen rozet; adres kalıcıdır, dil önekine bağlı değildir. Dil `?lang=tr` ile
 * seçilir; verilmeyen ya da tanınmayan dil İngilizceye düşer.
 */
export const Route = createFileRoute("/badge/{$username}.svg")({
  server: {
    handlers: {
      GET: ({ params, request }) => {
        const locale = badgeLocaleSchema
          .catch("en")
          .parse(new URL(request.url).searchParams.get("lang") ?? undefined)
        return playerBadgeResponse(params.username, locale)
      }
    }
  }
})
