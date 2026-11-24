import { Link } from "@tanstack/react-router"

import { getLangParam } from "@/helpers/localized-url"

import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher"
import * as m from "@/paraglide/messages.js"

const navLinkClass =
  "inline-flex min-h-6 items-center rounded-sm text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[status=active]:text-foreground"

export function SiteHeader() {
  const lang = getLangParam()

  return (
    <header>
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          to="/{-$lang}"
          params={{ lang }}
          lang="en"
          className="rounded-sm text-xl font-bold tracking-wide uppercase outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          Gitscout
        </Link>
        <nav aria-label={m.nav_label()} className="flex items-center gap-5">
          <Link to="/{-$lang}/leaderboard" params={{ lang }} className={navLinkClass}>
            {m.nav_leaderboard()}
          </Link>
          <Link to="/{-$lang}/vs" params={{ lang }} className={navLinkClass}>
            {m.nav_duel()}
          </Link>
          <Link to="/{-$lang}/about" params={{ lang }} className={navLinkClass}>
            {m.nav_about()}
          </Link>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  )
}
