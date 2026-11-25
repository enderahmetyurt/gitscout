import { Link } from "@tanstack/react-router"
import { cn } from "cn"

import { getLangParam } from "@/helpers/localized-url"

import * as m from "@/paraglide/messages.js"

export type TopView = "world" | "tr"

const itemClass =
  "inline-flex min-h-6 items-center rounded-sm px-1.5 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"

/** Ana sayfadaki ilk 10 listesinin yanında "Dünya · Türkiye" seçimi; seçim URL'de tutulur. */
export function TopViewSwitch({ view }: { view: TopView }) {
  const item = (target: TopView, label: string) =>
    // Seçili olan bağlantı değildir: iki bağlantı da aynı yola gittiği için yönlendirici ikisini de "aktif" sayar.
    view === target ? (
      <span aria-current="true" className={cn(itemClass, "font-semibold text-foreground")}>
        {label}
      </span>
    ) : (
      <Link
        to="/{-$lang}"
        params={{ lang: getLangParam() }}
        search={(prev) => ({ ...prev, top: target })}
        replace
        resetScroll={false}
        className={cn(itemClass, "text-muted-foreground hover:text-foreground")}
      >
        {label}
      </Link>
    )

  return (
    <nav aria-label={m.home_top_switch_label()} className="flex items-center">
      {item("world", m.home_top_world())}
      <span aria-hidden className="text-muted-foreground">
        ·
      </span>
      {item("tr", m.home_top_tr())}
    </nav>
  )
}
