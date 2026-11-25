import type { Benchmark, BenchmarkKey, ListPlayer } from "@/features/scout/types/player.types"

const METRICS: { key: BenchmarkKey; read: (player: ListPlayer) => number }[] = [
  { key: "commits", read: (player) => player.year.commits },
  { key: "activeDays", read: (player) => player.year.activeDays },
  { key: "longestStreak", read: (player) => player.year.longestStreak },
  { key: "stars", read: (player) => player.career.stars },
  { key: "followers", read: (player) => player.career.followers }
]

/**
 * Oyuncuyu kayıtlı bütün geliştiricilerle kıyaslar. Ortalama yerine yüzdelik kullanılır:
 * dağılımlar çok çarpık, tek bir uç hesap ortalamayı herkesin üstüne çeker.
 * Eşit değerdekilerin yarısı "geride" sayılır, böylece herkes aynıysa sonuç %50 olur.
 */
export function computeBenchmarks(player: ListPlayer, all: ListPlayer[]): Benchmark[] {
  const others = all.filter((other) => other.login !== player.login)
  return METRICS.map(({ key, read }) => {
    const value = read(player)
    const otherValues = others.map(read)
    const below = otherValues.filter((other) => other < value).length
    const equal = otherValues.filter((other) => other === value).length
    return {
      key,
      value,
      aheadShare: others.length === 0 ? null : (below + equal / 2) / others.length
    }
  })
}
