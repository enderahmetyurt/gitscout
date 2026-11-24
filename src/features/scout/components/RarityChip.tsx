import { cn } from "cn"

import { rarityLabel } from "@/features/scout/helpers/player-text"
import type { Rarity } from "@/features/scout/types/player.types"

type RarityChipProps = {
  ovr: number
  rarity: Rarity
  className?: string
}

/** Genel puan: yalnızca rakam; kart türünün adı ipucunda ve ekran okuyucuda. */
export function RarityChip({ ovr, rarity, className }: RarityChipProps) {
  return (
    <span className={cn("text-base font-bold tabular-nums", className)} title={rarityLabel(rarity)}>
      {ovr}
      <span className="sr-only"> ({rarityLabel(rarity)})</span>
    </span>
  )
}
