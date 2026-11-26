import { cn } from "cn"

import { rarityLabel } from "@/features/scout/helpers/player-text"
import type { Rarity } from "@/features/scout/types/player.types"

type RarityChipProps = {
  ovr: number
  rarity: Rarity
  /** `sm`: arama listeleri gibi dar yerler. */
  size?: "sm" | "md"
  /** Puan yerine yazılacak metin (ör. "75–89"); kart genişliği metne göre büyür. */
  label?: string
}

/**
 * Genel puan, kartın en küçük hali olarak: kart türünün çerçevesi ve zemini, ortada puan.
 * Kart türünün adı ipucunda ve ekran okuyucuda.
 */
export function RarityChip({ ovr, rarity, size = "md", label }: RarityChipProps) {
  return (
    <span
      data-rarity={rarity}
      title={rarityLabel(rarity)}
      className={cn(
        "scout-card inline-flex shrink-0",
        size === "md" ? "rounded-md p-0.5" : "rounded p-px"
      )}
    >
      {/* Liste öğeleri vurgulanınca bütün alt öğelerin rengini değiştirir; puan kart renginde kalmalı. */}
      <span
        className={cn(
          "scout-card-inner flex items-center justify-center font-mono font-bold text-(--card-ink)! tabular-nums",
          size === "md"
            ? "h-9 min-w-7 rounded-[5px] text-sm"
            : "h-7 min-w-5.5 rounded-[3px] text-[11px]",
          label && "px-2"
        )}
      >
        {label ?? ovr}
      </span>
      <span className="sr-only"> ({rarityLabel(rarity)})</span>
    </span>
  )
}
