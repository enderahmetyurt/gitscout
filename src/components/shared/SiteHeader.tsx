import { Link } from "@tanstack/react-router"
import { cn } from "cn"

import { getLangParam } from "@/helpers/localized-url"

import { GithubStarButton } from "@/components/shared/GithubStarButton"
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher"
import * as m from "@/paraglide/messages.js"

const navLinkClass =
  "inline-flex min-h-6 items-center rounded-sm text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[status=active]:text-foreground"

export function SiteHeader() {
  const lang = getLangParam()

  return (
    <header>
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link
          to="/{-$lang}"
          params={{ lang }}
          lang="en"
          className="rounded-sm text-xl font-bold tracking-wide uppercase outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          Gitscout
        </Link>
        <nav
          aria-label={m.nav_label()}
          className="flex items-center gap-3 min-[360px]:gap-4 sm:gap-5"
        >
          <Link to="/{-$lang}/leaderboard" params={{ lang }} className={navLinkClass}>
            <span className="sm:hidden">{m.nav_leaderboard_short()}</span>
            <span className="hidden sm:inline">{m.nav_leaderboard()}</span>
          </Link>
          <Link to="/{-$lang}/vs" params={{ lang }} className={navLinkClass}>
            {m.nav_duel()}
          </Link>
          {/* Dar ekranda menü sığsın diye Hakkında yalnızca alt bilgide. */}
          <Link
            to="/{-$lang}/about"
            params={{ lang }}
            className={cn(navLinkClass, "max-sm:hidden")}
          >
            {m.nav_about()}
          </Link>
          <LanguageSwitcher />
          <GithubStarButton />
        </nav>
      </div>
    </header>
  )
}
