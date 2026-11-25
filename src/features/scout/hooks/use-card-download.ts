import { useRef, useState } from "react"

import { toCanvas } from "html-to-image"

const PIXEL_RATIO = 2
const SITE = "gitscout.io"

/**
 * Rozetler sayfada açıklamalarıyla anlamlı, indirilen görselde ise ne oldukları anlaşılmıyor.
 * Bu yüzden görselde rozetler çıkarılır, yerlerine kulüp adıyla aynı satıra site adresi yazılır;
 * paylaşılan kart ek bir çerçeveye gerek kalmadan nereden geldiğini söyler.
 */
async function renderShareImage(node: HTMLElement): Promise<string> {
  const canvas = await toCanvas(node, {
    pixelRatio: PIXEL_RATIO,
    cacheBust: true,
    filter: (child) => !(child instanceof HTMLElement && child.hasAttribute("data-card-badges"))
  })
  const context = canvas.getContext("2d")
  if (!context) throw new Error("Tuval açılamadı")

  const club = node.querySelector<HTMLElement>("[data-card-club]")
  const row = club?.parentElement
  if (club && row) {
    // Ölçüler ekrandaki karttan alınır ve tuvale oranlanır; küçük ekranlardaki `zoom` da böylece hesaba katılır.
    const cardRect = node.getBoundingClientRect()
    const rowRect = row.getBoundingClientRect()
    const clubRect = club.getBoundingClientRect()
    const scale = canvas.width / cardRect.width
    const style = getComputedStyle(club)

    context.font = `${style.fontWeight} ${parseFloat(style.fontSize) * scale}px ${style.fontFamily}`
    context.fillStyle = style.color
    context.textAlign = "right"
    context.textBaseline = "middle"
    context.fillText(
      SITE,
      (rowRect.right - cardRect.left) * scale,
      (clubRect.top + clubRect.height / 2 - cardRect.top) * scale
    )
  }

  return canvas.toDataURL("image/png")
}

/** Kartı paylaşılabilir bir PNG olarak indirir. */
export function useCardDownload(fileName: string) {
  const cardRef = useRef<HTMLElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const download = async () => {
    const node = cardRef.current
    if (!node) return
    setIsDownloading(true)
    try {
      const dataUrl = await renderShareImage(node)
      const link = document.createElement("a")
      link.href = dataUrl
      link.download = `${fileName}.png`
      link.click()
    } catch (error) {
      throw new Error("Kart görseli oluşturulamadı", { cause: error })
    } finally {
      setIsDownloading(false)
    }
  }

  return { cardRef, download, isDownloading }
}
