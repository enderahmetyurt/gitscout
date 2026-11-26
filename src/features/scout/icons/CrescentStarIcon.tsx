import { useId } from "react"
import type { ComponentProps } from "react"

const STAR_POINTS = "12,2 14.6,9 22,9.3 16.2,13.9 18.2,21 12,16.9 5.8,21 7.8,13.9 2,9.3 9.4,9"

/**
 * Ay yıldız. Hilal, büyük dairenin içinden kaydırılmış küçük dairenin maskeyle çıkarılmasıyla çizilir;
 * renk `currentColor`'dan gelir, böylece hem kart etiketinde hem süslerde kullanılır.
 */
export function CrescentStarIcon(props: ComponentProps<"svg">) {
  const maskId = useId()
  return (
    <svg viewBox="0 0 40 32" fill="currentColor" {...props}>
      <mask id={maskId}>
        <rect width="40" height="32" fill="white" />
        <circle cx="17" cy="16" r="10.5" fill="black" />
      </mask>
      <circle cx="14" cy="16" r="13" mask={`url(#${maskId})`} />
      <polygon points={STAR_POINTS} transform="translate(21 8) scale(0.7) rotate(-18 12 12)" />
    </svg>
  )
}
