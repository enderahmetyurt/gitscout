import { siteConfig } from "@/config/site.config"

import * as m from "@/paraglide/messages.js"

const linkClass =
  "inline-flex min-h-6 items-center rounded-sm text-foreground underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:px-6">
        <a href="https://omergulcicek.com" target="_blank" rel="noreferrer" className={linkClass}>
          {m.footer_credit({ name: "Ömer Gülçiçek" })}
          <span className="sr-only"> {m.new_tab()}</span>
        </a>
        <a href={siteConfig.links.github} target="_blank" rel="noreferrer" className={linkClass}>
          GitHub
          <span className="sr-only"> {m.new_tab()}</span>
        </a>
      </div>
    </footer>
  )
}
