import {
  ARCHETYPE_LEADS,
  ARCHETYPE_STRENGTHS,
  ARCHETYPE_WEAK_BELOW,
  ARCHETYPE_WEAKNESSES
} from "@/features/scout/constants/archetype.constants"
import { STAT_ORDER } from "@/features/scout/constants/scoring.constants"
import type { Rarity, Stat, StatKey } from "@/features/scout/types/player.types"

/**
 * Oyuncuyu tek cümleyle anlatır: en güçlü iki stat ve gerçekten düşükse en zayıf stat.
 * Örnek: "Seçkin profil: yıl boyu yüksek tempoda üretiyor ve neredeyse her hafta sahada; başka projelere katkısı henüz az."
 */
export function computeArchetype(stats: Record<StatKey, Stat>, rarity: Rarity): string {
  const ranked = [...STAT_ORDER].sort((a, b) => stats[b].raw - stats[a].raw)
  const [first, second] = ranked
  const weakest = ranked.at(-1)
  const strengths = [first, second]
    .filter((key): key is StatKey => key !== undefined && stats[key].value >= ARCHETYPE_WEAK_BELOW)
    .map((key) => ARCHETYPE_STRENGTHS[key])
  const weakness =
    weakest && stats[weakest].value < ARCHETYPE_WEAK_BELOW ? ARCHETYPE_WEAKNESSES[weakest] : null

  const lead = ARCHETYPE_LEADS[rarity]
  const strong = strengths.join(" ve ")
  if (strong && weakness) return `${lead}: ${strong}; ${weakness}.`
  if (strong) return `${lead}: ${strong}.`
  if (weakness) return `${lead}: ${weakness}.`
  return `${lead}.`
}
