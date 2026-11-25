import { createFileRoute } from "@tanstack/react-router"

import { playerBadgeResponse } from "@/features/scout/api/badge.api"

/** Profil README'lerine eklenen rozet; adres kalıcıdır, dil önekine bağlı değildir. */
export const Route = createFileRoute("/badge/{$username}.svg")({
  server: {
    handlers: {
      GET: ({ params }) => playerBadgeResponse(params.username)
    }
  }
})
