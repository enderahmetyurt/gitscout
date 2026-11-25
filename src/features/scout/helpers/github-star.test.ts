import { describe, expect, it } from "vitest"

import { isGithubStar } from "@/features/scout/helpers/github-star"

describe("GitHub Star", () => {
  it("listedeki kullanıcıyı büyük-küçük harf ayırmadan tanır", () => {
    expect(isGithubStar("f")).toBe(true)
    expect(isGithubStar("F")).toBe(true)
  })

  it("listede olmayan kullanıcı Star sayılmaz", () => {
    expect(isGithubStar("nobody-xyz")).toBe(false)
  })
})
