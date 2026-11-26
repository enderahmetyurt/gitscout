import { describe, expect, it } from "vitest"

import { isProgrammersDay, nextProgrammersDay } from "@/features/scout/helpers/programmers-day"

describe("isProgrammersDay", () => {
  it("normal yılda 13 Eylül'dür", () => {
    expect(isProgrammersDay(new Date("2026-09-13T00:00:00Z"))).toBe(true)
    expect(isProgrammersDay(new Date("2026-09-13T23:59:59Z"))).toBe(true)
    expect(isProgrammersDay(new Date("2026-09-12T12:00:00Z"))).toBe(false)
  })

  it("artık yılda 12 Eylül'dür", () => {
    expect(isProgrammersDay(new Date("2028-09-12T12:00:00Z"))).toBe(true)
    expect(isProgrammersDay(new Date("2028-09-13T12:00:00Z"))).toBe(false)
  })
})

describe("nextProgrammersDay", () => {
  it("bu yılın günü geçtiyse gelecek yılınkini verir", () => {
    expect(nextProgrammersDay(new Date("2026-11-26T10:00:00Z")).toISOString()).toBe(
      "2027-09-13T00:00:00.000Z"
    )
    expect(nextProgrammersDay(new Date("2027-11-26T10:00:00Z")).toISOString()).toBe(
      "2028-09-12T00:00:00.000Z"
    )
  })

  it("günün kendisinde ve öncesinde bu yılınkini verir", () => {
    expect(nextProgrammersDay(new Date("2026-09-13T20:00:00Z")).toISOString()).toBe(
      "2026-09-13T00:00:00.000Z"
    )
    expect(nextProgrammersDay(new Date("2026-03-01T00:00:00Z")).toISOString()).toBe(
      "2026-09-13T00:00:00.000Z"
    )
  })
})
