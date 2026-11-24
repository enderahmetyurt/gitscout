import { createFileRoute, stripSearchParams } from "@tanstack/react-router"

import { siteConfig } from "@/config/site.config"

import { Pending } from "@/components/shared/Pending"
import { leaderboardQueryOptions } from "@/features/scout/api/players.queries"
import { ScoutHome } from "@/features/scout/components/ScoutHome"
import {
  leaderboardSearchDefaults,
  leaderboardSearchSchema
} from "@/features/scout/schemas/leaderboard-search.schema"

export const Route = createFileRoute("/")({
  validateSearch: leaderboardSearchSchema,
  search: { middlewares: [stripSearchParams(leaderboardSearchDefaults)] },
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({ ...leaderboardQueryOptions(), staleTime: 0 }),
  head: () => ({ links: [{ rel: "canonical", href: siteConfig.url }] }),
  pendingComponent: Pending,
  component: ScoutHome
})
