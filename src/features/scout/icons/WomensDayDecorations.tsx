import type { CSSProperties } from "react"

type FlowerProps = { size: number; style: CSSProperties }

/** Beş yapraklı küçük çiçek. Renkler kartın kendi değişkenlerinden, satır içi stille gelir. */
function Flower({ size, style }: FlowerProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className="card-float-in absolute"
      style={style}
    >
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse
          key={angle}
          cx="12"
          cy="6.5"
          rx="4"
          ry="5.5"
          transform={`rotate(${angle} 12 12)`}
          style={{ fill: "var(--card-line)", opacity: 0.85 }}
        />
      ))}
      <circle cx="12" cy="12" r="3" style={{ fill: "var(--frame-1)" }} />
    </svg>
  )
}

/**
 * Kadınlar Günü kartının boş alanlarına serpiştirilen çiçekler. Avatar ve yazıların yeri değişmez;
 * doğum günü balonlarıyla aynı yerlerde ve aynı süzülme animasyonuyla gelir.
 */
export function WomensDayDecorations() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <Flower
        size={26}
        style={{ top: "40%", left: "4%", rotate: "-12deg", animationDelay: "250ms" }}
      />
      <Flower
        size={18}
        style={{ top: "53%", left: "15%", rotate: "20deg", animationDelay: "400ms" }}
      />
      <Flower
        size={22}
        style={{ top: "35%", right: "6%", rotate: "8deg", animationDelay: "320ms" }}
      />
      <Flower
        size={14}
        style={{ top: "18%", left: "44%", rotate: "30deg", animationDelay: "480ms" }}
      />
    </div>
  )
}
