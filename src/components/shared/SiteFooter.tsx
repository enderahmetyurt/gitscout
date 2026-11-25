import { Link } from "@tanstack/react-router"

import { siteConfig } from "@/config/site.config"

import { getLangParam } from "@/helpers/localized-url"

import { BuyMeACoffeeButton } from "@/components/shared/BuyMeACoffeeButton"
import * as m from "@/paraglide/messages.js"

const linkClass =
  "inline-flex min-h-6 items-center rounded-sm text-foreground underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:px-6">
        <p className="flex flex-wrap items-center gap-x-1.5">
          <a href="https://omergulcicek.com" target="_blank" rel="noreferrer" className={linkClass}>
            Ömer Gülçiçek
            <span className="sr-only"> {m.new_tab()}</span>
          </a>
          <span aria-hidden>·</span>
          {/* Dillerde sözcük sırası farklı: "Built with X" / "X ile geliştirildi". */}
          <span>
            {m.footer_built_before()}
            <a href="https://virastack.com" target="_blank" rel="noreferrer" className={linkClass}>
              ViraStack Start
              <span className="sr-only"> {m.new_tab()}</span>
            </a>
            {m.footer_built_after()}
          </span>
        </p>
        <div className="flex items-center gap-4">
          <Link to="/{-$lang}/about" params={{ lang: getLangParam() }} className={linkClass}>
            {m.nav_about()}
          </Link>
          <BuyMeACoffeeButton size="sm" />
          <a href={siteConfig.links.github} target="_blank" rel="noreferrer" className={linkClass}>
            GitHub
            <span className="sr-only"> {m.new_tab()}</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
