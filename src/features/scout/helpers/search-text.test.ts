import { describe, expect, it } from "vitest"

import { matchesPlayer } from "@/features/scout/helpers/search-text"

describe("matchesPlayer", () => {
  const player = { name: "Yunus Emre GÜRLÜ", login: "yunusemrgrl" }

  it("aksan ve büyük harf fark etmeden ad ya da kullanıcı adında arar", () => {
    expect(matchesPlayer(player, "gurlu")).toBe(true)
    expect(matchesPlayer(player, "@yunusemr")).toBe(true)
    expect(matchesPlayer(player, "bilal")).toBe(false)
  })

  it("boş aramada herkesi gösterir", () => {
    expect(matchesPlayer(player, "  ")).toBe(true)
  })
})
