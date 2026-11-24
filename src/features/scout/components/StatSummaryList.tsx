import { STAT_ORDER } from "@/features/scout/constants/scoring.constants"
import type { ScoredPlayer } from "@/features/scout/types/player.types"

type StatSummaryListProps = {
  stats: ScoredPlayer["stats"]
}

/** Her stat için tek satır: puan, ad ve kısa gerekçe. */
export function StatSummaryList({ stats }: StatSummaryListProps) {
  return (
    <ul className="surface divide-y overflow-hidden" aria-label="Stat özetleri">
      {STAT_ORDER.map((key) => {
        const stat = stats[key]
        return (
          <li key={key} className="flex items-center gap-4 px-4 py-3">
            <span className="w-9 shrink-0 text-2xl font-semibold tabular-nums">{stat.value}</span>
            <div className="flex min-w-0 flex-col">
              <p className="flex items-baseline gap-2 text-sm font-medium">
                {stat.label}
                <span lang="en" className="text-xs font-normal tracking-wide text-muted-foreground">
                  {stat.short}
                </span>
              </p>
              <p className="text-sm text-pretty text-muted-foreground">{stat.summary}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
