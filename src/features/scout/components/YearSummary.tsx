import { number } from "@/features/scout/helpers/player-text"
import type { ScoredPlayer } from "@/features/scout/types/player.types"
import * as m from "@/paraglide/messages.js"

type YearSummaryProps = {
  year: ScoredPlayer["year"]
}

/**
 * Son bir yılın ham sayıları. Commit, aktif gün ve seri kıyas kartında zaten var;
 * burada yalnızca orada olmayanlar kalır.
 */
export function YearSummary({ year }: YearSummaryProps) {
  const items = [
    { label: m.year_prs(), value: number(year.prs) },
    { label: m.year_reviews(), value: number(year.reviews) },
    { label: m.year_issues(), value: number(year.issues) }
  ]

  return (
    <section
      className="flex flex-col gap-3 border-t pt-4 lg:shrink-0 lg:border-s lg:border-t-0 lg:ps-8 lg:pt-0"
      aria-labelledby="year-heading"
    >
      <h2
        id="year-heading"
        className="text-xs font-medium tracking-widest text-muted-foreground uppercase"
      >
        {m.year_title()}
      </h2>
      <dl className="grid grid-cols-3 gap-x-6">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col gap-0.5">
            <dt className="text-xs text-muted-foreground">{item.label}</dt>
            <dd className="text-2xl leading-tight font-semibold tabular-nums">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
