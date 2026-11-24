import { describe, expect, it } from "vitest"

import { statTier } from "@/features/scout/helpers/stat-tier"

describe("statTier", () => {
  it("eşik değerlerini üst kademeye koyar", () => {
    expect(statTier(99)).toBe("elite")
    expect(statTier(90)).toBe("elite")
    expect(statTier(89)).toBe("great")
    expect(statTier(80)).toBe("great")
    expect(statTier(70)).toBe("good")
    expect(statTier(60)).toBe("fair")
    expect(statTier(59)).toBe("poor")
    expect(statTier(30)).toBe("poor")
  })
})
