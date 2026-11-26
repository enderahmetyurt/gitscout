import type { Ref } from "react"

import { Copy, Download } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { PlayerCard } from "@/features/scout/components/PlayerCard"
import { BIRTHDAY_OVR } from "@/features/scout/helpers/birthday"
import { useCardDownload } from "@/features/scout/hooks/use-card-download"
import type { CardOccasion } from "@/features/scout/types/card-preview.types"
import type { ListPlayer } from "@/features/scout/types/player.types"
import * as m from "@/paraglide/messages.js"

type SampleCardProps = {
  player: ListPlayer
  occasion: CardOccasion
  cardRef: Ref<HTMLElement>
}

function SampleCard({ player, occasion, cardRef }: SampleCardProps) {
  if (occasion === "birthday") {
    return (
      <PlayerCard
        player={{ ...player, ovr: BIRTHDAY_OVR, ovrExact: BIRTHDAY_OVR, rarity: "icon" }}
        occasion="birthday"
        ref={cardRef}
      />
    )
  }
  return <PlayerCard player={player} occasion={occasion} ref={cardRef} />
}

/** Örnek kart ve altında indir / kopyala; görsel, profil sayfasındaki indirmeyle aynı biçimde üretilir. */
export function SampleCardWithActions({
  player,
  occasion,
  title
}: {
  player: ListPlayer
  occasion: CardOccasion
  /** Kartın adı; altı kartta aynı adlı butonlar ekran okuyucuda ayırt edilsin diye etikete eklenir. */
  title: string
}) {
  const { cardRef, download, isDownloading, copy, isCopying } = useCardDownload(
    `gitscout-${player.login}-${occasion}`
  )

  const handleDownload = () => {
    download().catch(() => toast.error(m.download_failed()))
  }
  const handleCopy = () => {
    copy()
      .then((result) => {
        if (result === "copied") toast.success(m.card_copied())
      })
      .catch(() => toast.error(m.card_copy_failed()))
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div data-rarity={occasion === "birthday" ? "icon" : player.rarity} className="relative">
        <div aria-hidden className="scout-card-glow pointer-events-none absolute -inset-8" />
        <div className="card-lift relative">
          <SampleCard player={player} occasion={occasion} cardRef={cardRef} />
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleDownload}
          disabled={isDownloading}
          aria-label={`${m.download()}: ${title}`}
        >
          <Download aria-hidden />
          {isDownloading ? m.download_preparing() : m.download()}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCopy}
          disabled={isCopying}
          aria-label={`${m.copy_card()}: ${title}`}
        >
          <Copy aria-hidden />
          {m.copy_card()}
        </Button>
      </div>
    </div>
  )
}
