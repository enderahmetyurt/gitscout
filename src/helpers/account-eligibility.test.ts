import { describe, expect, it } from "vitest"

import { isEligibleAccount } from "@/helpers/account-eligibility"

const now = new Date("2026-11-26T12:00:00Z")

describe("isEligibleAccount", () => {
  it("accepts an account that is six months old", () => {
    expect(isEligibleAccount({ createdAt: new Date("2026-05-26T12:00:00Z") }, now)).toBe(true)
  })

  it("rejects an account younger than six months", () => {
    expect(isEligibleAccount({ createdAt: new Date("2026-05-27T12:00:00Z") }, now)).toBe(false)
  })
})
