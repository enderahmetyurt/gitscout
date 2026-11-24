import { ListFilter } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { RARITY_LABELS, RARITY_THRESHOLDS } from "@/features/scout/constants/scoring.constants"
import { useLeaderboardSearch } from "@/features/scout/hooks/use-leaderboard-search"
import { POSITIONS, RARITIES } from "@/features/scout/schemas/leaderboard-search.schema"
import type { Rarity, ScoredPlayer } from "@/features/scout/types/player.types"

type LeaderboardFiltersProps = {
  players: ScoredPlayer[]
}

/** Eşiklerden okunabilir aralık: "90+", "80–89", "0–64". */
function rarityRange(rarity: Rarity): string {
  const index = RARITY_THRESHOLDS.findIndex((threshold) => threshold.rarity === rarity)
  const min = RARITY_THRESHOLDS[index]?.min ?? 0
  const above = RARITY_THRESHOLDS[index - 1]
  return above ? `${min}–${above.min - 1}` : `${min}+`
}

/** Seçili değeri listeye ekler ya da çıkarır. */
function toggle<T>(list: readonly T[], value: T, checked: boolean): T[] {
  return checked ? [...list, value] : list.filter((item) => item !== value)
}

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
        Filtrele
        {activeCount > 0 ? (
          <span className="rounded-sm bg-foreground px-1.5 text-xs text-background">
            {activeCount}
            <span className="sr-only"> filtre seçili</span>
          </span>
        ) : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Mevki</DropdownMenuLabel>
          {positions.map((position) => (
            <DropdownMenuCheckboxItem
              key={position}
              lang="en"
              checked={filters.positions.includes(position)}
              onCheckedChange={(checked) =>
                setFilters({ positions: toggle(filters.positions, position, checked) })
              }
            >
              {position}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Kart</DropdownMenuLabel>
          {rarities.map((rarity) => (
            <DropdownMenuCheckboxItem
              key={rarity}
              checked={filters.rarities.includes(rarity)}
              onCheckedChange={(checked) =>
                setFilters({ rarities: toggle(filters.rarities, rarity, checked) })
              }
            >
              <span aria-hidden data-rarity={rarity} className="rarity-dot size-2.5 rounded-full" />
              {RARITY_LABELS[rarity]}
              <span className="ms-auto ps-3 text-xs text-muted-foreground">
                {rarityRange(rarity)}
              </span>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
        {activeCount > 0 ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setFilters({ positions: [], rarities: [] })}>
              Filtreleri temizle
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
