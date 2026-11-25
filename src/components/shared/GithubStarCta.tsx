import { useQuery } from "@tanstack/react-query"
import { useHydrated } from "@tanstack/react-router"
import { Star } from "lucide-react"

import { siteConfig } from "@/config/site.config"

import { trackEvent } from "@/lib/analytics"
import { repoStarsQueryOptions } from "@/lib/repo-stars.queries"

import { buttonVariants } from "@/components/ui/button"
import * as m from "@/paraglide/messages.js"
import { getLocale } from "@/paraglide/runtime.js"

/** Kartın altındaki yıldız çağrısı: asıl eylemlerin yanında, sayaçla birlikte görünür buton. */
export function GithubStarCta() {
  const { data: stars } = useQuery(repoStarsQueryOptions())
  // Sayı sunucuda yok, istemcide önbellekten gelebilir; hidrasyondan sonra gösterilir ki HTML uyuşsun.
  const hydrated = useHydrated()

  return (
    <a
      href={siteConfig.links.github}
      target="_blank"
      rel="noreferrer"
      onClick={() => trackEvent({ name: "github_star_clicked", placement: "card" })}
      className={buttonVariants({ variant: "outline", className: "w-full max-w-80" })}
    >
      <Star aria-hidden className="fill-github-star text-github-star" />
      {m.github_star_button()}
      {hydrated && typeof stars === "number" ? (
        <span className="border-s ps-2 text-muted-foreground tabular-nums">
          {stars.toLocaleString(getLocale())}
        </span>
      ) : null}
      <span className="sr-only"> {m.new_tab()}</span>
    </a>
  )
}
