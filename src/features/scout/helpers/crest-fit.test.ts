import { describe, expect, it } from "vitest"

import { crestFit } from "@/features/scout/helpers/crest-fit"

describe("crestFit", () => {
  it("kare armayı kutunun %78'i yapar", () => {
    const { width, height } = crestFit(1)
    expect(width).toBeCloseTo(0.78)
    expect(height).toBeCloseTo(0.78)
  })

  it("uzun ve kare arma aynı alanı kaplar", () => {
    const square = crestFit(1)
    const tall = crestFit(0.7)
    expect(tall.width * tall.height).toBeCloseTo(square.width * square.height)
    expect(tall.height).toBeGreaterThan(square.height)
  })

  it("çok uzun arma kutudan taşmaz", () => {
    expect(crestFit(0.4)).toEqual({ width: 0.4, height: 1 })
  })
})
