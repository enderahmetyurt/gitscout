import { Link } from "@tanstack/react-router"
import { IdCard } from "lucide-react"

import { TEAMS } from "@/constants/team.constants"

import { getLangParam } from "@/helpers/localized-url"

import { CARD_OCCASIONS } from "@/features/scout/constants/card-occasion.constants"
import { TeamCrest } from "@/features/scout/icons/TeamCrest"
import type { CardOccasion } from "@/features/scout/types/card-preview.types"
import * as m from "@/paraglide/messages.js"

const optionClass =
  "inline-flex size-8 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-xs"

type CardOccasionPickerProps = {
  /** Gösterilen özel kart; `null` gerçek kart. */
  value: CardOccasion | null
  /** Kişiye uyan özel kartlar; uymayan seçenek hiç gösterilmez. */
  options: readonly CardOccasion[]
  onChange: (occasion: CardOccasion | null) => void
}

/** Kart önizlemesinin altındaki seçici: gerçek kart ya da kişiye uyan özel günlerden biri. Yalnızca önizleme. */
export function CardOccasionPicker({ value, options, onChange }: CardOccasionPickerProps) {
  const items = [
    { key: "real", occasion: null, icon: IdCard, label: m.occasion_real },
    ...options.map((occasion) => ({
      key: occasion,
      occasion,
      icon: CARD_OCCASIONS[occasion].icon,
      label: CARD_OCCASIONS[occasion].chip
    }))
  ]

  const selected = items.find((item) => item.occasion === value) ?? items[0]

  // Seçenekler her zaman yalnızca simge; seçilenin adı satırın altında yazar. Ad ne kadar uzun olursa
  // olsun ve yeni özel günler eklendikçe satır taşmaz.
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        role="group"
        aria-label={m.card_preview_label()}
        className="flex items-center gap-1 rounded-md bg-muted p-1"
      >
        {items.map(({ key, occasion, icon: Icon, label }) => {
          // Takım kartının simgesi genel kalkan yerine takımın kendi arması.
          const team = TEAMS.find((item) => item === occasion)
          return (
            <button
              key={key}
              type="button"
              aria-pressed={value === occasion}
              aria-label={label()}
              title={label()}
              onClick={() => onChange(occasion)}
              className={optionClass}
            >
              {team ? (
                <TeamCrest team={team} adaptive className="size-5" />
              ) : (
                <Icon aria-hidden className="size-4" />
              )}
            </button>
          )
        })}
      </div>
      <p aria-hidden className="text-xs font-medium">
        {selected?.label()}
      </p>
      <Link
        to="/{-$lang}/special-cards"
        params={{ lang: getLangParam() }}
        className="rounded-sm text-xs text-muted-foreground underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        {m.special_cards_all()}
      </Link>
    </div>
  )
}
