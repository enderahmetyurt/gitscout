import type { ScoredPlayer } from "@/features/scout/types/player.types"

type YearSummaryProps = {
  year: ScoredPlayer["year"]
}

const number = new Intl.NumberFormat("tr-TR")

/** Puanların arkasındaki ham sayılar: son bir yılın özeti. */
export function YearSummary({ year }: YearSummaryProps) {
  const items = [
    { label: "Commit", value: number.format(year.commits) },
    { label: "Pull request", value: number.format(year.prs) },
    { label: "Review", value: number.format(year.reviews) },
    { label: "Issue", value: number.format(year.issues) },
    { label: "Aktif gün", value: number.format(year.activeDays) },
    { label: "En uzun seri", value: `${number.format(year.longestStreak)} gün` }
  ]

  return (
    <section className="surface flex flex-col gap-3 p-4" aria-labelledby="year-heading">
      <h2 id="year-heading" className="text-sm font-medium">
        Son 1 yıl
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
