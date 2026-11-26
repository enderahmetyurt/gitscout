import type { CSSProperties } from "react"

type GlyphProps = { text: string; size: number; style: CSSProperties }

/** Kodu andıran küçük bir işaret; kartın yazı tipiyle (mono) ve vurgu rengiyle yazılır. */
function Glyph({ text, size, style }: GlyphProps) {
  return (
    <span
      className="card-float-in absolute font-bold whitespace-nowrap"
      style={{ fontSize: size, color: "var(--card-accent)", opacity: 0.75, ...style }}
    >
      {text}
    </span>
  )
}

/**
 * Programcılar Günü kartının boş alanlarına serpiştirilen kod işaretleri. Avatar ve yazıların yeri
 * değişmez; doğum günü balonlarıyla aynı yerlerde ve aynı süzülme animasyonuyla gelir.
 */
export function ProgrammersDayDecorations() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <Glyph
        text="</>"
        size={15}
        style={{ top: "40%", left: "4%", rotate: "-8deg", animationDelay: "250ms" }}
      />
      <Glyph
        text="{ }"
        size={12}
        style={{ top: "53%", left: "11%", rotate: "6deg", animationDelay: "400ms" }}
      />
      <Glyph
        text="256"
        size={13}
        style={{ top: "34%", right: "5%", rotate: "8deg", animationDelay: "320ms" }}
      />
      <Glyph text=";" size={16} style={{ top: "48%", right: "13%", animationDelay: "460ms" }} />
      <Glyph text="0x100" size={10} style={{ top: "18%", left: "40%", animationDelay: "520ms" }} />
    </div>
  )
}
