import { ListFilter } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { rarityLabel } from "@/features/scout/helpers/player-text"
import { rarityRange } from "@/features/scout/helpers/rarity-range"
import { useLeaderboardSearch } from "@/features/scout/hooks/use-leaderboard-search"
import { POSITIONS, RARITIES } from "@/features/scout/schemas/leaderboard-search.schema"
import type { ScoredPlayer } from "@/features/scout/types/player.types"
import * as m from "@/paraglide/messages.js"

type LeaderboardFiltersProps = {
  players: ScoredPlayer[]
}

/** Radyo grubunda "hepsi" seçeneğinin değeri; filtreyi kaldırır. */
const ALL = "all"

/** Mevki ve kart filtreleri; yalnızca tabloda gerçekten bulunan seçenekler listelenir. */
export function LeaderboardFilters({ players }: LeaderboardFiltersProps) {
  const { filters, setFilters } = useLeaderboardSearch()
  const positions = POSITIONS.filter((position) =>
    players.some((player) => player.position === position)
  )
  const rarities = RARITIES.filter((rarity) => players.some((player) => player.rarity === rarity))
  const activeCount = filters.positions.length + filters.rarities.length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={buttonVariants({ variant: "outline", size: "sm" })}>
        <ListFilter aria-hidden />
        {m.filter_button()}
        {activeCount > 0 ? (
          <span className="rounded-sm bg-foreground px-1.5 text-xs text-background">
            {activeCount}
            <span className="sr-only"> {m.filter_selected()}</span>
          </span>
        ) : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 overscroll-contain">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{m.filter_position()}</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={filters.positions[0] ?? ALL}
            onValueChange={(value) => {
              const position = positions.find((item) => item === value)
              setFilters({ positions: position ? [position] : [] })
            }}
          >
            <DropdownMenuRadioItem value={ALL}>{m.filter_all_positions()}</DropdownMenuRadioItem>
            {positions.map((position) => (
              <DropdownMenuRadioItem key={position} value={position} lang="en">
                <span aria-hidden data-role={position} className="role-fill size-2 rounded-full" />
                {position}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>{m.filter_card()}</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={filters.rarities[0] ?? ALL}
            onValueChange={(value) => {
              const rarity = rarities.find((item) => item === value)
              setFilters({ rarities: rarity ? [rarity] : [] })
            }}
          >
            <DropdownMenuRadioItem value={ALL}>{m.filter_all_cards()}</DropdownMenuRadioItem>
            {rarities.map((rarity) => (
              <DropdownMenuRadioItem key={rarity} value={rarity}>
                <span
                  aria-hidden
                  data-rarity={rarity}
                  className="rarity-dot size-2.5 rounded-full"
                />
                {rarityLabel(rarity)}
                <span className="ms-auto ps-3 text-xs text-muted-foreground">
                  {rarityRange(rarity)}
                </span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        {activeCount > 0 ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setFilters({ positions: [], rarities: [] })}>
              {m.filter_clear()}
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
