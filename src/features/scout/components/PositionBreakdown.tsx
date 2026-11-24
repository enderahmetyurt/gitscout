import { cn } from "cn"

import { LanguageIcon } from "@/features/scout/components/LanguageIcon"
import type { ScoredPlayer } from "@/features/scout/types/player.types"

type PositionBreakdownProps = {
  position: ScoredPlayer["position"]
  breakdown: ScoredPlayer["positionBreakdown"]
}

const MAX_ROLES = 3
const MAX_LANGUAGES = 4
const percent = (share: number) => `%${Math.round(share * 100)}`

/** Mevkinin hangi alan ve dillerden çıktığını kısaca gösterir. */
export function PositionBreakdown({ position, breakdown }: PositionBreakdownProps) {
  const roles = breakdown.roles.filter((role) => role.share >= 0.01).slice(0, MAX_ROLES)
  const languages = breakdown.languages
    .filter((language) => language.share >= 0.01)
    .slice(0, MAX_LANGUAGES)

  return (
    <section className="surface flex flex-col gap-4 p-4" aria-labelledby="position-heading">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="position-heading" className="text-sm font-medium">
          Mevki: <span lang="en">{position}</span>
        </h2>
        <p className="text-xs text-muted-foreground">{breakdown.repoCount} repo</p>
      </div>

      {roles.length > 0 ? (
        <ul className="flex flex-col gap-2" aria-label="Alan payları">
          {roles.map((role, index) => (
            <li key={role.group} className="flex flex-col gap-1 text-xs">
              <div className="flex justify-between">
                <span lang="en">{role.group}</span>
                <span className="text-muted-foreground tabular-nums">{percent(role.share)}</span>
              </div>
              <span aria-hidden className="h-1.5 overflow-hidden rounded-full bg-muted">
                <span
                  className={cn(
                    "block h-full rounded-full",
                    index === 0 ? "bg-foreground" : "bg-muted-foreground/50"
                  )}
                  style={{ width: `${Math.round(role.share * 100)}%` }}
                />
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {languages.length > 0 ? (
        <ul className="flex flex-col gap-1.5 border-t pt-3" aria-label="En çok kullanılan diller">
          {languages.map((language) => {
            return (
              <li key={language.name} className="flex items-center gap-2 text-xs">
                <LanguageIcon name={language.name} />
                <span lang="en" className="min-w-0 flex-1 truncate font-medium">
                  {language.name}
                </span>
                <span className="text-muted-foreground tabular-nums">
                  {percent(language.share)} · {language.repos} repo
                </span>
              </li>
            )
          })}
        </ul>
      ) : null}

      {breakdown.pythonAsData ? (
        <p className="text-xs text-pretty text-muted-foreground">
          Notebook ve CUDA içeren repolar nedeniyle Python, Data sayıldı.
        </p>
      ) : null}
    </section>
  )
}
