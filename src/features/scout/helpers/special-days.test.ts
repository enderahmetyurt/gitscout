import { describe, expect, it } from "vitest"

import {
  isHalloween,
  isNewYear,
  isRepublicDay,
  isWomensDay
} from "@/features/scout/helpers/special-days"

describe("isRepublicDay", () => {
  it("Türkiye saatiyle 29 Ekim'dir", () => {
    expect(isRepublicDay(new Date("2026-10-29T12:00:00Z"))).toBe(true)
    // UTC'de hâlâ 28 Ekim ama Türkiye'de gece yarısı geçti.
    expect(isRepublicDay(new Date("2026-10-28T21:30:00Z"))).toBe(true)
    // UTC'de hâlâ 29 Ekim ama Türkiye'de 30 Ekim oldu.
    expect(isRepublicDay(new Date("2026-10-29T21:30:00Z"))).toBe(false)
  })
})

describe("isHalloween", () => {
  it("31 Ekim'dir", () => {
    expect(isHalloween(new Date("2026-10-31T08:00:00Z"))).toBe(true)
    expect(isHalloween(new Date("2026-11-01T08:00:00Z"))).toBe(false)
  })
})

describe("isNewYear", () => {
  it("31 Aralık ve 1 Ocak'tır", () => {
    expect(isNewYear(new Date("2026-12-31T10:00:00Z"))).toBe(true)
    expect(isNewYear(new Date("2027-01-01T10:00:00Z"))).toBe(true)
    expect(isNewYear(new Date("2027-01-02T10:00:00Z"))).toBe(false)
  })
})

describe("isWomensDay", () => {
  it("yalnızca 8 Mart'tır", () => {
    expect(isWomensDay(new Date("2027-03-08T10:00:00Z"))).toBe(true)
    expect(isWomensDay(new Date("2027-03-07T23:00:00Z"))).toBe(false)
    expect(isWomensDay(new Date("2027-03-09T00:30:00Z"))).toBe(false)
  })
})
