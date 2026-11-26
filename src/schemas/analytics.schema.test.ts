import { describe, expect, it } from "vitest"

import { pagePathSchema } from "@/schemas/analytics.schema"

describe("pagePathSchema", () => {
  it.each([
    "/",
    "/tr",
    "/tr/",
    "/leaderboard",
    "/tr/about",
    "/vs",
    "/u/OmerGulcicek",
    "/tr/vs/a-b/c1"
  ])("accepts %s", (path) => expect(pagePathSchema.safeParse(path).success).toBe(true))

  it.each([
    "",
    "leaderboard",
    "/wp-admin",
    "/u/",
    "/u/-bad",
    "/u/a/b",
    "/vs/a",
    "/de/about",
    "/og/x.png"
  ])("rejects %s", (path) => expect(pagePathSchema.safeParse(path).success).toBe(false))
})
