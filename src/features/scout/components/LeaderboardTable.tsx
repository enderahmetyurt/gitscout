import { getRouteApi, Link } from "@tanstack/react-router"
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

import { Badge } from "@/components/ui/badge"
import { RarityChip } from "@/features/scout/components/RarityChip"
import { STAT_LABELS, STAT_ORDER } from "@/features/scout/constants/scoring.constants"
import {
  LEADERBOARD_SORT_KEYS,
  leaderboardSearchDefaults
} from "@/features/scout/schemas/leaderboard-search.schema"
import type { LeaderboardSearch } from "@/features/scout/schemas/leaderboard-search.schema"
import type { ScoredPlayer } from "@/features/scout/types/player.types"

const routeApi = getRouteApi("/")

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { text: sortFn_text }
})

const helper = createColumnHelper<typeof features, ScoredPlayer>()

const statColumns = STAT_ORDER.map((key) =>
  helper.accessor((player) => player.stats[key].value, {
    id: key,
    header: STAT_LABELS[key].short,
    sortDescFirst: true,
    meta: { align: "center", label: STAT_LABELS[key].label },
    cell: (info) => info.getValue()
  })
)

const columns = helper.columns([
  helper.display({
    id: "rank",
    header: "#",
    enableSorting: false,
    // Veri sunucudan genel puana göre sıralı gelir; sıra numarası tablo nasıl sıralanırsa sıralansın OVR sırasıdır.
    cell: ({ row }) => (
      <span className={row.index < 3 ? "font-semibold text-foreground" : undefined}>
        {row.index + 1}
      </span>
    )
  }),
  helper.accessor("name", {
    id: "name",
    header: "Oyuncu",
    sortFn: "text",
    cell: ({ row }) => <PlayerCell player={row.original} />
  }),
  helper.accessor("position", {
    id: "position",
    header: "Mevki",
    sortFn: "text",
    cell: (info) => (
      <Badge variant="secondary" lang="en">
        {info.getValue()}
      </Badge>
    )
  }),
  helper.accessor("ovr", {
    id: "ovr",
    header: "OVR",
    sortDescFirst: true,
    meta: { align: "center", label: "Genel puan" },
    cell: ({ row }) => <RarityChip ovr={row.original.ovr} rarity={row.original.rarity} />
  }),
  ...statColumns
])

type ColumnMeta = { align?: "center"; label?: string }

function readMeta(meta: unknown): ColumnMeta {
  if (typeof meta !== "object" || meta === null) return {}
  const align = "align" in meta && meta.align === "center" ? "center" : undefined
  const label = "label" in meta && typeof meta.label === "string" ? meta.label : undefined
  return { align, label }
}

function isSortKey(id: string): id is LeaderboardSearch["sort"] {
  return LEADERBOARD_SORT_KEYS.some((key) => key === id)
}

function PlayerCell({ player }: { player: ScoredPlayer }) {
  return (
    <Link
      to="/u/$username"
      params={{ username: player.login }}
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
        <span className="block truncate font-medium text-foreground">{player.name}</span>
        <span className="block truncate text-xs text-muted-foreground">
          @{player.login} · {player.title}
        </span>
      </span>
    </Link>
  )
}

type LeaderboardTableProps = {
  players: ScoredPlayer[]
}

export function LeaderboardTable({ players }: LeaderboardTableProps) {
  const search = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const sorting: SortingState = [{ id: search.sort, desc: search.dir === "desc" }]

  const table = useTable({
    features,
    columns,
    data: players,
    state: { sorting },
    // Sıralama hiç kalkmasın: üçüncü tıklamada boş tablo yerine yön değişir.
    enableSortingRemoval: false,
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater
      const first = next[0]
      const sort = first && isSortKey(first.id) ? first.id : leaderboardSearchDefaults.sort
      void navigate({
        search: { sort, dir: first?.desc === false ? "asc" : "desc" },
        replace: true,
        resetScroll: false
      })
    }
  })

  return (
    <div className="surface overflow-x-auto">
      <table className="w-full min-w-180 text-sm">
        <caption className="sr-only">
          Liderlik tablosu. Sütun başlıklarına tıklayarak sıralayabilirsin.
        </caption>
        <thead className="border-b bg-muted/40 text-xs text-muted-foreground uppercase">
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => {
                const { align, label } = readMeta(header.column.columnDef.meta)
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
                    className={
                      align === "center"
                        ? "px-1 py-2 text-center font-medium"
                        : "px-3 py-2 text-left font-medium"
                    }
                  >
                    {canSort ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        title={label ? `Sırala: ${label}` : undefined}
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
                const { align } = readMeta(cell.column.columnDef.meta)
                const isRank = cell.column.id === "rank"
                return (
                  <td
                    key={cell.id}
                    className={
                      isRank
                        ? "w-12 px-3 py-3 text-muted-foreground tabular-nums"
                        : align === "center"
                          ? "px-1 py-3 text-center tabular-nums"
                          : "px-3 py-3"
                    }
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
