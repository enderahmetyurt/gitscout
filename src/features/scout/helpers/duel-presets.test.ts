import { describe, expect, it } from "vitest"

import { duelPresets } from "@/features/scout/helpers/duel-presets"
import type { ListPlayer } from "@/features/scout/types/player.types"

// Eşleştirme yalnızca kullanıcı adına, mevkiye ve kart türüne bakar.
const player = (login: string, position: ListPlayer["position"], rarity: ListPlayer["rarity"]) =>
  ({ login, position, rarity }) as ListPlayer

const players = [
  player("fe-gold-1", "Frontend", "gold"),
  player("fe-gold-2", "Frontend", "gold"),
  player("fe-gold-3", "Frontend", "gold"),
  player("be-silver-1", "Backend", "silver"),
  player("be-silver-2", "Backend", "silver"),
  player("be-gold-1", "Backend", "gold"),
  player("mobile-icon", "Mobile", "icon")
]

describe("hazır kapışmalar", () => {
  it("yalnızca aynı mevki ve kart türündeki iki kişiyi eşleştirir", () => {
    for (const preset of duelPresets(players, 7, 6)) {
      expect(preset.left.login).not.toBe(preset.right.login)
      expect(preset.left.position).toBe(preset.right.position)
      expect(preset.left.rarity).toBe(preset.right.rarity)
    }
  })

  it("eşi olmayan grupları atlar ve üst kart türünü önce verir", () => {
    const presets = duelPresets(players, 7, 6)
    expect(presets.map((preset) => `${preset.position}|${preset.rarity}`)).toEqual([
      "Frontend|gold",
      "Backend|silver"
    ])
  })

  it("aynı tohumla her seferinde aynı eşleşmeleri verir", () => {
    expect(duelPresets(players, 42, 6)).toEqual(duelPresets(players, 42, 6))
  })
})
