import { useRef, useState } from "react"

import { toBlob } from "html-to-image"

/** Görselde istenmeyen öğeler (ör. düğmeler) bu işaretle dışarıda kalır. */
const EXCLUDE_ATTRIBUTE = "data-export-hidden"

/** Görselin alt boşluğu: dışarıda bırakılan öğelerden sonra kalan son içerikten itibaren. */
const BOTTOM_PADDING = 32

/**
 * Dışarıda bırakılan öğeler (düğmeler) çıkarılınca içeriğin yüksekliği. Ekrandaki konuma değil
 * yerleşim yüksekliğine bakılır; kaydırma ve yapışık kartlar sonucu değiştirmez.
 */
function contentHeight(node: HTMLElement): number {
  let height = node.offsetHeight - parseFloat(getComputedStyle(node).paddingBottom) + BOTTOM_PADDING
  for (const excluded of node.querySelectorAll<HTMLElement>(`[${EXCLUDE_ATTRIBUTE}]`)) {
    const parent = excluded.parentElement
    const gap = parent ? parseFloat(getComputedStyle(parent).rowGap) || 0 : 0
    height -= excluded.offsetHeight + gap
  }
  return Math.ceil(height)
}

/**
 * Bir DOM alanını PNG olarak panoya kopyalar; pano izni yoksa dosya olarak indirir. Arka plan sayfanın zemin rengiyle doldurulur,
 * yoksa görsel şeffaf olur ve yapıştırılan yerde okunmaz.
 */
export function useImageCopy(fileName: string) {
  const ref = useRef<HTMLElement>(null)
  const [isCopying, setIsCopying] = useState(false)

  const copy = async (): Promise<"copied" | "downloaded" | "skipped"> => {
    const node = ref.current
    if (!node) return "skipped"
    setIsCopying(true)
    try {
      const blob = toBlob(node, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: getComputedStyle(document.body).backgroundColor,
        width: node.offsetWidth,
        height: contentHeight(node),
        // Alan sayfada `mx-auto` ile ortalanıyor; kopyada bu boşluk içeriği sağa iter ve keser.
        style: { margin: "0" },
        filter: (child) => !(child instanceof HTMLElement && child.hasAttribute(EXCLUDE_ATTRIBUTE))
      }).then((result) => {
        if (!result) throw new Error("Görsel oluşturulamadı")
        return result
      })
      try {
        // Safari panoya yazmayı kullanıcı etkileşimi sırasında başlatmayı ister; Promise doğrudan verilir.
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
        return "copied"
      } catch {
        // Pano izni olmayan tarayıcılarda görsel kaybolmasın: dosya olarak indirilir.
        const url = URL.createObjectURL(await blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `${fileName}.png`
        link.click()
        URL.revokeObjectURL(url)
        return "downloaded"
      }
    } finally {
      setIsCopying(false)
    }
  }

  return { ref, copy, isCopying, excludeProps: { [EXCLUDE_ATTRIBUTE]: "" } }
}
