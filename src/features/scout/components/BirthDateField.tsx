import { useState } from "react"

import { CalendarDays } from "lucide-react"
import { enUS, tr } from "react-day-picker/locale"

import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FIELD_TRIGGER_CLASS } from "@/features/scout/constants/form.constants"
import * as m from "@/paraglide/messages.js"
import { getLocale } from "@/paraglide/runtime.js"

/** Seçilebilen yaş aralığı; sunucu da aynı sınırı uygular. GitHub 13 yaş altına hesap açtırmaz. */
const AGE_RANGE = { min: 13, max: 100 } as const

/** "YYYY-AA-GG" metnini yerel saatte gece yarısına çevirir; saat dilimi günü kaydırmasın. */
function parseDay(value: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return undefined
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
}

const pad = (part: number) => String(part).padStart(2, "0")

/** Takvimde seçilen günü saklanacak "YYYY-AA-GG" biçimine çevirir. */
const formatDay = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

type BirthDateFieldProps = {
  /** "YYYY-AA-GG" ya da boş metin. */
  value: string
  onChange: (value: string) => void
  disabled: boolean
  /** Alanın altındaki kural metninin kimliği. */
  describedBy: string
}

/**
 * Doğum tarihi seçici: düğmeye basınca takvim açılır. Başlıktaki ay ve yıl listeleriyle yıllar arasında
 * tek tıkla geçilir; 13 yaşından küçük ve 100 yaşından büyük tarihler seçilemez.
 */
export function BirthDateField({ value, onChange, disabled, describedBy }: BirthDateFieldProps) {
  const [open, setOpen] = useState(false)
  const locale = getLocale() === "tr" ? tr : enUS
  const selected = parseDay(value)
  const year = new Date().getFullYear()
  const earliest = new Date(year - AGE_RANGE.max, 0, 1)
  const latest = new Date(year - AGE_RANGE.min, 11, 31)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        disabled={disabled}
        aria-labelledby="birth-label birth-value"
        aria-describedby={describedBy}
        className={FIELD_TRIGGER_CLASS}
      >
        <span id="birth-value" className={selected ? undefined : "text-muted-foreground"}>
          {selected
            ? new Intl.DateTimeFormat(getLocale(), { dateStyle: "long" }).format(selected)
            : m.birth_date_pick()}
        </span>
        <CalendarDays aria-hidden className="text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          locale={locale}
          captionLayout="dropdown"
          selected={selected}
          defaultMonth={selected ?? new Date(year - 25, 0, 1)}
          startMonth={earliest}
          endMonth={latest}
          disabled={{ before: earliest, after: latest }}
          onSelect={(date) => {
            if (!date) return
            onChange(formatDay(date))
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
