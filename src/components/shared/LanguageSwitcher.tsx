import { Languages } from "lucide-react"

import * as m from "@/paraglide/messages.js"
import { getLocale, setLocale } from "@/paraglide/runtime.js"

/**
 * İki dil arasında geçiş. `setLocale` yerelleştirilmiş adresi yeni bir belge olarak açar,
 * böylece sunucunun ürettiği HTML ile URL hep aynı dilde olur.
 */
export function LanguageSwitcher() {
  const next = getLocale() === "tr" ? "en" : "tr"

  return (
    <button
      type="button"
      lang={next}
      aria-label={m.language_switch()}
      onClick={() => void setLocale(next)}
      className="inline-flex min-h-6 items-center gap-1.5 rounded-sm text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <Languages aria-hidden className="size-4" />
      <span className="sm:hidden">{next.toUpperCase()}</span>
      <span className="hidden sm:inline">{m.language_switch()}</span>
    </button>
  )
}
