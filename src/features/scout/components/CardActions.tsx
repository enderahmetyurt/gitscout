import { Link } from "@tanstack/react-router"
import { Download, Share2, Swords } from "lucide-react"
import { toast } from "sonner"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { SHARE_TARGETS } from "@/features/scout/constants/share.constants"
import type { ScoredPlayer } from "@/features/scout/types/player.types"

type CardActionsProps = {
  player: ScoredPlayer
  onDownload: () => Promise<void>
  isDownloading: boolean
}

export function CardActions({ player, onDownload, isDownloading }: CardActionsProps) {
  const shareText = `Gitscout kartım: ${player.ovr} genel, ${player.position}. "${player.title}"`

  const handleDownload = () => {
    onDownload().catch((error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Kart indirilemedi")
    })
  }

  const handleShare = (buildUrl: (pageUrl: string, text: string) => string) => {
    window.open(buildUrl(window.location.href, shareText), "_blank", "noopener,noreferrer")
  }

  return (
    <div className="flex gap-2">
      <Button variant="default" size="sm" onClick={handleDownload} disabled={isDownloading}>
        <Download aria-hidden />
        {isDownloading ? "Hazırlanıyor…" : "İndir"}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger className={buttonVariants({ variant: "outline", size: "sm" })}>
          <Share2 aria-hidden />
          Paylaş
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          {SHARE_TARGETS.map((target) => (
            <DropdownMenuItem key={target.id} onClick={() => handleShare(target.buildUrl)}>
              {target.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Link
        to="/vs"
        search={{ left: player.login }}
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        <Swords aria-hidden />
        Kapıştır
      </Link>
    </div>
  )
}
