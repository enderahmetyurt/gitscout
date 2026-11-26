import { BadgeCheck } from "lucide-react"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import * as m from "@/paraglide/messages.js"

/**
 * Profilini GitHub ile sahiplenmiş, onay koşullarını geçmiş geliştirici. Listede satırın tamamı bağlantı
 * olduğu için tetikleyici `z-10` ile üste çıkar; üzerine gelince açıklamayı yazar.
 */
export function VerifiedIcon() {
  const label = m.verified_label()
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span
            role="img"
            aria-label={label}
            className="relative z-10 inline-flex shrink-0 text-verified"
          />
        }
      >
        <BadgeCheck aria-hidden className="size-4" />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
