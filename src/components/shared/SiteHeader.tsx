import { Link } from "@tanstack/react-router"

import { ThemeToggle } from "@/components/shared/ThemeToggle"

export function SiteHeader() {
  return (
    <header>
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-2 px-4 py-4 sm:px-6">
        <Link
          to="/"
          lang="en"
          className="rounded-sm text-xl font-bold tracking-wide uppercase outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          Gitscout
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}
