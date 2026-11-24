import { createFileRoute, stripSearchParams } from "@tanstack/react-router"

import { Pending } from "@/components/shared/Pending"
import { leaderboardQueryOptions } from "@/features/scout/api/players.queries"
import { LeaderboardPage } from "@/features/scout/components/LeaderboardPage"
import {
  leaderboardSearchDefaults,
  leaderboardSearchSchema
} from "@/features/scout/schemas/leaderboard-search.schema"

export const Route = createFileRoute("/leaderboard")({
  validateSearch: leaderboardSearchSchema,
  search: { middlewares: [stripSearchParams(leaderboardSearchDefaults)] },
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({ ...leaderboardQueryOptions(), staleTime: 0 }),
  head: () => ({ meta: [{ title: "Liderlik tablosu · Gitscout" }] }),
  pendingComponent: Pending,
  component: LeaderboardPage
})
