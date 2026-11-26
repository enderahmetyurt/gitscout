import { seededRandom } from "@/features/scout/helpers/seeded-random"
import type { ListPlayer, Position, Rarity } from "@/features/scout/types/player.types"

export type DuelPreset = {
  position: Position
  rarity: Rarity
  left: ListPlayer
  right: ListPlayer
}

const RARITY_ORDER: Rarity[] = ["icon", "gold", "silver", "bronze"]

function shuffle<T>(items: T[], random: () => number): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1))
    const current = result[index]
    const swap = result[other]
    if (current === undefined || swap === undefined) continue
    result[index] = swap
    result[other] = current
  }
  return result
}

/**
 * Kapışma sayfasındaki hazır eşleşmeler: her biri aynı mevkiden ve aynı kart türünden iki
 * geliştirici. Üst kart türleri önce gelir, mevkiler mümkün olduğunca tekrar etmez.
 * Aynı tohum her yerde aynı listeyi verir; böylece sunucu ve tarayıcı aynı eşleşmeleri çizer.
 */
export function duelPresets(players: ListPlayer[], seed: number, count: number): DuelPreset[] {
  const random = seededRandom(seed)
  const groups = new Map<string, ListPlayer[]>()
  for (const player of players) {
    const key = `${player.position}|${player.rarity}`
    groups.set(key, [...(groups.get(key) ?? []), player])
  }

  const candidates = shuffle(
    [...groups.values()].filter((group) => group.length >= 2),
    random
  )
    .flatMap((group): DuelPreset[] => {
      const [left, right] = shuffle(group, random)
      if (!left || !right) return []
      return [{ position: left.position, rarity: left.rarity, left, right }]
    })
    .sort((a, b) => RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity))

  const picked: DuelPreset[] = []
  const usedPositions = new Set<Position>()
  for (const preset of candidates) {
    if (picked.length === count) break
    if (usedPositions.has(preset.position)) continue
    picked.push(preset)
    usedPositions.add(preset.position)
  }
  for (const preset of candidates) {
    if (picked.length === count) break
    if (!picked.includes(preset)) picked.push(preset)
  }
  return picked
}
