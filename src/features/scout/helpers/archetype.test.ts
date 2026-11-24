import { describe, expect, it } from "vitest"

import { computeArchetype } from "@/features/scout/helpers/archetype"
import type { Stat, StatKey } from "@/features/scout/types/player.types"

const stat = (key: StatKey, value: number): Stat => ({
  key,
  short: key.toUpperCase(),
  label: key,
  value,
  raw: value,
  summary: "",
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
  it("en güçlü iki statı ve gerçekten düşük olanı anlatır", () => {
    const text = computeArchetype(
      stats({ act: 90, imp: 78, com: 77, rep: 62, con: 87, exp: 85 }),
      "gold"
    )
    expect(text).toBe(
      "Seçkin profil: yıl boyu yüksek tempoda üretiyor ve neredeyse her hafta sahada; başka projelere katkısı henüz az."
    )
  })

  it("en düşük stat da yüksekse zayıf yan söylemez", () => {
    const text = computeArchetype(
      stats({ act: 93, imp: 94, com: 92, rep: 88, con: 95, exp: 95 }),
      "icon"
    )
    expect(text).not.toContain(";")
    expect(text.startsWith("Efsane profil:")).toBe(true)
  })
})
