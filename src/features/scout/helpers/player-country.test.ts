import { describe, expect, it } from "vitest"

import {
  countPlayerCountries,
  playerCountry,
  playerCountryFilter
} from "@/features/scout/helpers/player-country"

describe("oyuncu ülkesi", () => {
  it("kullanıcı adını büyük-küçük harf ayırmadan eşler", () => {
    expect(playerCountry("OmerGulcicek")).toBe("TR")
    expect(playerCountry("torvalds")).toBeUndefined()
  })

  it("ülkesi bilinmeyeni belirsiz sayar", () => {
    expect(playerCountryFilter("torvalds")).toBe("unknown")
    expect(playerCountryFilter("fatih")).toBe("TR")
  })

  it("ülkeleri sayar, belirsizleri ayrı tutar", () => {
    const players = [{ login: "fatih" }, { login: "rakyll" }, { login: "torvalds" }]
    expect(countPlayerCountries(players)).toEqual({
      countries: [{ country: "TR", count: 2 }],
      unknown: 1
    })
  })
})
