import { createFileRoute } from "@tanstack/react-router"

import { hreflangLinks } from "@/helpers/localized-url"

import { Pending } from "@/components/shared/Pending"
import { leaderboardQueryOptions } from "@/features/scout/api/players.queries"
import { DuelPicker } from "@/features/scout/components/DuelPicker"
import { duelSearchSchema } from "@/features/scout/schemas/duel-search.schema"
import * as m from "@/paraglide/messages.js"

export const Route = createFileRoute("/{-$lang}/vs/")({
  validateSearch: duelSearchSchema,
  loader: ({ context }) => context.queryClient.ensureQueryData(leaderboardQueryOptions()),
  head: () => ({ meta: [{ title: m.meta_duel() }], links: hreflangLinks("/vs") }),
  pendingComponent: Pending,
  component: DuelPicker
})
