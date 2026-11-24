import { number } from "@/features/scout/helpers/player-text"
import type { Benchmark, BenchmarkKey } from "@/features/scout/types/player.types"
import * as m from "@/paraglide/messages.js"

const LABELS: Record<BenchmarkKey, () => string> = {
  commits: m.compare_commits,
  activeDays: m.compare_active_days,
  longestStreak: m.compare_streak,
  stars: m.compare_stars,
  followers: m.compare_followers
}

type BenchmarksProps = {
  benchmarks: Benchmark[]
  /** Kayıtlı geliştirici sayısı (oyuncu dahil). */
  total: number
}

/** Oyuncunun her ölçüde diğer geliştiricilerin yüzde kaçının önünde olduğu; çubuk bu payı gösterir. */
export function Benchmarks({ benchmarks, total }: BenchmarksProps) {
  return (
    <section className="surface flex flex-col gap-4 p-4" aria-labelledby="compare-heading">
      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-2">
        <h2 id="compare-heading" className="text-sm font-medium">
          {m.compare_title()}
        </h2>
        <p className="text-xs text-muted-foreground">{m.compare_caption({ count: total })}</p>
      </div>
      <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {benchmarks.map((item) => (
          <BenchmarkRow key={item.key} item={item} />
        ))}
      </ul>
    </section>
  )
}

function aheadText(pct: number | null): string {
  if (pct === null) return m.compare_alone()
  if (pct >= 100) return m.compare_ahead_all()
  if (pct <= 0) return m.compare_behind_all()
  return m.compare_ahead({ pct })
}

function BenchmarkRow({ item }: { item: Benchmark }) {
  const pct = item.aheadShare === null ? null : Math.round(item.aheadShare * 100)
  return (
    <li className="flex flex-col gap-1.5 text-sm">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-muted-foreground">{LABELS[item.key]()}</span>
        <span className="font-semibold tabular-nums">{number(item.value)}</span>
      </div>
      <span aria-hidden className="h-1.5 rounded-full bg-muted">
        {pct === null ? null : (
          <span className="block h-full rounded-full bg-chart-home" style={{ width: `${pct}%` }} />
        )}
      </span>
      <p className="text-xs text-muted-foreground">{aheadText(pct)}</p>
    </li>
  )
}
