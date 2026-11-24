import { STAT_ORDER } from "@/features/scout/constants/scoring.constants"
import type { Archetype, Rarity, Stat, StatKey } from "@/features/scout/types/player.types"

/** Bu değerin altındaki stat zayıf yan olarak anılır; üstündekiler güçlü yan olabilir. */
const ARCHETYPE_WEAK_BELOW = 70

/**
 * Oyuncuyu tek cümleyle anlatmak için parçalar: en güçlü iki stat ve gerçekten düşükse en zayıf stat.
 * Cümle arayüzde dile göre kurulur.
 */
export function computeArchetype(stats: Record<StatKey, Stat>, rarity: Rarity): Archetype {
  const ranked = [...STAT_ORDER].sort((a, b) => stats[b].raw - stats[a].raw)
  const weakest = ranked.at(-1)
  return {
    rarity,
    strengths: ranked.slice(0, 2).filter((key) => stats[key].value >= ARCHETYPE_WEAK_BELOW),
    weakness: weakest && stats[weakest].value < ARCHETYPE_WEAK_BELOW ? weakest : null
  }
}
