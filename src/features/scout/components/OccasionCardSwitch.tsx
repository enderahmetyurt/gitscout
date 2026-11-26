import { IdCard } from "lucide-react"

import { CARD_OCCASIONS } from "@/features/scout/constants/card-occasion.constants"
import type { CardOccasion } from "@/features/scout/types/card-preview.types"
import * as m from "@/paraglide/messages.js"

type OccasionCardSwitchProps = {
  occasion: CardOccasion
  /** Kartın sahibi; doğum gününde başlık ona "doğum günün kutlu olsun", ziyaretçiye "bugün doğum günü" der. */
  name: string
  isOwner: boolean
  /** Özel gün kartı mı gösteriliyor. */
  active: boolean
  onChange: (active: boolean) => void
}

const optionClass =
  "inline-flex min-h-7 items-center gap-1.5 rounded-sm px-2.5 text-xs font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-xs"

/** Özel günde kutlama kartı ile gerçek kart arasında geçiş. Sıralama her zaman gerçek puanı kullanır. */
export function OccasionCardSwitch({
  occasion,
  name,
  isOwner,
  active,
  onChange
}: OccasionCardSwitchProps) {
  const { icon: Icon, card, wish } = CARD_OCCASIONS[occasion]
  const heading =
    occasion === "birthday"
      ? isOwner
        ? m.birthday_heading()
        : m.birthday_heading_visitor({ name })
      : occasion === "programmers-day"
        ? m.programmers_day_heading()
        : wish()

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="flex items-center gap-1.5 text-sm font-semibold">
        <Icon aria-hidden className="size-4 text-muted-foreground" />
        {heading}
      </p>
      <div
        role="group"
        aria-label={m.birthday_switch_label()}
        className="flex gap-1 rounded-md bg-muted p-1"
      >
        <button
          type="button"
          aria-pressed={active}
          onClick={() => onChange(true)}
          className={optionClass}
        >
          <Icon aria-hidden className="size-3.5" />
          {card()}
        </button>
        <button
          type="button"
          aria-pressed={!active}
          onClick={() => onChange(false)}
          className={optionClass}
        >
          <IdCard aria-hidden className="size-3.5" />
          {m.birthday_real_card()}
        </button>
      </div>
    </div>
  )
}
