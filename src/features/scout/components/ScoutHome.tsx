import { RefreshCw, TriangleAlert, Users } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { AddPlayerForm } from "@/features/scout/components/AddPlayerForm"
import { LeaderboardTable } from "@/features/scout/components/LeaderboardTable"
import { STAT_LABELS, STAT_ORDER } from "@/features/scout/constants/scoring.constants"
import { useLeaderboard } from "@/features/scout/hooks/use-leaderboard"
import { useRefreshAll } from "@/features/scout/hooks/use-refresh-all"

export function ScoutHome() {
  const { data } = useLeaderboard()
  const refreshAll = useRefreshAll()
  const { players, staleCount } = data

  const onRefreshAll = () => {
    refreshAll.mutate(undefined, {
      onSuccess: ({ refreshed, failed }) => {
        if (failed.length === 0) toast.success(`${refreshed.length} oyuncu yenilendi`)
        else
          toast.error(
            `${refreshed.length} oyuncu yenilendi, ${failed.length} başarısız: ${failed
              .map((item) => `@${item.login} (${item.reason})`)
              .join(", ")}`
          )
      },
      onError: (error) => toast.error(error.message)
    })
  }

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
            Liderlik tablosu
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground tabular-nums">
              {players.length} oyuncu
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefreshAll}
              disabled={refreshAll.isPending || players.length + staleCount === 0}
            >
              <RefreshCw
                aria-hidden
                className={refreshAll.isPending ? "animate-spin" : undefined}
              />
              {refreshAll.isPending ? "Hepsi yenileniyor…" : "Hepsini yenile"}
            </Button>
          </div>
        </div>

        {staleCount > 0 ? (
          <p role="status" className="surface flex items-start gap-2 px-4 py-3 text-sm">
            <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-warning" />
            {staleCount} oyuncunun verisi eski biçimde kaydedilmiş ve tabloda görünmüyor. "Hepsini
            yenile" ile GitHub'dan yeniden çekebilirsin.
          </p>
        ) : null}

        {players.length === 0 ? (
          <div className="surface flex flex-col items-center gap-2 px-6 py-14 text-center">
            <Users aria-hidden className="size-6 text-muted-foreground" />
            <p className="font-medium">Henüz oyuncu yok</p>
            <p className="text-sm text-muted-foreground">İlk kartı yukarıdaki formdan çıkar.</p>
          </div>
        ) : (
          <LeaderboardTable players={players} />
        )}
      </section>
    </main>
  )
}
