import { Star } from "lucide-react"
import { cn } from "cn"

import { siteConfig } from "@/config/site.config"

import { trackEvent } from "@/lib/analytics"

import * as m from "@/paraglide/messages.js"

type GithubStarLinkProps = {
  /** Metni ve analitikte tıklanan yerleşimi seçer. */
  placement: "hero" | "card"
  className?: string
}

/** Dillerde sözcük sırası farklı; yıldız ikonu cümlenin içinde, iki parçanın arasında durur. */
const TEXT = {
  hero: { before: m.github_star_hero_before, after: m.github_star_hero_after },
  card: { before: m.github_star_card_before, after: m.github_star_card_after }
} as const

/** Sayfa içindeki sakin "GitHub'da ⭐ ver" çağrısı; asıl eylemle yarışmasın diye soluk renkte. */
export function GithubStarLink({ placement, className }: GithubStarLinkProps) {
  const text = TEXT[placement]
  return (
    <a
      href={siteConfig.links.github}
      target="_blank"
      rel="noreferrer"
      onClick={() => trackEvent({ name: "github_star_clicked", placement })}
      className={cn(
        "inline-flex min-h-6 items-center gap-1 rounded-sm text-sm text-muted-foreground underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className
      )}
    >
      {text.before()}
      <span role="img" aria-label={m.github_star_word()} className="inline-flex">
        <Star aria-hidden className="size-3.5 fill-github-star text-github-star" />
      </span>
      {text.after()}
      <span className="sr-only"> {m.new_tab()}</span>
    </a>
  )
}
