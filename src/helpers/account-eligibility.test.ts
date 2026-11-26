import { describe, expect, it } from "vitest"

import { isEligibleAccount } from "@/helpers/account-eligibility"

const now = new Date("2026-11-26T12:00:00Z")

describe("isEligibleAccount", () => {
  it("accepts an account that is six months old with five followers", () => {
    expect(
      isEligibleAccount({ createdAt: new Date("2026-05-26T12:00:00Z"), followers: 5 }, now)
    ).toBe(true)
  })

  it("rejects an account younger than six months", () => {
    expect(
      isEligibleAccount({ createdAt: new Date("2026-05-27T12:00:00Z"), followers: 500 }, now)
    ).toBe(false)
  })

  it("rejects an account with fewer than five followers", () => {
    expect(
      isEligibleAccount({ createdAt: new Date("2015-01-01T00:00:00Z"), followers: 4 }, now)
    ).toBe(false)
  })
})
