import type { CSSProperties } from "react"

import { CrescentStarIcon } from "@/features/scout/icons/CrescentStarIcon"

const STAR_POINTS = "12,2 14.6,9 22,9.3 16.2,13.9 18.2,21 12,16.9 5.8,21 7.8,13.9 2,9.3 9.4,9"

function CrescentStar({ size, style }: { size: number; style: CSSProperties }) {
  return (
    <CrescentStarIcon
      width={size}
      height={size * 0.8}
      className="card-float-in absolute"
      style={{ color: "var(--card-accent)", ...style }}
    />
  )
}

function Star({ size, style }: { size: number; style: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className="card-float-in absolute"
      style={style}
    >
      <polygon points={STAR_POINTS} style={{ fill: "var(--card-accent)", opacity: 0.85 }} />
    </svg>
  )
}

/**
 * Cumhuriyet Bayramı kartının boş alanlarına iki yana dengeli serpiştirilen ay yıldızlar ve yıldızlar.
 * Avatar ve yazıların yeri değişmez; diğer özel günlerin süsleriyle aynı süzülmeyle gelir.
 */
export function RepublicDayDecorations() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* Sol: puanın altından adın hizasına (bayrak bu kartta gösterilmez, yeri boş) */}
      <Star
        size={12}
        style={{ top: "22%", left: "5%", rotate: "-8deg", animationDelay: "460ms" }}
      />
      <Star size={9} style={{ top: "28%", left: "18%", animationDelay: "520ms" }} />
      <CrescentStar
        size={38}
        style={{ top: "35%", left: "3%", rotate: "-10deg", animationDelay: "250ms" }}
      />
      <Star
        size={14}
        style={{ top: "50%", left: "6%", rotate: "-12deg", animationDelay: "400ms" }}
      />
      <CrescentStar
        size={20}
        style={{ top: "58%", left: "3%", rotate: "6deg", animationDelay: "540ms" }}
      />
      {/* Sağ üst: etiketin hemen altı */}
      <Star size={10} style={{ top: "12%", right: "30%", animationDelay: "600ms" }} />
      <CrescentStar
        size={24}
        style={{ top: "13%", right: "6%", rotate: "10deg", animationDelay: "300ms" }}
      />
      <Star
        size={13}
        style={{ top: "19%", right: "22%", rotate: "14deg", animationDelay: "560ms" }}
      />
      {/* Sağ: avatarın yanından adın hizasına */}
      <CrescentStar
        size={30}
        style={{ top: "26%", right: "4%", rotate: "8deg", animationDelay: "340ms" }}
      />
      <Star size={12} style={{ top: "38%", right: "5%", animationDelay: "500ms" }} />
      <CrescentStar
        size={26}
        style={{ top: "47%", right: "3%", rotate: "-6deg", animationDelay: "440ms" }}
      />
      <Star
        size={10}
        style={{ top: "59%", right: "6%", rotate: "14deg", animationDelay: "580ms" }}
      />
      {/* Üst orta: puan ile etiketin arasında */}
      <Star size={9} style={{ top: "17%", left: "38%", animationDelay: "620ms" }} />
      <CrescentStar size={16} style={{ top: "16.5%", left: "47%", animationDelay: "640ms" }} />
    </div>
  )
}
