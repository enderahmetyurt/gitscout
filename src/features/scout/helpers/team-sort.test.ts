import { describe, expect, it } from "vitest"

import { sortedTeamCountries, sortedTeams } from "@/features/scout/helpers/team-sort"

describe("takım sıralaması", () => {
  it("ülkeleri adlarına göre alfabetik sıralar", () => {
    expect(sortedTeamCountries()).toEqual([
      "england",
      "france",
      "germany",
      "italy",
      "spain",
      "turkey"
    ])
  })

  it("takımları kulüp adına göre alfabetik sıralar", () => {
    expect(sortedTeams("turkey")).toEqual([
      "besiktas",
      "bursaspor",
      "fenerbahce",
      "galatasaray",
      "goztepe",
      "trabzonspor"
    ])
    expect(sortedTeams("france")).toEqual(["lyon", "marseille", "paris-saint-germain"])
  })
})
