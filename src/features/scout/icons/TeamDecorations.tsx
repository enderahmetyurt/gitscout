import type { Team } from "@/constants/team.constants"

import { TeamCrest } from "@/features/scout/icons/TeamCrest"

/**
 * Desende satır ve sütun sayısı; tek satırlar yarım sütun kayar, armalar kaydırmalı dizilir.
 * Ortalamak için `translate` değil negatif kenar boşluğu: süzülme animasyonu `translate`'i sıfırlar.
 */
const GRID = { rows: 8, cols: 4 } as const

/**
 * Yalnızca üstteki satırlar çizilir: kartın alt kısmındaki ad, kutlama satırı ve istatistiklerin arkası boş
 * kalır, armalar okunurluğu düşürmez. Aralık sekiz satırlık ızgaraya göre hesaplanır.
 */
const VISIBLE_ROWS = 5

/** Kenardaki armanın en fazla yatma açısı (derece). */
const MAX_TILT = 18

const CELLS = Array.from({ length: VISIBLE_ROWS }, (_row, row) =>
  Array.from({ length: GRID.cols + (row % 2) }, (_col, col) => {
    const left = ((col - (row % 2) * 0.5) / GRID.cols) * 100 + 12.5
    const tilt = ((left - 50) / 50) * MAX_TILT
    return {
      key: `${row}-${col}`,
      left: `${left}%`,
      top: `${(row / GRID.rows) * 100 + 6}%`,
      // Avatar kartın yatay ortasında: armaların tepesi ondan dışarıya yatar. Sol yarı sola, sağ yarı
      // sağa döner; ortaya yaklaştıkça dikleşir, iki yarı birbirinin aynası olur. Mutlak değer yuvarlanır,
      // yoksa -13,5 ile 13,5 farklı yöne yuvarlanıp simetri bozulur.
      rotate: `${Math.sign(tilt) * Math.round(Math.abs(tilt))}deg`
    }
  })
).flat()

/**
 * Takım kartının üst kısmına kaydırmalı dizilmiş küçük, soluk armalar. Yazıların ve puanların arkasında kalır.
 * Opaklık kapsayıcıda, çünkü süzülme animasyonu sonunda armayı tam opak bırakır.
 */
export function TeamDecorations({ team }: { team: Team }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[20px] opacity-[0.24]"
    >
      {CELLS.map((cell) => (
        <TeamCrest
          key={cell.key}
          team={team}
          className="card-float-in absolute -mt-3.5 -ml-3.5 size-7"
          style={{ left: cell.left, top: cell.top, rotate: cell.rotate }}
        />
      ))}
    </div>
  )
}
