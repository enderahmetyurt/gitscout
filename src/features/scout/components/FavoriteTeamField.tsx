import { ChevronDown, Shirt } from "lucide-react"

import { TEAM_NAMES, TEAMS } from "@/constants/team.constants"
import type { Team } from "@/constants/team.constants"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { FLAG_CLASS } from "@/features/scout/constants/country-flag.constants"
import { FIELD_TRIGGER_CLASS } from "@/features/scout/constants/form.constants"
import {
  TEAM_COUNTRY_FLAGS,
  TEAM_COUNTRY_NAMES
} from "@/features/scout/constants/team-country.constants"
import { sortedTeamCountries, sortedTeams } from "@/features/scout/helpers/team-sort"
import { TeamCrest } from "@/features/scout/icons/TeamCrest"
import * as m from "@/paraglide/messages.js"

/** Menüde "takım tutmuyorum" seçeneğinin değeri. */
const NONE = "none"

type FavoriteTeamFieldProps = {
  value: Team | null
  onChange: (team: Team | null) => void
  disabled: boolean
}

/**
 * Favori takım seçimi (başlığı formda): ülkeler alt menü olarak açılır, takımlar armalarıyla listelenir. Ülkeler ve takımlar
 * geçerli dilde alfabetik sıralıdır. Takım sayısı arttıkça form uzamaz.
 */
export function FavoriteTeamField({ value, onChange, disabled }: FavoriteTeamFieldProps) {
  const select = (next: unknown) => onChange(TEAMS.find((team) => team === next) ?? null)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        type="button"
        aria-labelledby="team-label team-value"
        disabled={disabled}
        className={FIELD_TRIGGER_CLASS}
      >
        <span className="flex min-w-0 items-center gap-2">
          {value ? (
            <TeamCrest team={value} adaptive className="size-5 shrink-0" />
          ) : (
            <Shirt aria-hidden />
          )}
          <span id="team-value" className="truncate">
            {value ? TEAM_NAMES[value] : m.team_unset()}
          </span>
        </span>
        <ChevronDown aria-hidden className="text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-auto min-w-56">
        <DropdownMenuRadioGroup value={value ?? NONE} onValueChange={select}>
          <DropdownMenuRadioItem value={NONE} closeOnClick>
            {m.team_unset()}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        {/* Her ülke kendi alt menüsünde açılır: takım sayısı arttıkça menü uzamaz. */}
        {sortedTeamCountries().map((country) => {
          const Flag = TEAM_COUNTRY_FLAGS[country]
          const selected = value !== null && sortedTeams(country).includes(value)
          return (
            <DropdownMenuSub key={country}>
              <DropdownMenuSubTrigger className={selected ? "font-medium" : undefined}>
                <Flag aria-hidden className={FLAG_CLASS} />
                {TEAM_COUNTRY_NAMES[country]()}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="min-w-56">
                <DropdownMenuRadioGroup value={value ?? NONE} onValueChange={select}>
                  {sortedTeams(country).map((team) => (
                    <DropdownMenuRadioItem key={team} value={team} closeOnClick>
                      <TeamCrest team={team} adaptive className="size-5 shrink-0" />
                      <span className="whitespace-nowrap">{TEAM_NAMES[team]}</span>
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
