import { cn } from "cn"

import { RarityChip } from "@/features/scout/components/RarityChip"
import { rarityLabel } from "@/features/scout/helpers/player-text"
import { rarityRange } from "@/features/scout/helpers/rarity-range"
import { RARITIES } from "@/features/scout/schemas/leaderboard-search.schema"
import * as m from "@/paraglide/messages.js"

/** Kart türleri ve puan aralıkları: her biri kendi renginde mini kartla. */
export function RarityLegend({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {RARITIES.map((rarity) => (
        <li key={rarity} className="surface flex items-center gap-2.5 py-1.5 ps-1.5 pe-3 text-sm">
          <span aria-hidden className="flex">
            <RarityChip ovr={0} rarity={rarity} label={rarityRange(rarity)} />
          </span>
          <span className="sr-only">
            {m.about_rarity({ rarity: rarityLabel(rarity), range: rarityRange(rarity) })}
          </span>
          <span aria-hidden>{rarityLabel(rarity)}</span>
        </li>
      ))}
    </ul>
  )
}
