import { EmptyLeaderboard } from "@/features/scout/components/EmptyLeaderboard"
import { LeaderboardFilters } from "@/features/scout/components/LeaderboardFilters"
import { LeaderboardTable } from "@/features/scout/components/LeaderboardTable"
import { StaleNotice } from "@/features/scout/components/StaleNotice"
import { useLeaderboard } from "@/features/scout/hooks/use-leaderboard"
import { useLeaderboardSearch } from "@/features/scout/hooks/use-leaderboard-search"

export function LeaderboardPage() {
  const { data } = useLeaderboard()
  const { players: allPlayers, staleCount } = data
  const { search } = useLeaderboardSearch()
  const players = allPlayers.filter(
    (player) =>
      (!search.pos?.length || search.pos.includes(player.position)) &&
      (!search.rarity?.length || search.rarity.includes(player.rarity))
  )

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 pt-6 pb-20 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Liderlik tablosu</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {players.length === allPlayers.length
              ? `${players.length} oyuncu`
              : `${players.length} / ${allPlayers.length} oyuncu`}
          </span>
          {allPlayers.length > 0 ? <LeaderboardFilters players={allPlayers} /> : null}
        </div>
      </div>

      <StaleNotice count={staleCount} />

      {allPlayers.length === 0 ? (
        <EmptyLeaderboard />
      ) : players.length === 0 ? (
        <p className="surface px-4 py-8 text-center text-sm text-muted-foreground">
          Bu filtrelere uyan oyuncu yok.
        </p>
      ) : (
        <LeaderboardTable players={players} />
      )}
    </main>
  )
}
