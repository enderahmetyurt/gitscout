import { Link } from "@tanstack/react-router"
import { ArrowLeft, ArrowUpRight, RefreshCw } from "lucide-react"
import { toast } from "sonner"

import { getLangParam } from "@/helpers/localized-url"

import { Button, buttonVariants } from "@/components/ui/button"
import { BadgeIcon } from "@/features/scout/components/BadgeIcon"
import { CardActions } from "@/features/scout/components/CardActions"
import { PlayerCard } from "@/features/scout/components/PlayerCard"
import { PositionBreakdown } from "@/features/scout/components/PositionBreakdown"
import { StatRadar } from "@/features/scout/components/StatRadar"
import { TopRepos } from "@/features/scout/components/TopRepos"
import { YearSummary } from "@/features/scout/components/YearSummary"
import { errorText } from "@/features/scout/helpers/error-text"
import {
  archetypeText,
  badgeDetail,
  badgeName,
  rarityLabel
} from "@/features/scout/helpers/player-text"
import { useAddPlayer } from "@/features/scout/hooks/use-add-player"
import { useCardDownload } from "@/features/scout/hooks/use-card-download"
import { usePlayer } from "@/features/scout/hooks/use-player"
import type { Archetype } from "@/features/scout/types/player.types"
import * as m from "@/paraglide/messages.js"
import { getLocale } from "@/paraglide/runtime.js"

type PlayerDetailProps = {
  username: string
}

export function PlayerDetail({ username }: PlayerDetailProps) {
  const { data: player } = usePlayer(username)
  const refresh = useAddPlayer()
  const { cardRef, download, isDownloading } = useCardDownload(`gitscout-${username}`)

  const onRefresh = () => {
    refresh.mutate(
      { username: player.login, refresh: true },
      {
        onSuccess: () => toast.success(m.refresh_success()),
        onError: (error) => toast.error(errorText(error))
      }
    )
  }

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 pt-2 pb-20 outline-none sm:px-6"
    >
      <div className="flex items-center justify-between gap-3">
        <Link
          to="/{-$lang}/leaderboard"
          params={{ lang: getLangParam() }}
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
            className: "-ms-2 w-fit ps-2"
          })}
        >
          <ArrowLeft aria-hidden />
          {m.back_to_leaderboard()}
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-muted-foreground sm:inline">
            {m.last_updated({
              date: new Intl.DateTimeFormat(getLocale(), {
                dateStyle: "medium",
                timeStyle: "short"
              }).format(new Date(player.fetchedAt))
            })}
          </span>
          <Button variant="ghost" size="sm" onClick={onRefresh} disabled={refresh.isPending}>
            <RefreshCw aria-hidden className={refresh.isPending ? "animate-spin" : undefined} />
            {refresh.isPending ? m.refreshing() : m.refresh()}
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
              {m.ranking({
                overall: player.ranking.overall,
                total: player.ranking.total,
                position: player.position,
                inPosition: player.ranking.inPosition,
                positionTotal: player.ranking.positionTotal
              })}
            </p>
            <a
              href={`https://github.com/${player.login}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-6 items-center gap-0.5 rounded-sm text-sm text-muted-foreground underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              @{player.login}
              <ArrowUpRight aria-hidden className="size-4" />
              <span className="sr-only"> {m.github_profile()}</span>
            </a>
            <ArchetypeLine archetype={player.archetype} />
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-6">
          {/* Ad, unvan, mevki ve kulüp kartın üzerinde; başlık yalnızca ekran okuyucular için. */}
          <h1 className="sr-only">
            {m.player_heading({
              name: player.name,
              rarity: rarityLabel(player.rarity),
              ovr: player.ovr
            })}
          </h1>

          <section className="flex flex-col gap-4" aria-labelledby="stats-heading">
            <h2 id="stats-heading" className="sr-only">
              {m.stats_heading()}
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
              {m.badges_heading()}
            </h2>
            {player.badges.length === 0 ? (
              <p className="surface px-4 py-6 text-center text-sm text-muted-foreground">
                {m.badges_empty()}
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
                      <p className="font-medium">{badgeName(badge.id)}</p>
                      <p className="mt-0.5 text-xs text-pretty text-muted-foreground">
                        {badgeDetail(badge)}
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
function ArchetypeLine({ archetype }: { archetype: Archetype }) {
  const { lead, text } = archetypeText(archetype)
  return (
    <p className="max-w-80 text-center text-sm text-pretty text-muted-foreground">
      <span className="font-medium text-foreground">{lead}</span>
      {text.slice(lead.length)}
    </p>
  )
}
