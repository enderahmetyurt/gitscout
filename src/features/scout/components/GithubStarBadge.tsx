import { ArrowUpRight, Star } from "lucide-react"

import { githubStarProfileUrl } from "@/features/scout/helpers/github-star"
import * as m from "@/paraglide/messages.js"

type GithubStarBadgeProps = {
  login: string
}

/** Detay sayfasında GitHub Stars programındaki kişiyi belirtir; programdaki profile bağlanır, böylece doğrulanabilir. */
export function GithubStarBadge({ login }: GithubStarBadgeProps) {
  return (
    <a
      href={githubStarProfileUrl(login)}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-7 items-center gap-1.5 rounded-full border px-3 text-xs font-medium text-foreground outline-none hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <Star aria-hidden className="size-3.5 fill-github-star text-github-star" />
      {m.github_star()}
      <ArrowUpRight aria-hidden className="size-3.5 text-muted-foreground" />
      <span className="sr-only"> {m.new_tab()}</span>
    </a>
  )
}
