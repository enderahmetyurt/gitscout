import { STAT_ORDER } from "@/features/scout/constants/scoring.constants"
import type { ListPlayer, StatKey } from "@/features/scout/types/player.types"

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
  winner: DuelSide | null
  /** Kazananın nasıl belirlendiği: stat sayısı, eşitlikte ondalıklı genel puanla uzatma. */
  decidedBy: "rounds" | "ovr" | "draw"
}

/**
 * İki oyuncuyu stat stat karşılaştırır. Daha çok stat kazanan alır; eşitlikte uzatmaya gidilir ve
 * ondalıklı genel puan karar verir. Liderlik tablosu da bu puanla sıralar; tabloda üstte olan uzatmada kazanır.
 */
export function computeDuel(left: ListPlayer, right: ListPlayer): Duel {
  const rounds = STAT_ORDER.map((key): DuelRound => {
    const a = left.stats[key].value
    const b = right.stats[key].value
    return { key, left: a, right: b, winner: a === b ? null : a > b ? "left" : "right" }
  })
  const score = {
    left: rounds.filter((round) => round.winner === "left").length,
    right: rounds.filter((round) => round.winner === "right").length
  }

  if (score.left !== score.right) {
    return {
      rounds,
      score,
      winner: score.left > score.right ? "left" : "right",
      decidedBy: "rounds"
    }
  }
  if (left.ovrExact !== right.ovrExact) {
    return {
      rounds,
      score,
      winner: left.ovrExact > right.ovrExact ? "left" : "right",
      decidedBy: "ovr"
    }
  }
  return { rounds, score, winner: null, decidedBy: "draw" }
}
