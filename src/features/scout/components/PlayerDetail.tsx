import { Link } from "@tanstack/react-router"
import { ArrowLeft, ArrowUpRight, RefreshCw } from "lucide-react"
import { toast } from "sonner"

import { Button, buttonVariants } from "@/components/ui/button"
import { BadgeIcon } from "@/features/scout/components/BadgeIcon"
import { CardActions } from "@/features/scout/components/CardActions"
import { PlayerCard } from "@/features/scout/components/PlayerCard"
import { PositionBreakdown } from "@/features/scout/components/PositionBreakdown"
import { StatRadar } from "@/features/scout/components/StatRadar"
import { TopRepos } from "@/features/scout/components/TopRepos"
import { YearSummary } from "@/features/scout/components/YearSummary"
import { RARITY_LABELS } from "@/features/scout/constants/scoring.constants"
import { useAddPlayer } from "@/features/scout/hooks/use-add-player"
import { useCardDownload } from "@/features/scout/hooks/use-card-download"
import { usePlayer } from "@/features/scout/hooks/use-player"

type PlayerDetailProps = {
  username: string
}

const dateFormat = new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" })

export function PlayerDetail({ username }: PlayerDetailProps) {
  const { data: player } = usePlayer(username)
  const refresh = useAddPlayer()
  const { cardRef, download, isDownloading } = useCardDownload(`gitscout-${username}`)

  const onRefresh = () => {
    refresh.mutate(
      { username: player.login, refresh: true },
      {
        onSuccess: () => toast.success("Veriler GitHub'dan yeniden çekildi"),
        onError: (error) => toast.error(error.message)
      }
    )
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 pt-2 pb-20 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          to="/"
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
            className: "-ms-2 w-fit ps-2"
          })}
        >
          <ArrowLeft aria-hidden />
          Liderlik tablosu
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-muted-foreground sm:inline">
            Son güncelleme: {dateFormat.format(new Date(player.fetchedAt))}
          </span>
          <Button variant="ghost" size="sm" onClick={onRefresh} disabled={refresh.isPending}>
            <RefreshCw aria-hidden className={refresh.isPending ? "animate-spin" : undefined} />
            {refresh.isPending ? "Yenileniyor…" : "Verileri yenile"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[20rem_1fr] md:items-start">
        <aside className="flex flex-col items-center gap-5 md:sticky md:top-6">
          <div data-rarity={player.rarity} className="relative">
            <div aria-hidden className="scout-card-glow pointer-events-none absolute -inset-8" />
            <div className="card-lift relative">
              <PlayerCard player={player} ref={cardRef} />
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <CardActions player={player} onDownload={download} isDownloading={isDownloading} />
            <p className="text-sm text-muted-foreground">
              Genel{" "}
              <span className="font-medium text-foreground tabular-nums">
                {player.ranking.overall}.
              </span>
              <span className="tabular-nums">/{player.ranking.total}</span>
              <span aria-hidden> · </span>
              <span lang="en">{player.position}</span>{" "}
              <span className="font-medium text-foreground tabular-nums">
                {player.ranking.inPosition}.
              </span>
              <span className="tabular-nums">/{player.ranking.positionTotal}</span>
            </p>
            <a
              href={`https://github.com/${player.login}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-0.5 rounded-sm text-sm text-muted-foreground underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              @{player.login}
              <ArrowUpRight aria-hidden className="size-4" />
              <span className="sr-only"> (GitHub profili, yeni sekmede açılır)</span>
            </a>
            <ArchetypeLine archetype={player.archetype} />
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-6">
          {/* Ad, unvan, mevki ve kulüp kartın üzerinde; başlık yalnızca ekran okuyucular için. */}
          <h1 className="sr-only">
            {player.name}, {RARITY_LABELS[player.rarity]} kart, genel {player.ovr}
          </h1>

          <section className="flex flex-col gap-4" aria-labelledby="stats-heading">
            <h2 id="stats-heading" className="sr-only">
              Statlar
            </h2>
            {/* 2×2 grid: aynı satırdaki kartlar aynı yüksekliğe uzar, üst ve alt kenarlar hizalanır. */}
            <div className="grid gap-6 lg:grid-cols-2">
              <StatRadar stats={player.stats} />
              <TopRepos repos={player.topRepos} />
              <PositionBreakdown position={player.position} breakdown={player.positionBreakdown} />
              <YearSummary year={player.year} />
            </div>
          </section>

          <section className="flex flex-col gap-4" aria-labelledby="badges-heading">
            <h2 id="badges-heading" className="text-lg font-semibold">
              Rozetler
            </h2>
            {player.badges.length === 0 ? (
              <p className="surface px-4 py-6 text-center text-sm text-muted-foreground">
                Henüz kazanılmış rozet yok.
              </p>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {player.badges.map((badge) => (
                  <li key={badge.id} className="surface flex items-start gap-3 p-3">
                    <span
                      data-badge={badge.id}
                      className="badge-tint grid size-9 shrink-0 place-items-center rounded-md"
                    >
                      <BadgeIcon id={badge.id} className="size-4.5" />
                    </span>
                    <div className="min-w-0 text-sm">
                      <p className="font-medium">{badge.name}</p>
                      <p className="mt-0.5 text-xs text-pretty text-muted-foreground">
                        {badge.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

/** "Seçkin profil: …" cümlesinin başını vurgular. */
function ArchetypeLine({ archetype }: { archetype: string }) {
  const [lead, rest] = archetype.split(/:\s(.*)/s)
  return (
    <p className="max-w-80 text-center text-sm text-pretty text-muted-foreground">
      <span className="font-medium text-foreground">{lead}</span>
      {rest ? `: ${rest}` : null}
    </p>
  )
}
