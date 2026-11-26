import { DE, ES, FR, GB_ENG, IT, TR } from "country-flag-icons/react/3x2"

import type { TeamCountry } from "@/constants/team.constants"

import * as m from "@/paraglide/messages.js"

/** Takım ülkelerinin adları; mesajlar okunduğu anda geçerli dilde yazılır. */
export const TEAM_COUNTRY_NAMES = {
  turkey: m.team_country_turkey,
  england: m.team_country_england,
  spain: m.team_country_spain,
  germany: m.team_country_germany,
  italy: m.team_country_italy,
  france: m.team_country_france
} as const satisfies Record<TeamCountry, () => string>

/** Takım ülkelerinin bayrakları. İngiltere, Birleşik Krallık değil İngiltere bayrağıyla gösterilir. */
export const TEAM_COUNTRY_FLAGS = {
  turkey: TR,
  england: GB_ENG,
  spain: ES,
  germany: DE,
  italy: IT,
  france: FR
} as const satisfies Record<TeamCountry, typeof TR>
