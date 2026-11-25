import { getRouteApi, Link } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"

import { getLangParam } from "@/helpers/localized-url"

import { GithubStarLink } from "@/components/shared/GithubStarLink"
import { buttonVariants } from "@/components/ui/button"
import { AddPlayerForm } from "@/features/scout/components/AddPlayerForm"
import { EmptyLeaderboard } from "@/features/scout/components/EmptyLeaderboard"
import { FeaturedCard } from "@/features/scout/components/FeaturedCard"
import { LeaderboardTable } from "@/features/scout/components/LeaderboardTable"
import { RarityLegend } from "@/features/scout/components/RarityLegend"
import { RecentlyAdded } from "@/features/scout/components/RecentlyAdded"
import { TopViewSwitch } from "@/features/scout/components/TopViewSwitch"
import type { TopView } from "@/features/scout/components/TopViewSwitch"
import { STAT_ORDER } from "@/features/scout/constants/scoring.constants"
import { playerCountry } from "@/features/scout/helpers/player-country"
import { statLabel, statShort } from "@/features/scout/helpers/player-text"
import { useLeaderboard } from "@/features/scout/hooks/use-leaderboard"
import * as m from "@/paraglide/messages.js"
import { getLocale } from "@/paraglide/runtime.js"

/** Ana sayfada yalnızca ilk oyuncular; tamamı liderlik sayfasında. */
const HOME_LIMIT = 10

const routeApi = getRouteApi("/{-$lang}/")

export function ScoutHome() {
  const { data } = useLeaderboard()
  const { top } = routeApi.useSearch()
  const { players: allPlayers } = data

  // Yalnızca Türkçe sayfada Türkiye listesi var ve varsayılan odur; İngilizcede hep genel sıralama.
  const turkishPlayers = allPlayers.filter((player) => playerCountry(player) === "TR")
  const canSwitch = getLocale() === "tr" && turkishPlayers.length > 0
  const view: TopView = canSwitch && top !== "world" ? "tr" : "world"
  // Sunucu listeyi genel puana göre sıralı döner; sıra numaraları seçili listenin içinde sayılır.
  const pool = view === "tr" ? turkishPlayers : allPlayers
  const players = pool.slice(0, HOME_LIMIT)

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
          <GithubStarLink placement="hero" className="self-start" />
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
        {/* Ödül önden görünsün: geniş ekranda vitrin kartı başlığın yanında. */}
        <FeaturedCard
          players={allPlayers}
          recentLogins={data.recentLogins}
          seed={data.featuredSeed}
        />
      </div>

      <RecentlyAdded
        players={allPlayers}
        latest={data.latest}
        lastHourCount={data.lastHourCount}
        generatedAt={data.generatedAt}
      />

      <section className="flex flex-col gap-4" aria-labelledby="leaderboard-heading">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h2 id="leaderboard-heading" className="text-xl font-semibold">
              {m.home_top({ count: HOME_LIMIT })}
            </h2>
            {canSwitch ? <TopViewSwitch view={view} /> : null}
          </div>
          {pool.length > HOME_LIMIT ? (
            <Link
              to="/{-$lang}/leaderboard"
              params={{ lang: getLangParam() }}
              search={view === "tr" ? { country: "tr" } : {}}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              {view === "tr"
                ? m.home_full_table_tr({ count: pool.length })
                : m.home_full_table({ count: pool.length })}
              <ArrowRight aria-hidden />
            </Link>
          ) : null}
        </div>

        {allPlayers.length === 0 ? (
          <EmptyLeaderboard />
        ) : (
          <>
            <LeaderboardTable players={players} rankPool={pool} />
            <RarityLegend className="justify-center" />
          </>
        )}
      </section>
    </main>
  )
}
