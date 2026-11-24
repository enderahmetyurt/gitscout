import { cn } from "cn"

import { RARITY_LABELS } from "@/features/scout/constants/scoring.constants"
import type { Rarity } from "@/features/scout/types/player.types"

type RarityChipProps = {
  ovr: number
  rarity: Rarity
  className?: string
}

/** Genel puanı nadirlik rengiyle gösterir; nadirlik adı ekran okuyucuya da söylenir. */
export function RarityChip({ ovr, rarity, className }: RarityChipProps) {
  return (
    <span
      data-rarity={rarity}
      className={cn(
        "rarity-chip inline-flex h-8 min-w-11 items-center justify-center rounded-md border px-2 text-base font-semibold tabular-nums",
        className
      )}
      title={RARITY_LABELS[rarity]}
    >
      {ovr}
      <span className="sr-only"> ({RARITY_LABELS[rarity]})</span>
    </span>
  )
}
