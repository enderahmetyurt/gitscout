import { describe, expect, it } from "vitest"

import { computeBenchmarks } from "@/features/scout/helpers/benchmarks"
import type { ScoredPlayer } from "@/features/scout/types/player.types"

const player = (login: string, commits: number): ScoredPlayer =>
  ({
    login,
    year: { commits, prs: 0, reviews: 0, issues: 0, activeDays: 0, longestStreak: 0 },
    career: { followers: 0, stars: 0, contributions: 0 }
  }) as ScoredPlayer

const commitsOf = (target: ScoredPlayer, all: ScoredPlayer[]) =>
  computeBenchmarks(target, all).find((item) => item.key === "commits")

describe("computeBenchmarks", () => {
  it("diğerlerinin ne kadarının önünde olduğunu verir", () => {
    const all = [player("a", 10), player("b", 100), player("c", 1000), player("d", 50)]
    const result = commitsOf(all[1] ?? player("x", 0), all)
    expect(result?.aheadShare).toBeCloseTo(2 / 3)
  })

  it("eşit değerdekilerin yarısını geride sayar", () => {
    const all = [player("a", 5), player("b", 5), player("c", 5)]
    expect(commitsOf(all[0] ?? player("x", 0), all)?.aheadShare).toBe(0.5)
  })

  it("kıyaslanacak kimse yoksa pay boş kalır", () => {
    const only = player("a", 5)
    expect(commitsOf(only, [only])?.aheadShare).toBeNull()
  })
})
