import { describe, expect, it } from "vitest"

import {
  parsePositions,
  parseRarities,
  serializePositions,
  serializeRarities
} from "@/features/scout/helpers/filter-params"

describe("filtre parametreleri", () => {
  it("virgülle ayrılmış metni okur, bilinmeyenleri atlar", () => {
    expect(parsePositions("frontend,FullStack, xyz")).toEqual(["Frontend", "Full Stack"])
    expect(parseRarities("gold,silver,platin")).toEqual(["gold", "silver"])
    expect(parsePositions(undefined)).toEqual([])
  })

  it("boş listeyi URL'den kaldırır", () => {
    expect(serializePositions(["Game Dev", "Data"])).toBe("gamedev,data")
    expect(serializeRarities([])).toBeUndefined()
  })
})
