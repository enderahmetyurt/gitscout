import { createFileRoute, Link } from "@tanstack/react-router"

import { Pending } from "@/components/shared/Pending"
import { buttonVariants } from "@/components/ui/button"
import { playerQueryOptions } from "@/features/scout/api/players.queries"
import { PlayerDetail } from "@/features/scout/components/PlayerDetail"

export const Route = createFileRoute("/u/$username")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(playerQueryOptions(params.username)),
  head: ({ params }) => ({ meta: [{ title: `${params.username} · Gitscout` }] }),
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
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center gap-4 px-6 py-24 text-center">
      <h1 className="text-3xl font-bold">@{username} henüz kadroda değil</h1>
      <p className="text-muted-foreground">
        Bu oyuncunun kartı çıkarılmamış. Ana sayfadan kullanıcı adını girerek ekleyebilirsin.
      </p>
      <Link to="/" className={buttonVariants()}>
        Ana sayfaya dön
      </Link>
    </main>
  )
}
