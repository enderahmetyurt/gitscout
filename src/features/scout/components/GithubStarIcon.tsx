import { Star } from "lucide-react"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import * as m from "@/paraglide/messages.js"

/**
 * GitHub Stars programındaki geliştiricinin adının yanında duran dolu, renkli yıldız.
 * Listede satırın tamamı bağlantı olduğu için tetikleyici `z-10` ile üste çıkar; üzerine gelince adı yazar.
 */
export function GithubStarIcon() {
  const label = m.github_star()
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span role="img" aria-label={label} className="relative z-10 inline-flex shrink-0" />
        }
      >
        <Star aria-hidden className="size-3.5 fill-github-star text-github-star" />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
