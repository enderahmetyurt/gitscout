import { GitFork, Star } from "lucide-react"

import { LanguageIcon } from "@/features/scout/components/LanguageIcon"
import type { ScoredPlayer } from "@/features/scout/types/player.types"

type TopReposProps = {
  repos: ScoredPlayer["topRepos"]
}

const number = new Intl.NumberFormat("tr-TR", { notation: "compact", maximumFractionDigits: 1 })

/** En çok yıldız alan public repolar: kartın arkasındaki işleri gösterir. */
export function TopRepos({ repos }: TopReposProps) {
  return (
    <section className="surface flex flex-col overflow-hidden" aria-labelledby="repos-heading">
      <h2 id="repos-heading" className="px-4 pt-4 pb-2 text-sm font-medium">
        Öne çıkan repolar
      </h2>
      {repos.length === 0 ? (
        <p className="px-4 pb-4 text-sm text-muted-foreground">Henüz public repo yok.</p>
      ) : (
        <ul className="divide-y border-t">
          {repos.map((repo) => {
            const name = repo.fullName.split("/").at(-1) ?? repo.fullName
            return (
              <li key={repo.fullName}>
                <a
                  href={`https://github.com/${repo.fullName}`}
                  target="_blank"
                  rel="noreferrer"
                  title={repo.fullName}
                  className="flex flex-col gap-1.5 px-4 py-3 text-sm outline-none hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <LanguageIcon name={repo.language} />
                    <span lang="en" className="truncate font-medium">
                      <span aria-hidden className="text-muted-foreground">
                        /
                      </span>
                      {name}
                    </span>
                    {repo.isOrg ? (
                      <span className="shrink-0 rounded-sm bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                        katkı
                      </span>
                    ) : null}
                  </span>
                  <span className="flex items-center gap-3 text-xs text-muted-foreground tabular-nums">
                    <span className="flex items-center gap-1">
                      <Star aria-hidden className="size-3.5" />
                      <span className="sr-only">Yıldız:</span>
                      {number.format(repo.stars)}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork aria-hidden className="size-3.5" />
                      <span className="sr-only">Fork:</span>
                      {number.format(repo.forks)}
                    </span>
                  </span>
                  <span className="sr-only"> ({repo.fullName}, yeni sekmede açılır)</span>
                </a>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
