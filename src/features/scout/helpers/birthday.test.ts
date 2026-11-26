import { describe, expect, it } from "vitest"

import { ageOn, isBirthdayToday } from "@/features/scout/helpers/birthday"

describe("isBirthdayToday", () => {
  it("kişinin yerel saatine göre günü hesaplar", () => {
    // UTC'de 25 Kasım 22:00, İstanbul'da (UTC+3) 26 Kasım 01:00.
    const now = new Date("2026-11-25T22:00:00Z")
    expect(isBirthdayToday("11-26", now, 180)).toBe(true)
    expect(isBirthdayToday("11-26", now, null)).toBe(false)
  })

  it("29 Şubat doğumluyu artık olmayan yılda 28 Şubat'ta kutlar", () => {
    expect(isBirthdayToday("02-29", new Date("2027-02-28T12:00:00Z"), 0)).toBe(true)
    expect(isBirthdayToday("02-29", new Date("2028-02-28T12:00:00Z"), 0)).toBe(false)
    expect(isBirthdayToday("02-29", new Date("2028-02-29T12:00:00Z"), 0)).toBe(true)
  })
})

describe("ageOn", () => {
  it("doğum günü gelmeden bir yaş eksik sayar", () => {
    expect(ageOn("2000-11-26", new Date("2026-11-25T12:00:00Z"))).toBe(25)
    expect(ageOn("2000-11-26", new Date("2026-11-26T12:00:00Z"))).toBe(26)
  })

  it("olmayan tarihi reddeder", () => {
    expect(ageOn("2001-02-29", new Date("2026-01-01T00:00:00Z"))).toBeNull()
    expect(ageOn("2001-2-1", new Date("2026-01-01T00:00:00Z"))).toBeNull()
  })
})
