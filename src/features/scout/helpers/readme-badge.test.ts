import { readFileSync } from "node:fs"

import { describe, expect, it } from "vitest"

import { readmeBadgeMarkdown } from "@/features/scout/helpers/readme-badge"

describe("readmeBadgeMarkdown", () => {
  it("rozet görselini oyuncu sayfasına bağlar", () => {
    expect(readmeBadgeMarkdown("https://gitscout.io", "octocat")).toBe(
      "[![Gitscout](https://gitscout.io/badge/octocat.svg)](https://gitscout.io/u/octocat)"
    )
  })

  it("llms.txt içindeki örnekle aynı biçimde", () => {
    const llms = readFileSync("public/llms.txt", "utf8")
    expect(llms).toContain(readmeBadgeMarkdown("https://gitscout.io", "<username>"))
  })
})
