import { Link } from "@tanstack/react-router"

const navLinkClass =
  "rounded-sm text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[status=active]:text-foreground"

export function SiteHeader() {
  return (
    <header>
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          to="/"
          lang="en"
          className="rounded-sm text-xl font-bold tracking-wide uppercase outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          Gitscout
        </Link>
        <nav aria-label="Ana menü" className="flex items-center gap-5">
          <Link to="/leaderboard" className={navLinkClass}>
            Liderlik tablosu
          </Link>
          <Link to="/vs" className={navLinkClass}>
            Kapışma
          </Link>
        </nav>
      </div>
    </header>
  )
}
