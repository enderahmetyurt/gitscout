import type { PlayerRanking, ScoredPlayer } from "@/features/scout/types/player.types"
import * as m from "@/paraglide/messages.js"
import { getLocale } from "@/paraglide/runtime.js"

type PlayerRankProps = {
  ranking: PlayerRanking
  position: ScoredPlayer["position"]
}

/** Sıralama oyunun en güçlü hissi: genel ve mevki sırası büyük rakamla, iki hücrede. */
export function PlayerRank({ ranking, position }: PlayerRankProps) {
  const format = new Intl.NumberFormat(getLocale())

  return (
    <div className="surface grid w-full max-w-80 grid-cols-2 divide-x text-center">
      <p className="sr-only">
        {m.ranking({
          overall: ranking.overall,
          total: ranking.total,
          position,
          inPosition: ranking.inPosition,
          positionTotal: ranking.positionTotal
        })}
      </p>
      <RankCell
        label={m.rank_overall()}
        rank={ranking.overall}
        total={format.format(ranking.total)}
      />
      <RankCell
        label={position}
        lang="en"
        rank={ranking.inPosition}
        total={format.format(ranking.positionTotal)}
      />
    </div>
  )
}

type RankCellProps = {
  label: string
  rank: number
  total: string
  lang?: string
}

function RankCell({ label, rank, total, lang }: RankCellProps) {
  return (
    <div aria-hidden className="flex flex-col items-center gap-0.5 px-3 py-2.5">
      <span lang={lang} className="text-xs tracking-widest text-muted-foreground uppercase">
        {label}
      </span>
      <span className="font-mono text-2xl leading-none font-semibold tabular-nums">
        #{rank}
        <span className="ms-1 text-xs font-normal text-muted-foreground">/ {total}</span>
      </span>
    </div>
  )
}
