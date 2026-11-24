import { createFileRoute } from "@tanstack/react-router"

import { hreflangLinks } from "@/helpers/localized-url"

import { Pending } from "@/components/shared/Pending"
import { playerQueryOptions } from "@/features/scout/api/players.queries"
import { AddPlayerForm } from "@/features/scout/components/AddPlayerForm"
import { PlayerDetail } from "@/features/scout/components/PlayerDetail"
import * as m from "@/paraglide/messages.js"

export const Route = createFileRoute("/{-$lang}/u/$username")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(playerQueryOptions(params.username)),
  head: ({ params }) => ({
    meta: [{ title: `${params.username} · Gitscout` }],
    links: hreflangLinks(`/u/${params.username}`)
  }),
  pendingComponent: Pending,
  notFoundComponent: PlayerNotFound,
  component: PlayerPage
})

function PlayerPage() {
  const { username } = Route.useParams()
  return <PlayerDetail username={username} />
}

function PlayerNotFound() {
  const { username } = Route.useParams()
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center gap-4 px-6 py-24 text-center outline-none"
    >
      <h1 className="text-3xl font-bold">{m.player_not_found_title({ username })}</h1>
      <p className="text-muted-foreground">{m.player_not_found_description()}</p>
      <div className="w-full text-left">
        <AddPlayerForm defaultUsername={username} />
      </div>
    </main>
  )
}
