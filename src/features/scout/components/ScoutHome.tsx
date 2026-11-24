import { Link } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { AddPlayerForm } from "@/features/scout/components/AddPlayerForm"
import { EmptyLeaderboard } from "@/features/scout/components/EmptyLeaderboard"
import { LeaderboardTable } from "@/features/scout/components/LeaderboardTable"
import { StaleNotice } from "@/features/scout/components/StaleNotice"
import { STAT_LABELS, STAT_ORDER } from "@/features/scout/constants/scoring.constants"
import { useLeaderboard } from "@/features/scout/hooks/use-leaderboard"

/** Ana sayfada yalnızca ilk oyuncular; tamamı liderlik sayfasında. */
const HOME_LIMIT = 10

export function ScoutHome() {
  const { data } = useLeaderboard()
  const { players: allPlayers, staleCount } = data
  // Sunucu listeyi genel puana göre sıralı döner.
  const players = allPlayers.slice(0, HOME_LIMIT)

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-4 pt-6 pb-20 sm:px-6">
      <section className="flex max-w-2xl flex-col gap-5 pt-4 sm:pt-8">
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          GitHub'ın scout raporu
        </h1>
        <p className="max-w-xl text-pretty text-muted-foreground sm:text-lg">
          Kullanıcı adını gir, GitHub profilini oyuncu kartına çevirelim. Organizasyonlardaki emeğin
          de katkı payın kadar sayılır.
        </p>
        <div className="max-w-xl">
          <AddPlayerForm />
        </div>
        <dl className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm" aria-label="Statlar">
          {STAT_ORDER.map((key) => (
            <div key={key} className="flex items-baseline gap-1.5">
              <dt lang="en" className="text-xs font-semibold tracking-wide">
                {STAT_LABELS[key].short}
              </dt>
              <dd className="text-muted-foreground">{STAT_LABELS[key].label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="leaderboard-heading">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="leaderboard-heading" className="text-xl font-semibold">
            İlk {HOME_LIMIT}
          </h2>
          {allPlayers.length > HOME_LIMIT ? (
            <Link to="/leaderboard" className={buttonVariants({ variant: "outline", size: "sm" })}>
              Tüm tablo ({allPlayers.length})
              <ArrowRight aria-hidden />
            </Link>
          ) : null}
        </div>

        <StaleNotice count={staleCount} />

        {allPlayers.length === 0 ? <EmptyLeaderboard /> : <LeaderboardTable players={players} />}
      </section>
    </main>
  )
}
