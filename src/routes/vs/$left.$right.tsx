import { createFileRoute, Link } from "@tanstack/react-router"

import { Pending } from "@/components/shared/Pending"
import { buttonVariants } from "@/components/ui/button"
import { playerQueryOptions } from "@/features/scout/api/players.queries"
import { DuelView } from "@/features/scout/components/DuelView"

export const Route = createFileRoute("/vs/$left/$right")({
  loader: ({ context, params }) =>
    Promise.all([
      context.queryClient.ensureQueryData(playerQueryOptions(params.left)),
      context.queryClient.ensureQueryData(playerQueryOptions(params.right))
    ]),
  head: ({ params }) => ({
    meta: [{ title: `${params.left} vs ${params.right} · Gitscout` }]
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
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center gap-4 px-6 py-24 text-center">
      <h1 className="text-3xl font-bold">Oyunculardan biri kadroda değil</h1>
      <p className="text-muted-foreground">
        Kapışma için iki oyuncunun da kartı çıkarılmış olmalı.
      </p>
      <Link to="/vs" className={buttonVariants()}>
        Oyuncu seç
      </Link>
    </main>
  )
}
