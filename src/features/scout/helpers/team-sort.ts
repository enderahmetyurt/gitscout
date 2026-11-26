import { TEAM_COUNTRIES, TEAM_NAMES, TEAMS_BY_COUNTRY } from "@/constants/team.constants"
import type { Team, TeamCountry } from "@/constants/team.constants"

import { TEAM_COUNTRY_NAMES } from "@/features/scout/constants/team-country.constants"
import { getLocale } from "@/paraglide/runtime.js"

/** Takım ülkeleri, geçerli dildeki adlarına göre alfabetik (Türkçede "İngiltere" "İspanya"dan önce). */
export function sortedTeamCountries(): TeamCountry[] {
  const collator = new Intl.Collator(getLocale())
  return [...TEAM_COUNTRIES].sort((a, b) =>
    collator.compare(TEAM_COUNTRY_NAMES[a](), TEAM_COUNTRY_NAMES[b]())
  )
}

/** Bir ülkenin takımları, kulüp adına göre alfabetik. */
export function sortedTeams(country: TeamCountry): Team[] {
  const collator = new Intl.Collator(getLocale())
  const teams: readonly Team[] = TEAMS_BY_COUNTRY[country]
  return [...teams].sort((a, b) => collator.compare(TEAM_NAMES[a], TEAM_NAMES[b]))
}
