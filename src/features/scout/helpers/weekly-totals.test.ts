import { describe, expect, it } from "vitest"

import { weeklyTotals } from "@/features/scout/helpers/weekly-totals"

const days = (from: string, counts: number[]) =>
  counts.map((count, index) => {
    const date = new Date(`${from}T00:00:00Z`)
    date.setUTCDate(date.getUTCDate() + index)
    return { date: date.toISOString().slice(0, 10), count }
  })

describe("weeklyTotals", () => {
  it("haftaları Pazar'dan toplar, son haftayı bugüne kadar sayar", () => {
    // 2026-11-01 Pazar; 18. gün 2026-11-18 Çarşamba, son hafta 4 gün.
    const calendar = days(
      "2026-11-01",
      Array.from({ length: 18 }, () => 1)
    )
    expect(weeklyTotals(calendar, 2)).toEqual([7, 4])
  })

  it("istenenden kısa takvimde olanı döner", () => {
    expect(weeklyTotals(days("2026-11-01", [1, 2, 3]), 52)).toEqual([6])
  })

  it("boş takvimde boş döner", () => {
    expect(weeklyTotals([])).toEqual([])
  })
})
