import { useState } from "react"

import { Link } from "@tanstack/react-router"
import { ArrowLeft, ArrowUpRight } from "lucide-react"

import { getLangParam } from "@/helpers/localized-url"

import { useViewer } from "@/hooks/use-viewer"

import { GithubStarCta } from "@/components/shared/GithubStarCta"
import { buttonVariants } from "@/components/ui/button"
import { BadgeList } from "@/features/scout/components/BadgeList"
import { Benchmarks } from "@/features/scout/components/Benchmarks"
import { BirthdayConfetti } from "@/features/scout/components/BirthdayConfetti"
import { CardActions } from "@/features/scout/components/CardActions"
import { GetYourCard } from "@/features/scout/components/GetYourCard"
import { GithubStarBadge } from "@/features/scout/components/GithubStarBadge"
import { OccasionCardSwitch } from "@/features/scout/components/OccasionCardSwitch"
import { PlayerCard } from "@/features/scout/components/PlayerCard"
import { PlayerRank } from "@/features/scout/components/PlayerRank"
import { PositionBreakdown } from "@/features/scout/components/PositionBreakdown"
import { ScoutNote } from "@/features/scout/components/ScoutNote"
import { StatRadar } from "@/features/scout/components/StatRadar"
import { TopRepos } from "@/features/scout/components/TopRepos"
import { VerifiedIcon } from "@/features/scout/components/VerifiedIcon"
import { YearSummary } from "@/features/scout/components/YearSummary"
import { BIRTHDAY_OVR } from "@/features/scout/helpers/birthday"
import { isGithubStar } from "@/features/scout/helpers/github-star"
import { playerCountry } from "@/features/scout/helpers/player-country"
import { rarityLabel } from "@/features/scout/helpers/player-text"
import { isProgrammersDay } from "@/features/scout/helpers/programmers-day"
import { isHalloween, isNewYear, isRepublicDay } from "@/features/scout/helpers/special-days"
import { useCardDownload } from "@/features/scout/hooks/use-card-download"
import { usePlayer } from "@/features/scout/hooks/use-player"
import * as m from "@/paraglide/messages.js"
import { getLocale } from "@/paraglide/runtime.js"

type PlayerDetailProps = {
  username: string
}

export function PlayerDetail({ username }: PlayerDetailProps) {
  const { data: player } = usePlayer(username)
  const { data: viewer } = useViewer()
  // Özel günde varsayılan kutlama kartı; gerçek kart da görülüp indirilebilir.
  // Aynı güne birden çok özel gün denk gelirse kişiye özel olan önce gelir: doğum günü, sonra ülkeye özel gün.
  // Özel gün yoksa onaylı sahibin seçtiği kalıcı kart (takım ya da GitHub Star) varsayılan olur.
  const [preferReal, setPreferReal] = useState(false)
  const now = new Date()
  const occasion = player.birthdayToday
    ? "birthday"
    : isRepublicDay(now) && playerCountry(player) === "TR"
      ? "republic-day"
      : isHalloween(now)
        ? "halloween"
        : isNewYear(now)
          ? "new-year"
          : isProgrammersDay(now)
            ? "programmers-day"
            : (player.cardFace ?? null)
  const shownOccasion = occasion && !preferReal ? occasion : undefined
  const birthday = shownOccasion === "birthday"
  const cardPlayer = birthday
    ? { ...player, ovr: BIRTHDAY_OVR, ovrExact: BIRTHDAY_OVR, rarity: "icon" as const }
    : player
  const { cardRef, download, isDownloading } = useCardDownload(
    shownOccasion ? `gitscout-${username}-${shownOccasion}` : `gitscout-${username}`
  )

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 overflow-x-clip px-4 pt-2 pb-20 outline-none sm:px-6"
    >
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

      <div className="grid gap-6 md:grid-cols-[20rem_1fr] md:items-start">
        <aside className="flex flex-col items-center gap-4 md:sticky md:top-6">
          {occasion ? (
            <OccasionCardSwitch
              occasion={occasion}
              name={player.name}
              isOwner={viewer?.login.toLowerCase() === player.login.toLowerCase()}
              active={!preferReal}
              onChange={(next) => setPreferReal(!next)}
            />
          ) : null}
          {/* Kalıcı kart gösterilirken gerçek kartın nadirliği görünür kalır: dört seviyeli sistem gizlenmez. */}
          {shownOccasion && shownOccasion === player.cardFace ? (
            <p className="-mt-2 text-xs text-muted-foreground">
              {m.card_face_rarity({ rarity: rarityLabel(player.rarity) })}
            </p>
          ) : null}
          {birthday ? <BirthdayConfetti /> : null}
          <div
            data-rarity={cardPlayer.rarity}
            className="relative flex w-full max-w-80 justify-center"
          >
            <div aria-hidden className="scout-card-glow pointer-events-none absolute -inset-8" />
            <div className="card-lift relative">
              <PlayerCard player={cardPlayer} ref={cardRef} occasion={shownOccasion} />
            </div>
          </div>
          <PlayerRank ranking={player.ranking} position={player.position} />
          {isGithubStar(player.login) ? <GithubStarBadge login={player.login} /> : null}
          <CardActions player={player} onDownload={download} isDownloading={isDownloading} />
          <GithubStarCta />
          <div className="flex flex-col items-center gap-1">
            <span className="inline-flex items-center gap-1">
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
              {player.verified ? <VerifiedIcon /> : null}
            </span>
            <span className="text-xs text-muted-foreground">
              {m.last_updated({
                date: new Intl.DateTimeFormat(getLocale(), { dateStyle: "medium" }).format(
                  new Date(player.fetchedAt)
                )
              })}
            </span>
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

          <section aria-labelledby="stats-heading">
            <h2 id="stats-heading" className="sr-only">
              {m.stats_heading()}
            </h2>
            {/* Üstte radar ve repolar eşit yükseklikte; altındakiler tam genişlikte, içerik kadar uzar. */}
            <div className="flex flex-col gap-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <StatRadar stats={player.stats} />
                <TopRepos repos={player.topRepos} />
              </div>
              <div className="surface flex flex-col gap-4 p-4 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
                <ScoutNote archetype={player.archetype} />
                <YearSummary year={player.year} />
              </div>
              <PositionBreakdown position={player.position} breakdown={player.positionBreakdown} />
              <Benchmarks benchmarks={player.benchmarks} total={player.ranking.total} />
            </div>
          </section>

          <BadgeList badges={player.badges} />
        </div>
      </div>

      <div className="mt-4">
        <GetYourCard />
      </div>
    </main>
  )
}
