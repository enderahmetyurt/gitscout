import { useQuery } from "@tanstack/react-query"
import { Star } from "lucide-react"
import { cn } from "cn"

import { siteConfig } from "@/config/site.config"

import { trackEvent } from "@/lib/analytics"
import { repoStarsQueryOptions } from "@/lib/repo-stars.queries"

import { GithubMark } from "@/components/shared/GithubMark"
import * as m from "@/paraglide/messages.js"
import { getLocale } from "@/paraglide/runtime.js"

/** Başlıktaki GitHub butonu; yıldız sayısı gelince yanında görünür. */
export function GithubStarButton() {
  const { data: stars } = useQuery(repoStarsQueryOptions())
  const hasStars = typeof stars === "number"

  return (
    <a
      href={siteConfig.links.github}
      target="_blank"
      rel="noreferrer"
      onClick={() => trackEvent({ name: "github_star_clicked", placement: "header" })}
      className="inline-flex h-7 items-center gap-1.5 rounded-md border px-1.5 text-sm text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:px-2"
    >
      <GithubMark />
      <span className="sr-only">{m.github_star_button()}</span>
      <Star aria-hidden className="size-3.5 fill-github-star text-github-star max-sm:hidden" />
      {/* Sayı gelmeden de yer ayrılır ("00" görünmez yer tutucu); gelince başlık kaymaz. */}
      <span
        aria-hidden
        className={cn("min-w-[2ch] tabular-nums max-sm:hidden", !hasStars && "invisible")}
      >
        {hasStars ? stars.toLocaleString(getLocale()) : "00"}
      </span>
      {hasStars ? <span className="sr-only">, {m.github_star_count({ count: stars })}</span> : null}
      <span className="sr-only"> {m.new_tab()}</span>
    </a>
  )
}
