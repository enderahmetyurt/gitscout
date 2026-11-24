import { STAT_ORDER } from "@/features/scout/constants/scoring.constants"
import type { ScoredPlayer, StatKey } from "@/features/scout/types/player.types"

export type DuelSide = "left" | "right"

type DuelRound = {
  key: StatKey
  left: number
  right: number
  winner: DuelSide | null
}

export type Duel = {
  rounds: DuelRound[]
  score: { left: number; right: number }
  /** Altı statın toplamındaki pay; çubuğun ortadan kayması bunu gösterir. */
  dominance: { left: number; right: number }
  winner: DuelSide | null
  /** Kazananın nasıl belirlendiği: stat sayısı, eşitlikte genel puan. */
  decidedBy: "rounds" | "ovr" | "draw"
}

/** İki oyuncuyu stat stat karşılaştırır. Daha çok stat kazanan alır; eşitlikte genel puan bakılır. */
export function computeDuel(left: ScoredPlayer, right: ScoredPlayer): Duel {
  const rounds = STAT_ORDER.map((key): DuelRound => {
    const a = left.stats[key].value
    const b = right.stats[key].value
    return { key, left: a, right: b, winner: a === b ? null : a > b ? "left" : "right" }
  })
  const score = {
    left: rounds.filter((round) => round.winner === "left").length,
    right: rounds.filter((round) => round.winner === "right").length
  }
  const leftTotal = rounds.reduce((sum, round) => sum + round.left, 0)
  const rightTotal = rounds.reduce((sum, round) => sum + round.right, 0)
  const total = leftTotal + rightTotal
  const dominance = {
    left: total === 0 ? 0.5 : leftTotal / total,
    right: total === 0 ? 0.5 : rightTotal / total
  }

  if (score.left !== score.right) {
    return {
      rounds,
      score,
      dominance,
      winner: score.left > score.right ? "left" : "right",
      decidedBy: "rounds"
    }
  }
  if (left.ovr !== right.ovr) {
    return {
      rounds,
      score,
      dominance,
      winner: left.ovr > right.ovr ? "left" : "right",
      decidedBy: "ovr"
    }
  }
  return { rounds, score, dominance, winner: null, decidedBy: "draw" }
}
