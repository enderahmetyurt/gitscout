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
import { RARITY_LABELS } from "@/features/scout/constants/scoring.constants"
import { useLeaderboardSearch } from "@/features/scout/hooks/use-leaderboard-search"
import { POSITIONS, RARITIES } from "@/features/scout/schemas/leaderboard-search.schema"
import type { ScoredPlayer } from "@/features/scout/types/player.types"

type LeaderboardFiltersProps = {
  players: ScoredPlayer[]
}

/** Seçili değeri listeye ekler ya da çıkarır; liste boşalırsa filtre URL'den kalkar. */
function toggle<T>(list: readonly T[] | undefined, value: T, checked: boolean): T[] | undefined {
  const next = checked ? [...(list ?? []), value] : (list ?? []).filter((item) => item !== value)
  return next.length > 0 ? next : undefined
}

/** Mevki ve kart filtreleri; yalnızca tabloda gerçekten bulunan seçenekler listelenir. */
export function LeaderboardFilters({ players }: LeaderboardFiltersProps) {
  const { search, update } = useLeaderboardSearch()
  const positions = POSITIONS.filter((position) =>
    players.some((player) => player.position === position)
  )
  const rarities = RARITIES.filter((rarity) => players.some((player) => player.rarity === rarity))
  const activeCount = (search.pos?.length ?? 0) + (search.rarity?.length ?? 0)

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
              checked={search.pos?.includes(position) ?? false}
              onCheckedChange={(checked) => update({ pos: toggle(search.pos, position, checked) })}
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
              checked={search.rarity?.includes(rarity) ?? false}
              onCheckedChange={(checked) =>
                update({ rarity: toggle(search.rarity, rarity, checked) })
              }
            >
              {RARITY_LABELS[rarity]}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
        {activeCount > 0 ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => update({ pos: undefined, rarity: undefined })}>
              Filtreleri temizle
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
