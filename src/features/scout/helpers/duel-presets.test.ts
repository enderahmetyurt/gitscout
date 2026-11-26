import { describe, expect, it } from "vitest"

import { duelPresetGroups } from "@/features/scout/helpers/duel-presets"
import type { ListPlayer } from "@/features/scout/types/player.types"

// Eşleştirme yalnızca kullanıcı adına, mevkiye ve kart türüne bakar.
const player = (login: string, position: ListPlayer["position"], rarity: ListPlayer["rarity"]) =>
  ({ login, position, rarity }) as ListPlayer

const many = (
  prefix: string,
  position: ListPlayer["position"],
  rarity: ListPlayer["rarity"],
  count: number
) => Array.from({ length: count }, (_, index) => player(`${prefix}-${index}`, position, rarity))

const players = [
  ...many("fe-icon", "Frontend", "icon", 3),
  ...many("fe-gold", "Frontend", "gold", 4),
  ...many("fe-silver", "Frontend", "silver", 4),
  ...many("be-gold", "Backend", "gold", 3),
  ...many("mobile-icon", "Mobile", "icon", 2),
  ...many("mobile-gold", "Mobile", "gold", 2),
  ...many("data-silver", "Data", "silver", 5),
  player("devops-icon", "DevOps", "icon")
]

describe("hazır kapışmalar", () => {
  it("yalnızca aynı mevki ve kart türündeki iki kişiyi eşleştirir", () => {
    for (const group of duelPresetGroups(players, 7)) {
      for (const preset of group.presets) {
        expect(preset.left.login).not.toBe(preset.right.login)
        expect(preset.left.position).toBe(group.position)
        expect(preset.right.position).toBe(group.position)
        expect(preset.left.rarity).toBe(preset.right.rarity)
      }
    }
  })

  it("ana alanlardan ikişer, diğerlerinden birer kapışmayla 9 kartı doldurur", () => {
    const full = [
      ...many("fe-icon", "Frontend", "icon", 2),
      ...many("fe-gold", "Frontend", "gold", 4),
      ...many("be-gold", "Backend", "gold", 4),
      ...many("fs-silver", "Full Stack", "silver", 3),
      ...many("fs-bronze", "Full Stack", "bronze", 2),
      ...many("mobile-gold", "Mobile", "gold", 2),
      ...many("data-silver", "Data", "silver", 2),
      ...many("devops-bronze", "DevOps", "bronze", 2),
      ...many("systems-icon", "Systems", "icon", 2)
    ]
    const groups = duelPresetGroups(full, 7).map((group) => [
      group.position,
      group.isMain,
      group.presets.map((preset) => preset.rarity)
    ])
    expect(groups).toEqual([
      ["Frontend", true, ["icon", "gold"]],
      ["Backend", true, ["gold", "gold"]],
      ["Full Stack", true, ["silver", "bronze"]],
      ["Mobile", false, ["gold"]],
      ["Data", false, ["silver"]],
      // Üçüncü alan, en üst kart türü çifti olan: Systems (İkon), DevOps'tan (Bronz) önce gelir.
      ["Systems", false, ["icon"]]
    ])
  })

  it("bir kişiyi tek kartta kullanır", () => {
    const logins = duelPresetGroups(players, 3).flatMap((group) =>
      group.presets.flatMap((preset) => [preset.left.login, preset.right.login])
    )
    expect(new Set(logins).size).toBe(logins.length)
  })

  it("aynı tohumla her seferinde aynı eşleşmeleri verir", () => {
    expect(duelPresetGroups(players, 42)).toEqual(duelPresetGroups(players, 42))
  })

  it("profili çok görüntüleneni daha sık seçer ama rakibi aynı gruptan gelir", () => {
    const group = many("fe", "Frontend", "gold", 20)
    let popularShown = 0
    for (let seed = 0; seed < 200; seed++) {
      const preset = duelPresetGroups(group, seed, { "fe-7": 500 })[0]?.presets[0]
      if (preset?.left.login === "fe-7" || preset?.right.login === "fe-7") popularShown++
      expect(preset?.left.login).not.toBe(preset?.right.login)
    }
    // Ağırlıksız beklenti ~%10 (20 kişiden 2 yer); 500 görüntülenmeyle neredeyse her seferinde çıkar.
    expect(popularShown).toBeGreaterThan(180)
  })

  it("görüntülenmesi olmayan da seçilebilir", () => {
    const group = many("be", "Backend", "gold", 5)
    const seen = new Set<string>()
    for (let seed = 0; seed < 100; seed++) {
      const preset = duelPresetGroups(group, seed, { "be-0": 3 })[0]?.presets[0]
      if (preset) seen.add(preset.left.login)
    }
    expect(seen.size).toBeGreaterThan(1)
  })
})
