import { Globe } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { CountryFlag } from "@/features/scout/components/CountryFlag"
import { UNKNOWN_COUNTRY } from "@/features/scout/constants/player-country.constants"
import { parseCountry } from "@/features/scout/helpers/filter-params"
import { countPlayerCountries, countryName } from "@/features/scout/helpers/player-country"
import { useLeaderboardSearch } from "@/features/scout/hooks/use-leaderboard-search"
import type { ListPlayer } from "@/features/scout/types/player.types"
import * as m from "@/paraglide/messages.js"

/** Radyo grubunda "hepsi" seçeneğinin değeri; filtreyi kaldırır. */
const ALL = "all"

type CountryFilterMenuProps = {
  players: ListPlayer[]
}

/**
 * Ülke listesi uzayabileceği için mevki ve kart filtresinden ayrı bir menü.
 * Ülkeler kalabalıktan aza sıralanır, ülkesi bilinmeyenler en altta "Belirsiz" olarak durur.
 */
export function CountryFilterMenu({ players }: CountryFilterMenuProps) {
  const { filters, setFilters } = useLeaderboardSearch()
  const { countries, unknown } = countPlayerCountries(players)
  const selected = filters.country

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={m.filter_country()}
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        {selected && selected !== UNKNOWN_COUNTRY ? (
          <>
            <CountryFlag country={selected} />
            {countryName(selected)}
          </>
        ) : (
          <>
            <Globe aria-hidden />
            {selected === UNKNOWN_COUNTRY ? m.country_unknown() : m.filter_country()}
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-80 w-52 overscroll-contain">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{m.filter_country()}</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={selected ?? ALL}
            onValueChange={(value) => setFilters({ country: parseCountry(String(value)) })}
          >
            <DropdownMenuRadioItem value={ALL}>
              {m.filter_all_countries()}
              <Count value={players.length} />
            </DropdownMenuRadioItem>
            {countries.map(({ country, count }) => (
              <DropdownMenuRadioItem key={country} value={country}>
                <CountryFlag country={country} />
                {countryName(country)}
                <Count value={count} />
              </DropdownMenuRadioItem>
            ))}
            {unknown > 0 ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuRadioItem value={UNKNOWN_COUNTRY}>
                  {m.country_unknown()}
                  <Count value={unknown} />
                </DropdownMenuRadioItem>
              </>
            ) : null}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Count({ value }: { value: number }) {
  return <span className="ms-auto ps-3 text-xs text-muted-foreground tabular-nums">{value}</span>
}
