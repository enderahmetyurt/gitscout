import type { ReactNode } from "react"

import { Info } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import * as m from "@/paraglide/messages.js"

type FieldInfoProps = {
  /** Alanın adı; düğmenin ekran okuyucu etiketi "<ad> hakkında" olur. */
  label: string
  children: ReactNode
}

/**
 * Etiketin yanındaki bilgi simgesi: alanın açıklaması tıklayınca açılan kutuda durur. Tooltip yerine
 * popover, çünkü dokunmatik ekranda üzerine gelme yok; açıklama formu kalabalıklaştırmaz.
 */
export function FieldInfo({ label, children }: FieldInfoProps) {
  return (
    <Popover>
      <PopoverTrigger
        type="button"
        aria-label={m.field_info({ label })}
        className="inline-grid size-6 place-items-center rounded-full text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <Info aria-hidden className="size-3.5" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 gap-0 p-3 text-xs leading-relaxed text-pretty">
        {children}
      </PopoverContent>
    </Popover>
  )
}
