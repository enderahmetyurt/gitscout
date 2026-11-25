import { describe, expect, it } from "vitest"

import { renderBadgeSvg } from "@/features/scout/helpers/badge-svg"

describe("README rozeti", () => {
  it("nadirliğin rengini ve metni taşır", () => {
    const svg = renderBadgeSvg({ label: "Gitscout", value: "81 rating · gold", tone: "gold" })
    expect(svg).toContain('fill="#e6b843"')
    expect(svg).toContain("81 rating · gold")
    expect(svg).toContain('aria-label="Gitscout: 81 rating · gold"')
  })

  it("uzun metinde genişlik büyür", () => {
    const width = (svg: string) => Number(/width="(\d+)"/.exec(svg)?.[1])
    const short = renderBadgeSvg({ label: "Gitscout", value: "81", tone: "icon" })
    const long = renderBadgeSvg({ label: "Gitscout", value: "99 rating · bronze", tone: "icon" })
    expect(width(long)).toBeGreaterThan(width(short))
  })

  it("metindeki özel karakterleri kaçırır", () => {
    const svg = renderBadgeSvg({ label: "<a&b>", value: "x", tone: "none" })
    expect(svg).not.toContain("<a&b>")
    expect(svg).toContain("&#60;a&#38;b&#62;")
  })
})
