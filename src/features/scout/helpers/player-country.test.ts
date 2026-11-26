import { describe, expect, it } from "vitest"

import {
  countPlayerCountries,
  playerCountry,
  playerCountryFilter
} from "@/features/scout/helpers/player-country"

describe("oyuncu ülkesi", () => {
  it("kullanıcı adını büyük-küçük harf ayırmadan eşler", () => {
    expect(playerCountry({ login: "OmerGulcicek" })).toBe("TR")
    expect(playerCountry({ login: "Gaearon" })).toBe("RU")
    expect(playerCountry({ login: "octocat" })).toBeUndefined()
  })

  it("listede yoksa GitHub konumundan çıkarılan ülkeyi kullanır, elle atanan önde gelir", () => {
    expect(playerCountry({ login: "octocat", country: "DE" })).toBe("DE")
    expect(playerCountry({ login: "fatih", country: "DE" })).toBe("TR")
    expect(playerCountry({ login: "octocat", country: "XX" })).toBeUndefined()
  })

  it("onaylı sahibin seçtiği ülke elle atanan listenin ve konumun önüne geçer", () => {
    expect(playerCountry({ login: "fatih", country: "DE", claimedCountry: "NL" })).toBe("NL")
    expect(playerCountry({ login: "octocat", country: "DE", claimedCountry: "JP" })).toBe("JP")
    expect(playerCountry({ login: "fatih", claimedCountry: "XX" })).toBe("TR")
    expect(playerCountry({ login: "octocat", country: "DE", claimedCountry: null })).toBe("DE")
  })

  it("ülkesi bilinmeyeni belirsiz sayar", () => {
    expect(playerCountryFilter({ login: "octocat" })).toBe("unknown")
    expect(playerCountryFilter({ login: "fatih" })).toBe("TR")
  })

  it("ülkeleri sayar, belirsizleri ayrı tutar", () => {
    const players = [
      { login: "fatih" },
      { login: "rakyll" },
      { login: "torvalds" },
      { login: "octocat" }
    ]
    expect(countPlayerCountries(players)).toEqual({
      countries: [
        { country: "TR", count: 2 },
        { country: "FI", count: 1 }
      ],
      unknown: 1
    })
  })
})
