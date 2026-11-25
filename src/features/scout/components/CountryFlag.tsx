import type { ReactNode } from "react"

import type { CountryCode } from "@/features/scout/constants/player-country.constants"
import { countryName } from "@/features/scout/helpers/player-country"

/**
 * Emoji bayraklar Windows'ta harf olarak görünür; bu yüzden SVG çizilir.
 * Türk bayrağı ölçüleri Wikimedia'daki resmi oranlı çizimden (1200×800).
 */
const FLAGS: Record<CountryCode, ReactNode> = {
  TR: (
    <>
      <rect width="1200" height="800" fill="#e30a17" />
      <circle cx="425" cy="400" r="200" fill="#fff" />
      <circle cx="475" cy="400" r="160" fill="#e30a17" />
      <path fill="#fff" d="M583.334 400l180.901 58.779-111.804-153.885v190.212l111.804-153.885z" />
    </>
  )
}

export function CountryFlag({ country }: { country: CountryCode }) {
  const name = countryName(country)
  return (
    <svg
      viewBox="0 0 1200 800"
      role="img"
      aria-label={name}
      className="inline-block h-2.5 w-auto shrink-0 rounded-[2px] outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
    >
      <title>{name}</title>
      {FLAGS[country]}
    </svg>
  )
}
