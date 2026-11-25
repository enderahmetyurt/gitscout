import { createFileRoute, stripSearchParams } from "@tanstack/react-router"

import { pageMeta } from "@/config/seo.config"

import { hreflangLinks } from "@/helpers/localized-url"

import { Pending } from "@/components/shared/Pending"
import { leaderboardQueryOptions } from "@/features/scout/api/players.queries"
import { ScoutHome } from "@/features/scout/components/ScoutHome"
import {
  leaderboardSearchDefaults,
  leaderboardSearchSchema
} from "@/features/scout/schemas/leaderboard-search.schema"
import * as m from "@/paraglide/messages.js"

export const Route = createFileRoute("/{-$lang}/")({
  validateSearch: leaderboardSearchSchema,
  search: { middlewares: [stripSearchParams(leaderboardSearchDefaults)] },
  loader: ({ context }) => context.queryClient.ensureQueryData(leaderboardQueryOptions()),
  head: () => ({ meta: pageMeta(m.meta_home()), links: hreflangLinks("/") }),
  pendingComponent: Pending,
  component: ScoutHome
})
