import { describe, expect, it } from "vitest"

import { playerBadgeSvg, svgDataUri, unrankedBadgeSvg } from "@/features/scout/helpers/player-badge"

describe("oyuncu rozeti", () => {
  it("puanı ve nadirlik adını nadirliğin renginde yazar", () => {
    const svg = playerBadgeSvg({ ovr: 82, rarity: "gold" })
    expect(svg).toContain("82 rating · gold")
    expect(svg).toContain('fill="#e6b843"')
  })

  it("kartı olmayanlar için gri rozet üretir", () => {
    const svg = unrankedBadgeSvg()
    expect(svg).toContain("no rating")
    expect(svg).toContain('fill="#6e7681"')
  })

  it("SVG'yi <img> için veri adresine çevirir", () => {
    const uri = svgDataUri(playerBadgeSvg({ ovr: 94, rarity: "icon" }))
    expect(uri.startsWith("data:image/svg+xml;charset=utf-8,")).toBe(true)
    expect(decodeURIComponent(uri)).toContain("94 rating · icon")
  })
})
