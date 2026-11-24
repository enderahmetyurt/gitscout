import { describe, expect, it } from "vitest"

import { computeArchetype } from "@/features/scout/helpers/archetype"
import type { Stat, StatKey } from "@/features/scout/types/player.types"

const stat = (key: StatKey, value: number): Stat => ({
  key,
  value,
  raw: value,
  summary: { key: "com", followers: 0 },
  parts: []
})

const stats = (values: Record<StatKey, number>) => ({
  act: stat("act", values.act),
  imp: stat("imp", values.imp),
  com: stat("com", values.com),
  rep: stat("rep", values.rep),
  con: stat("con", values.con),
  exp: stat("exp", values.exp)
})

describe("computeArchetype", () => {
  it("en güçlü iki statı ve gerçekten düşük olanı seçer", () => {
    const archetype = computeArchetype(
      stats({ act: 90, imp: 78, com: 77, rep: 62, con: 87, exp: 85 }),
      "gold"
    )
    expect(archetype).toEqual({ rarity: "gold", strengths: ["act", "con"], weakness: "rep" })
  })

  it("en düşük stat da yüksekse zayıf yan söylemez", () => {
    const archetype = computeArchetype(
      stats({ act: 93, imp: 94, com: 92, rep: 88, con: 95, exp: 95 }),
      "icon"
    )
    expect(archetype.weakness).toBeNull()
    expect(archetype.strengths).toHaveLength(2)
  })
})
