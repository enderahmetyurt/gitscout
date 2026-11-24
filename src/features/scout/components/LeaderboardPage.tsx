import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { EmptyLeaderboard } from "@/features/scout/components/EmptyLeaderboard"
import { LeaderboardFilters } from "@/features/scout/components/LeaderboardFilters"
import { LeaderboardTable } from "@/features/scout/components/LeaderboardTable"
import { RarityLegend } from "@/features/scout/components/RarityLegend"
import { matchesPlayer } from "@/features/scout/helpers/search-text"
import { useLeaderboard } from "@/features/scout/hooks/use-leaderboard"
import { useLeaderboardSearch } from "@/features/scout/hooks/use-leaderboard-search"
import * as m from "@/paraglide/messages.js"

export function LeaderboardPage() {
  const { data } = useLeaderboard()
  const { players: allPlayers } = data
  const { search, filters, update } = useLeaderboardSearch()
  const query = search.q ?? ""
  const players = allPlayers.filter(
    (player) =>
      matchesPlayer(player, query) &&
      (filters.positions.length === 0 || filters.positions.includes(player.position)) &&
      (filters.rarities.length === 0 || filters.rarities.includes(player.rarity))
  )

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 pt-6 pb-20 outline-none sm:px-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">{m.leaderboard_title()}</h1>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {players.length === allPlayers.length
              ? m.players_count({ count: players.length })
              : m.players_count_filtered({ shown: players.length, total: allPlayers.length })}
          </span>
          {allPlayers.length > 0 ? (
            <>
              <div className="relative">
                <Search
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  type="search"
                  value={query}
                  onChange={(event) => update({ q: event.target.value || undefined })}
                  placeholder={m.search_placeholder()}
                  aria-label={m.search_label()}
                  className="h-8 w-48 ps-8 sm:w-56"
                />
              </div>
              <LeaderboardFilters players={allPlayers} />
            </>
          ) : null}
        </div>
      </div>

      {allPlayers.length === 0 ? (
        <EmptyLeaderboard />
      ) : players.length === 0 ? (
        <p className="surface px-4 py-8 text-center text-sm text-muted-foreground">
          {m.filter_empty()}
        </p>
      ) : (
        <LeaderboardTable players={players} allPlayers={allPlayers} />
      )}
      {allPlayers.length > 0 ? <RarityLegend className="justify-center" /> : null}
    </main>
  )
}
