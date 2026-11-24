import { createFileRoute, stripSearchParams } from "@tanstack/react-router"

import { hreflangLinks } from "@/helpers/localized-url"

import { Pending } from "@/components/shared/Pending"
import { leaderboardQueryOptions } from "@/features/scout/api/players.queries"
import { ScoutHome } from "@/features/scout/components/ScoutHome"
import {
  leaderboardSearchDefaults,
  leaderboardSearchSchema
} from "@/features/scout/schemas/leaderboard-search.schema"

export const Route = createFileRoute("/{-$lang}/")({
  validateSearch: leaderboardSearchSchema,
  search: { middlewares: [stripSearchParams(leaderboardSearchDefaults)] },
  loader: ({ context }) => context.queryClient.ensureQueryData(leaderboardQueryOptions()),
  head: () => ({ links: hreflangLinks("/") }),
  pendingComponent: Pending,
  component: ScoutHome
})
