import { createFileRoute } from "@tanstack/react-router"

import { isAuthorizedCron, refreshStalePlayers } from "@/features/scout/api/refresh-players.api"

/** Vercel Cron saatte bir çağırır; verisi bir haftadan eski birkaç kartı yeniler. */
export const Route = createFileRoute("/api/cron/refresh")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!isAuthorizedCron(request.headers.get("authorization"))) {
          return new Response("Unauthorized", { status: 401 })
        }
        return Response.json(await refreshStalePlayers(), {
          headers: { "Cache-Control": "no-store" }
        })
      }
    }
  }
})
