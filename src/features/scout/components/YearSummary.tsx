import { number } from "@/features/scout/helpers/player-text"
import type { ScoredPlayer } from "@/features/scout/types/player.types"
import * as m from "@/paraglide/messages.js"

type YearSummaryProps = {
  year: ScoredPlayer["year"]
}

/** Puanların arkasındaki ham sayılar: son bir yılın özeti. */
export function YearSummary({ year }: YearSummaryProps) {
  const items = [
    { label: m.year_commits(), value: number(year.commits) },
    { label: m.year_prs(), value: number(year.prs) },
    { label: m.year_reviews(), value: number(year.reviews) },
    { label: m.year_issues(), value: number(year.issues) },
    { label: m.year_active_days(), value: number(year.activeDays) },
    { label: m.year_streak(), value: m.days({ count: number(year.longestStreak) }) }
  ]

  return (
    <section className="surface flex flex-col gap-3 p-4" aria-labelledby="year-heading">
      <h2 id="year-heading" className="text-sm font-medium">
        {m.year_title()}
      </h2>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col gap-0.5">
            <dt className="text-xs text-muted-foreground">{item.label}</dt>
            <dd className="text-lg leading-tight font-semibold tabular-nums">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
