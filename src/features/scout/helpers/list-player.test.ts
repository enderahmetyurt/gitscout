import { describe, expect, it } from "vitest"

import { toListPlayer } from "@/features/scout/helpers/list-player"
import type { ScoredPlayer } from "@/features/scout/types/player.types"

const stat = (key: string, value: number) => ({
  key,
  value,
  raw: value - 5,
  summary: { key },
  parts: [{ id: `${key}_a`, points: 10, max: 50 }]
})

// Yalnızca dönüştürmenin dokunduğu alanlar dolu; geri kalanı olduğu gibi taşınmalı.
const full = {
  login: "ada",
  name: "Ada",
  ovr: 80,
  ovrExact: 80.4,
  rarity: "gold",
  positionBreakdown: { repoCount: 3, pythonAsData: false, roles: [], languages: [] },
  topRepos: [{ name: "x" }],
  archetype: { rarity: "gold", strengths: [], weakness: null },
  badges: [{ id: "polyglot", values: { count: 4 } }],
  stats: { act: stat("act", 90), imp: stat("imp", 70) }
} as unknown as ScoredPlayer

describe("liste oyuncusu", () => {
  it("detay sayfasına özgü alanları atar, statlardan yalnızca görünen puanı bırakır", () => {
    const light = toListPlayer(full)
    expect(light).not.toHaveProperty("positionBreakdown")
    expect(light).not.toHaveProperty("topRepos")
    expect(light).not.toHaveProperty("archetype")
    expect(light.stats).toEqual({ act: { key: "act", value: 90 }, imp: { key: "imp", value: 70 } })
  })

  it("kartta ve listede gereken alanları korur", () => {
    const light = toListPlayer(full)
    expect(light).toMatchObject({ login: "ada", ovr: 80, ovrExact: 80.4, rarity: "gold" })
    expect(light.badges).toEqual(full.badges)
  })
})
