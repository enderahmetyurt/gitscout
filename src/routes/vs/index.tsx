import { createFileRoute } from "@tanstack/react-router"

import { Pending } from "@/components/shared/Pending"
import { leaderboardQueryOptions } from "@/features/scout/api/players.queries"
import { DuelPicker } from "@/features/scout/components/DuelPicker"

export const Route = createFileRoute("/vs/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(leaderboardQueryOptions()),
  head: () => ({ meta: [{ title: "Kapışma · Gitscout" }] }),
  pendingComponent: Pending,
  component: DuelPicker
})
