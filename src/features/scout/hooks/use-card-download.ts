import { useRef, useState } from "react"

import { toCanvas } from "html-to-image"

const PIXEL_RATIO = 2
/** Kartın etrafındaki koyu zemin ve altındaki adres şeridi (CSS piksel). */
const PADDING = 24
const FOOTER = 36
const BACKGROUND = "#0a0a0a"
const SITE = "gitscout.io"

/**
 * Kartı koyu bir zemine yerleştirip altına site adresini yazar; paylaşılan görsel nereden geldiğini söyler.
 * Kart DOM'u tuvale çizilir (avatar CORS'a izin verdiği için mümkün), sonra çerçeveli görsele aktarılır.
 */
async function renderShareImage(node: HTMLElement): Promise<string> {
  const card = await toCanvas(node, { pixelRatio: PIXEL_RATIO, cacheBust: true })
  const pad = PADDING * PIXEL_RATIO
  const footer = FOOTER * PIXEL_RATIO
  const canvas = document.createElement("canvas")
  canvas.width = card.width + pad * 2
  canvas.height = card.height + pad * 2 + footer
  const context = canvas.getContext("2d")
  if (!context) throw new Error("Tuval açılamadı")

  context.fillStyle = BACKGROUND
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.drawImage(card, pad, pad)

  const fontFamily = getComputedStyle(document.body).fontFamily
  context.font = `600 ${15 * PIXEL_RATIO}px ${fontFamily}`
  context.fillStyle = "#a3a3a3"
  context.textAlign = "center"
  context.textBaseline = "middle"
  context.fillText(SITE, canvas.width / 2, pad + card.height + footer / 2 + pad / 4)

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
