import { describe, expect, it } from "vitest"

import { formatRelative } from "@/features/scout/helpers/relative-time"

const NOW = "2026-11-25T12:00:00.000Z"
const ago = (ms: number) => new Date(new Date(NOW).getTime() - ms).toISOString()

describe("göreli zaman", () => {
  it("bir dakikadan yeni olanlar için null döner", () => {
    expect(formatRelative(ago(30_000), NOW, "tr")).toBeNull()
  })

  it("dakika, saat ve gün kademelerini kullanır", () => {
    expect(formatRelative(ago(5 * 60_000), NOW, "en")).toBe("5 min. ago")
    expect(formatRelative(ago(3 * 3_600_000), NOW, "en")).toBe("3 hr. ago")
    expect(formatRelative(ago(2 * 86_400_000), NOW, "en")).toBe("2 days ago")
  })

  it("dile göre yazar", () => {
    expect(formatRelative(ago(5 * 60_000), NOW, "tr")).toBe("5 dk. önce")
  })

  it("gelecekteki bir zamanı 'az önce' sayar", () => {
    expect(formatRelative(ago(-60_000), NOW, "tr")).toBeNull()
  })
})
