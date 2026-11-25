import { createFileRoute } from "@tanstack/react-router"

import { getTopPlayers } from "@/features/scout/api/players.functions"
import { toTopPlayer } from "@/features/scout/helpers/top-player"

const TOP_LIMIT = 100

/** Sıralamanın ilk 100'ü; README'yi günde bir güncelleyen GitHub Action buradan okur. */
export const Route = createFileRoute("/api/top.json")({
  server: {
    handlers: {
      GET: async () => {
        const { generatedAt, players } = await getTopPlayers(TOP_LIMIT)
        return Response.json(
          { generatedAt, players: players.map(toTopPlayer) },
          { headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" } }
        )
      }
    }
  }
})
