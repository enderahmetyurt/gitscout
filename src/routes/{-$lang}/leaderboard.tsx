import { createFileRoute, stripSearchParams } from "@tanstack/react-router"

import { pageMeta } from "@/config/seo.config"

import { hreflangLinks } from "@/helpers/localized-url"

import { leaderboardQueryOptions } from "@/features/scout/api/players.queries"
import { LeaderboardPage } from "@/features/scout/components/LeaderboardPage"
import { LeaderboardSkeleton } from "@/features/scout/components/LeaderboardSkeleton"
import {
  leaderboardSearchDefaults,
  leaderboardSearchSchema
} from "@/features/scout/schemas/leaderboard-search.schema"
import * as m from "@/paraglide/messages.js"

export const Route = createFileRoute("/{-$lang}/leaderboard")({
  validateSearch: leaderboardSearchSchema,
  search: { middlewares: [stripSearchParams(leaderboardSearchDefaults)] },
  loader: ({ context }) => context.queryClient.ensureQueryData(leaderboardQueryOptions()),
  head: () => ({
    meta: pageMeta(m.meta_leaderboard(), m.meta_leaderboard_description()),
    links: hreflangLinks("/leaderboard")
  }),
  pendingComponent: LeaderboardSkeleton,
  component: LeaderboardPage
})
