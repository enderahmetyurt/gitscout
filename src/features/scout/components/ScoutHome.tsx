import { Link } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"

import { getLangParam } from "@/helpers/localized-url"

import { buttonVariants } from "@/components/ui/button"
import { AddPlayerForm } from "@/features/scout/components/AddPlayerForm"
import { EmptyLeaderboard } from "@/features/scout/components/EmptyLeaderboard"
import { LeaderboardTable } from "@/features/scout/components/LeaderboardTable"
import { PlayerCard } from "@/features/scout/components/PlayerCard"
import { RarityLegend } from "@/features/scout/components/RarityLegend"
import { STAT_ORDER } from "@/features/scout/constants/scoring.constants"
import { statLabel, statShort } from "@/features/scout/helpers/player-text"
import { useLeaderboard } from "@/features/scout/hooks/use-leaderboard"
import * as m from "@/paraglide/messages.js"

/** Ana sayfada yalnızca ilk oyuncular; tamamı liderlik sayfasında. */
const HOME_LIMIT = 10

export function ScoutHome() {
  const { data } = useLeaderboard()
  const { players: allPlayers } = data
  // Sunucu listeyi genel puana göre sıralı döner.
  const players = allPlayers.slice(0, HOME_LIMIT)
  const leader = players[0]

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-4 pt-6 pb-20 outline-none sm:px-6"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
        <section className="flex max-w-2xl flex-col gap-5 pt-4 sm:pt-8">
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {m.home_title()}
          </h1>
          <p className="max-w-xl text-pretty text-muted-foreground sm:text-lg">{m.home_lead()}</p>
          <div className="max-w-xl">
            <AddPlayerForm />
          </div>
          {/* İki dilde de aynı düzen: kelime uzunluğu değişse de 3×2 ızgara taşmaz. */}
          <dl
            className="grid max-w-xl grid-cols-2 gap-x-4 gap-y-1.5 text-sm sm:grid-cols-3"
            aria-label={m.home_stats_label()}
          >
            {STAT_ORDER.map((key) => (
              <div key={key} className="flex items-baseline gap-1.5">
                <dt className="text-xs font-semibold tracking-wide">{statShort(key)}</dt>
                <dd className="text-muted-foreground">{statLabel(key)}</dd>
              </div>
            ))}
          </dl>
        </section>
        {leader ? (
          // Ödül önden görünsün: geniş ekranda zirvedeki oyuncunun kartı başlığın yanında.
          <Link
            to="/{-$lang}/u/$username"
            params={{ lang: getLangParam(), username: leader.login }}
            aria-label={m.duel_open_card({ name: leader.name })}
            className="card-lift hidden w-80 rounded-[28px] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 lg:block"
          >
            <PlayerCard player={leader} />
          </Link>
        ) : null}
      </div>

      <section className="flex flex-col gap-4" aria-labelledby="leaderboard-heading">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="leaderboard-heading" className="text-xl font-semibold">
            {m.home_top({ count: HOME_LIMIT })}
          </h2>
          {allPlayers.length > HOME_LIMIT ? (
            <Link
              to="/{-$lang}/leaderboard"
              params={{ lang: getLangParam() }}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              {m.home_full_table({ count: allPlayers.length })}
              <ArrowRight aria-hidden />
            </Link>
          ) : null}
        </div>

        {allPlayers.length === 0 ? (
          <EmptyLeaderboard />
        ) : (
          <>
            <LeaderboardTable players={players} rankPool={allPlayers} />
            <RarityLegend className="justify-center" />
          </>
        )}
      </section>
    </main>
  )
}
