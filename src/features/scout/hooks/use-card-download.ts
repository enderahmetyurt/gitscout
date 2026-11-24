import { useRef, useState } from "react"

import { toPng } from "html-to-image"

/** Kart DOM'unu PNG'ye çevirip indirir. Avatar CORS'a izin verdiği için tuvale çizilebilir. */
export function useCardDownload(fileName: string) {
  const cardRef = useRef<HTMLElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const download = async () => {
    const node = cardRef.current
    if (!node) return
    setIsDownloading(true)
    try {
      const dataUrl = await toPng(node, { pixelRatio: 2, cacheBust: true })
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
