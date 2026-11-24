import { siteConfig } from "@/config/site.config"

const linkClass =
  "rounded-sm text-foreground underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:px-6">
        <p>
          <a href="https://omergulcicek.com" target="_blank" rel="noreferrer" className={linkClass}>
            Ömer Gülçiçek
            <span className="sr-only"> (yeni sekmede açılır)</span>
          </a>{" "}
          tarafından yapıldı
        </p>
        <a href={siteConfig.links.github} target="_blank" rel="noreferrer" className={linkClass}>
          GitHub
          <span className="sr-only"> (yeni sekmede açılır)</span>
        </a>
      </div>
    </footer>
  )
}
