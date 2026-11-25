import { Star } from "lucide-react"

import * as m from "@/paraglide/messages.js"

/** GitHub Stars programındaki geliştiricinin adının yanında duran dolu, renkli yıldız. */
export function GithubStarIcon() {
  const label = m.github_star()
  return (
    <span role="img" aria-label={label} title={label} className="inline-flex shrink-0">
      <Star aria-hidden className="size-3.5 fill-github-star text-github-star" />
    </span>
  )
}
