import { Link } from "@tanstack/react-router"
import {
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  sortFn_text,
  tableFeatures,
  useTable
} from "@tanstack/react-table"
import type { SortingState } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { cn } from "cn"

import { getLangParam } from "@/helpers/localized-url"

import { GithubStarIcon } from "@/features/scout/components/GithubStarIcon"
import { RarityChip } from "@/features/scout/components/RarityChip"
import { COUNTRY_FLAGS, FLAG_CLASS } from "@/features/scout/constants/country-flag.constants"
import { STAT_ORDER } from "@/features/scout/constants/scoring.constants"
import { STAT_TIER_TEXT } from "@/features/scout/constants/stat-tier.constants"
import { isGithubStar } from "@/features/scout/helpers/github-star"
import { countryName, playerCountry } from "@/features/scout/helpers/player-country"
import { statLabel, statShort, titleText } from "@/features/scout/helpers/player-text"
import { statTier } from "@/features/scout/helpers/stat-tier"
import { useLeaderboardSearch } from "@/features/scout/hooks/use-leaderboard-search"
import {
  LEADERBOARD_SORT_KEYS,
  leaderboardSearchDefaults
} from "@/features/scout/schemas/leaderboard-search.schema"
import type { LeaderboardSearch } from "@/features/scout/schemas/leaderboard-search.schema"
import type { ListPlayer } from "@/features/scout/types/player.types"
import * as m from "@/paraglide/messages.js"

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { text: sortFn_text }
})

/** Sıra, seçili filtrelerin içindeki genel puan sırasıdır; isim aramasından ve sütun sıralamasından etkilenmez. */
type RankedPlayer = ListPlayer & { rank: number }

const helper = createColumnHelper<typeof features, RankedPlayer>()

const statColumns = STAT_ORDER.map((key) =>
  helper.accessor((player) => player.stats[key].value, {
    id: key,
    header: () => statShort(key),
    sortDescFirst: true,
    meta: { align: "center", label: () => statLabel(key), wide: true },
    cell: (info) => {
      const value = info.getValue()
      return <span className={cn("font-medium", STAT_TIER_TEXT[statTier(value)])}>{value}</span>
    }
  })
)

const columns = helper.columns([
  helper.display({
    id: "rank",
    header: "#",
    enableSorting: false,
    // Veri sunucudan genel puana göre sıralı gelir; sıra numarası tablo nasıl sıralanırsa sıralansın OVR sırasıdır.
    cell: ({ row }) => (
      <span className={row.original.rank <= 3 ? "font-semibold text-foreground" : undefined}>
        {row.original.rank}
      </span>
    )
  }),
  helper.accessor("name", {
    id: "name",
    header: () => m.col_player(),
    sortFn: "text",
    cell: ({ row }) => <PlayerCell player={row.original} />
  }),
  helper.accessor("position", {
    id: "position",
    header: () => m.col_position(),
    sortFn: "text",
    meta: { wide: true },
    cell: (info) => (
      <span
        lang="en"
        data-role={info.getValue()}
        className="role-tint inline-flex h-5 items-center rounded-full px-2 text-xs font-medium whitespace-nowrap"
      >
        {info.getValue()}
      </span>
    )
  }),
  // Tam sayı puan gösterilir ama ondalıklı puana göre sıralanır; eşitlikte alfabe değil puan karar verir.
  helper.accessor((player) => player.ovrExact, {
    id: "ovr",
    header: () => m.col_ovr(),
    sortDescFirst: true,
    meta: { align: "center", label: () => m.col_ovr_label() },
    cell: ({ row }) => <RarityChip ovr={row.original.ovr} rarity={row.original.rarity} />
  }),
  ...statColumns
])

/** `wide`: dar ekranda gizlenen sütun; telefonda yalnızca sıra, oyuncu ve puan kalır. */
type ColumnMeta = { align?: "center"; label?: string; wide: boolean }

/** Sütun etiketleri fonksiyon olarak saklanır; okunduğu anda geçerli dilde yazılır. */
function readMeta(meta: unknown): ColumnMeta {
  if (typeof meta !== "object" || meta === null) return { wide: false }
  const align = "align" in meta && meta.align === "center" ? "center" : undefined
  const read: unknown = "label" in meta ? meta.label : undefined
  const label = typeof read === "function" ? String(read()) : undefined
  const wide = "wide" in meta && meta.wide === true
  return { align, label, wide }
}

function isSortKey(id: string): id is LeaderboardSearch["sort"] {
  return LEADERBOARD_SORT_KEYS.some((key) => key === id)
}

function PlayerCell({ player }: { player: ListPlayer }) {
  const country = playerCountry(player)
  const Flag = country ? COUNTRY_FLAGS[country] : undefined
  return (
    <Link
      to="/{-$lang}/u/$username"
      params={{ lang: getLangParam(), username: player.login }}
      className="flex items-center gap-3 rounded-sm outline-none after:absolute after:inset-0 focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <img
        src={player.avatarUrl}
        alt=""
        width={36}
        height={36}
        className="size-9 rounded-full bg-muted outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
      />
      <span className="min-w-0">
        <span className="flex items-center gap-1.5">
          <span className="min-w-0 truncate font-medium text-foreground">{player.name}</span>
          {isGithubStar(player.login) && <GithubStarIcon />}
          {country && Flag ? (
            <Flag
              role="img"
              aria-label={countryName(country)}
              title={countryName(country)}
              className={FLAG_CLASS}
            />
          ) : null}
        </span>
        <span className="block truncate text-xs text-muted-foreground">
          @{player.login} · {titleText(player.title)}
        </span>
      </span>
    </Link>
  )
}

type LeaderboardTableProps = {
  players: ListPlayer[]
  /**
   * Sıra numarasının sayıldığı liste: seçili filtrelerden geçen herkes, isim aramasından önce.
   * Sunucudan genel puana göre sıralı gelir.
   */
  rankPool: ListPlayer[]
}

export function LeaderboardTable({ players, rankPool }: LeaderboardTableProps) {
  const rankOf = new Map(rankPool.map((player, index) => [player.login, index + 1]))
  const data = players.map((player) => ({ ...player, rank: rankOf.get(player.login) ?? 0 }))
  const { search, update } = useLeaderboardSearch()
  const sorting: SortingState = [{ id: search.sort, desc: search.dir === "desc" }]

  const table = useTable({
    features,
    columns,
    data,
    state: { sorting },
    // Sıralama hiç kalkmasın: üçüncü tıklamada boş tablo yerine yön değişir.
    enableSortingRemoval: false,
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater
      const first = next[0]
      const sort = first && isSortKey(first.id) ? first.id : leaderboardSearchDefaults.sort
      update({ sort, dir: first?.desc === false ? "asc" : "desc" })
    }
  })

  return (
    <div className="surface overflow-x-auto">
      <table className="w-full text-sm sm:min-w-180">
        <caption className="sr-only">{m.table_caption()}</caption>
        <thead className="border-b bg-muted/40 text-xs text-muted-foreground uppercase">
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => {
                const { align, label, wide } = readMeta(header.column.columnDef.meta)
                const sorted = header.column.getIsSorted()
                const canSort = header.column.getCanSort()
                const SortIcon =
                  sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown
                return (
                  <th
                    key={header.id}
                    scope="col"
                    aria-sort={
                      sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined
                    }
                    className={cn(
                      align === "center"
                        ? "px-1 py-2 text-center font-medium"
                        : "px-3 py-2 text-left font-medium",
                      wide && "max-sm:hidden"
                    )}
                  >
                    {canSort ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        title={label ? m.sort_by({ label }) : undefined}
                        className={
                          sorted
                            ? "inline-flex min-h-6 items-center gap-1 rounded-sm text-foreground uppercase outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            : "inline-flex min-h-6 items-center gap-1 rounded-sm uppercase outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        }
                      >
                        <table.FlexRender header={header} />
                        <SortIcon
                          aria-hidden
                          className={sorted ? "size-3.5" : "size-3.5 opacity-40"}
                        />
                      </button>
                    ) : (
                      <table.FlexRender header={header} />
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.original.login}
              className="relative border-b transition-colors last:border-0 hover:bg-muted/40"
            >
              {row.getAllCells().map((cell) => {
                const { align, wide } = readMeta(cell.column.columnDef.meta)
                const isRank = cell.column.id === "rank"
                return (
                  <td
                    key={cell.id}
                    className={cn(
                      isRank
                        ? "w-12 px-3 py-3 text-muted-foreground tabular-nums"
                        : align === "center"
                          ? "px-1 py-3 text-center tabular-nums"
                          : "px-3 py-3",
                      wide && "max-sm:hidden",
                      // Dar ekranda isim sütunu kalan alanı alır ve uzun adlar kesilir; tablo yana taşmaz.
                      cell.column.id === "name" && "max-sm:w-full max-sm:max-w-0"
                    )}
                  >
                    <table.FlexRender cell={cell} />
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
