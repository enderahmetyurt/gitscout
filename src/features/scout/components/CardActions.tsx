import { Link } from "@tanstack/react-router"
import { Download, Share2, Swords } from "lucide-react"
import { toast } from "sonner"

import { getLangParam } from "@/helpers/localized-url"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { SHARE_TARGETS } from "@/features/scout/constants/share.constants"
import { titleText } from "@/features/scout/helpers/player-text"
import type { ScoredPlayer } from "@/features/scout/types/player.types"
import * as m from "@/paraglide/messages.js"

type CardActionsProps = {
  player: ScoredPlayer
  onDownload: () => Promise<void>
  isDownloading: boolean
}

export function CardActions({ player, onDownload, isDownloading }: CardActionsProps) {
  const handleDownload = () => {
    onDownload().catch(() => {
      toast.error(m.download_failed())
    })
  }

  const handleShare = (buildUrl: (pageUrl: string, text: string) => string) => {
    const text = m.share_text({
      ovr: player.ovr,
      position: player.position,
      title: titleText(player.title)
    })
    window.open(buildUrl(window.location.href, text), "_blank", "noopener,noreferrer")
  }

  return (
    <div className="flex gap-2">
      <Button variant="default" size="sm" onClick={handleDownload} disabled={isDownloading}>
        <Download aria-hidden />
        {isDownloading ? m.download_preparing() : m.download()}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger className={buttonVariants({ variant: "outline", size: "sm" })}>
          <Share2 aria-hidden />
          {m.share()}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="overscroll-contain">
          {SHARE_TARGETS.map((target) => (
            <DropdownMenuItem key={target.id} onClick={() => handleShare(target.buildUrl)}>
              {target.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Link
        to="/{-$lang}/vs"
        params={{ lang: getLangParam() }}
        search={{ left: player.login }}
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        <Swords aria-hidden />
        {m.duel_button()}
      </Link>
    </div>
  )
}
