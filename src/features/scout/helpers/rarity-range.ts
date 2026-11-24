import { RARITY_THRESHOLDS } from "@/features/scout/constants/scoring.constants"
import type { Rarity } from "@/features/scout/types/player.types"

/** Eşiklerden okunabilir aralık: "90+", "75–89", "0–64". */
export function rarityRange(rarity: Rarity): string {
  const index = RARITY_THRESHOLDS.findIndex((threshold) => threshold.rarity === rarity)
  const min = RARITY_THRESHOLDS[index]?.min ?? 0
  const above = RARITY_THRESHOLDS[index - 1]
  return above ? `${min}–${above.min - 1}` : `${min}+`
}
