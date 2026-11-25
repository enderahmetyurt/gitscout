import {
  PLAYER_COUNTRIES,
  UNKNOWN_COUNTRY
} from "@/features/scout/constants/player-country.constants"
import type {
  CountryCode,
  CountryFilter
} from "@/features/scout/constants/player-country.constants"
import * as m from "@/paraglide/messages.js"
import { getLocale } from "@/paraglide/runtime.js"

/** Oyuncunun elle atanmış ülkesi; listede yoksa `undefined`. GitHub kullanıcı adları büyük-küçük harf ayırmaz. */
export function playerCountry(login: string): CountryCode | undefined {
  return PLAYER_COUNTRIES.get(login.toLowerCase())
}

/** Ülke filtresindeki karşılığı: ülkesi bilinmeyenler "belirsiz" sayılır. */
export function playerCountryFilter(login: string): CountryFilter {
  return playerCountry(login) ?? UNKNOWN_COUNTRY
}

const COUNTRY_NAMES: Record<CountryCode, () => string> = {
  TR: m.country_tr
}

export function countryName(country: CountryCode): string {
  return COUNTRY_NAMES[country]()
}

type CountryCount = { country: CountryCode; count: number }

/**
 * Tabloda bulunan ülkeler, en kalabalıktan aza; eşitlikte geçerli dile göre alfabe sırası.
 * Belirsizler ayrı sayılır, menüde en sonda durur.
 */
export function countPlayerCountries(players: readonly { login: string }[]): {
  countries: CountryCount[]
  unknown: number
} {
  const counts = new Map<CountryCode, number>()
  let unknown = 0
  for (const player of players) {
    const country = playerCountry(player.login)
    if (country) counts.set(country, (counts.get(country) ?? 0) + 1)
    else unknown++
  }
  const collator = new Intl.Collator(getLocale())
  const countries = [...counts]
    .map(([country, count]) => ({ country, count }))
    .sort(
      (a, b) =>
        b.count - a.count || collator.compare(countryName(a.country), countryName(b.country))
    )
  return { countries, unknown }
}
