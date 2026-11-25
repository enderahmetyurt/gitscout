import { createFileRoute, Link } from "@tanstack/react-router"

import { pageMeta } from "@/config/seo.config"

import { getLangParam, hreflangLinks } from "@/helpers/localized-url"

import { Pending } from "@/components/shared/Pending"
import { buttonVariants } from "@/components/ui/button"
import { leaderboardQueryOptions, playerQueryOptions } from "@/features/scout/api/players.queries"
import { DuelView } from "@/features/scout/components/DuelView"
import * as m from "@/paraglide/messages.js"

export const Route = createFileRoute("/{-$lang}/vs/$left/$right")({
  loader: ({ context, params }) =>
    Promise.all([
      context.queryClient.ensureQueryData(playerQueryOptions(params.left)),
      context.queryClient.ensureQueryData(playerQueryOptions(params.right)),
      context.queryClient.ensureQueryData(leaderboardQueryOptions())
    ]),
  head: ({ params }) => ({
    meta: pageMeta(
      m.meta_duel_pair({ left: params.left, right: params.right }),
      m.meta_duel_pair_description({ left: params.left, right: params.right })
    ),
    links: hreflangLinks(`/vs/${params.left}/${params.right}`)
  }),
  pendingComponent: Pending,
  notFoundComponent: DuelNotFound,
  component: DuelPage
})

function DuelPage() {
  const { left, right } = Route.useParams()
  return <DuelView left={left} right={right} />
}

function DuelNotFound() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center gap-4 px-6 py-24 text-center outline-none"
    >
      <meta name="robots" content="noindex" />
      <h1 className="text-3xl font-bold">{m.duel_not_found_title()}</h1>
      <p className="text-muted-foreground">{m.duel_not_found_description()}</p>
      <Link to="/{-$lang}/vs" params={{ lang: getLangParam() }} className={buttonVariants()}>
        {m.duel_pick_players()}
      </Link>
    </main>
  )
}
