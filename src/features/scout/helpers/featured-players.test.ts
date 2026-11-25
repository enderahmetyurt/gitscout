import { describe, expect, it } from "vitest"

import { featuredOrder } from "@/features/scout/helpers/featured-players"
import type { ScoredPlayer } from "@/features/scout/types/player.types"

// Seçim yalnızca kullanıcı adına ve kart türüne bakar.
const player = (login: string, rarity: ScoredPlayer["rarity"]) =>
  ({ login, rarity }) as ScoredPlayer

const players = [
  player("ikon", "icon"),
  player("altin-1", "gold"),
  player("altin-2", "gold"),
  player("gumus", "silver"),
  player("bronz", "bronze")
]
const logins = (list: ScoredPlayer[]) => list.map((entry) => entry.login)

describe("vitrin sırası", () => {
  it("yalnızca Gold ve üstü kartları sıraya alır", () => {
    expect(logins(featuredOrder(players, new Set(), 1)).sort()).toEqual([
      "altin-1",
      "altin-2",
      "ikon"
    ])
  })

  it("aynı tohumla her seferinde aynı sırayı verir", () => {
    expect(featuredOrder(players, new Set(), 42)).toEqual(featuredOrder(players, new Set(), 42))
  })

  it("saat değiştikçe vitrindeki kart da değişir", () => {
    const firsts = new Set(
      Array.from({ length: 24 }, (_, hour) => featuredOrder(players, new Set(), hour)[0]?.login)
    )
    expect(firsts.size).toBeGreaterThan(1)
  })

  it("son eklenenleri daha sık öne çıkarır", () => {
    const recent = new Set(["altin-2"])
    let withBoost = 0
    let withoutBoost = 0
    for (let seed = 0; seed < 600; seed += 1) {
      if (featuredOrder(players, recent, seed)[0]?.login === "altin-2") withBoost += 1
      if (featuredOrder(players, new Set(), seed)[0]?.login === "altin-2") withoutBoost += 1
    }
    expect(withBoost).toBeGreaterThan(withoutBoost * 1.5)
  })

  it("Gold ve üstü kimse yoksa herkesi aday sayar", () => {
    const lowOnly = [player("gumus", "silver"), player("bronz", "bronze")]
    expect(featuredOrder(lowOnly, new Set(), 3)).toHaveLength(2)
  })
})
