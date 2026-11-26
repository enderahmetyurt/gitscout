import type { CSSProperties } from "react"

const RAY_ANGLES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]

/** Havai fişek patlaması: merkezden dışa ışınlar ve uçlarında kıvılcımlar. */
function Firework({ size, color, style }: { size: number; color: string; style: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className="card-float-in absolute"
      style={style}
    >
      {RAY_ANGLES.map((angle) => (
        <g key={angle} transform={`rotate(${angle} 20 20)`}>
          <line
            x1="20"
            y1={angle % 60 === 0 ? 11 : 13}
            x2="20"
            y2={angle % 60 === 0 ? 3 : 7}
            strokeWidth="2"
            strokeLinecap="round"
            style={{ stroke: color }}
          />
          {angle % 60 === 0 ? <circle cx="20" cy="1.5" r="1.4" style={{ fill: color }} /> : null}
        </g>
      ))}
      <circle cx="20" cy="20" r="2" style={{ fill: color }} />
    </svg>
  )
}

/** Kardan adam: beyaz gövde kartın çizgi rengiyle çizilir, beyaz zeminde de seçilir. */
function Snowman({ size, style }: { size: number; style: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 32 44"
      width={size}
      height={size * 1.375}
      className="card-float-in absolute"
      style={style}
    >
      <circle
        cx="16"
        cy="32"
        r="10"
        fill="#fff"
        strokeWidth="1.5"
        style={{ stroke: "var(--card-snow)" }}
      />
      <circle
        cx="16"
        cy="16"
        r="7"
        fill="#fff"
        strokeWidth="1.5"
        style={{ stroke: "var(--card-snow)" }}
      />
      {/* Şapka başa oturur: kenarı başın tepesiyle (y=9) üst üste biner, aralarında boşluk kalmaz. */}
      <rect x="12" y="2" width="8" height="7.5" rx="1" style={{ fill: "var(--card-ink)" }} />
      <rect x="9.5" y="8.5" width="13" height="2.5" rx="1.2" style={{ fill: "var(--card-ink)" }} />
      <circle cx="13.5" cy="15" r="1" style={{ fill: "var(--card-ink)" }} />
      <circle cx="18.5" cy="15" r="1" style={{ fill: "var(--card-ink)" }} />
      <path d="M16 17l5 1.5-5 1Z" style={{ fill: "var(--chart-away)" }} />
      <path
        d="M9.5 21.5c4 2 9 2 13 0l.5 2.5c-1 .4-2 .7-3 .9l1 4.5-2.4.5-1-4.6c-2.9.2-5.7-.3-8.6-1.3Z"
        style={{ fill: "var(--destructive)" }}
      />
      <circle cx="16" cy="29" r="1.1" style={{ fill: "var(--card-ink)" }} />
      <circle cx="16" cy="34" r="1.1" style={{ fill: "var(--card-ink)" }} />
    </svg>
  )
}

/** Altı kollu kar tanesi. */
function Snowflake({ size, style }: { size: number; style: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className="card-float-in absolute"
      style={style}
    >
      {[0, 60, 120].map((angle) => (
        <g
          key={angle}
          transform={`rotate(${angle} 12 12)`}
          strokeWidth="1.6"
          strokeLinecap="round"
          style={{ stroke: "var(--card-snow)" }}
        >
          <line x1="12" y1="2" x2="12" y2="22" />
          <path d="M9.5 4.5 12 7l2.5-2.5M9.5 19.5 12 17l2.5 2.5" fill="none" />
        </g>
      ))}
    </svg>
  )
}

/** Altın: çerçeve ve avatar halkasıyla aynı şampanya tonu. */
const GOLD = "var(--frame-2)"
const BLUE = "var(--verified)"

/**
 * Yılbaşı kartının boş alanları: solda büyük bir kardan adam, sağda altın ve mavi havai fişekler, aralarda
 * kar taneleri. Yıl yazmaz, kart her yıl olduğu gibi kullanılır. Avatar ve yazıların yeri değişmez.
 */
export function NewYearDecorations() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* Sol: büyük kardan adam ve kar taneleri */}
      <Snowflake size={12} style={{ top: "28%", left: "17%", animationDelay: "520ms" }} />
      <Snowman
        size={46}
        style={{ top: "37%", left: "2%", rotate: "-5deg", animationDelay: "250ms" }}
      />
      <Snowflake size={15} style={{ top: "59%", left: "6%", animationDelay: "560ms" }} />
      {/* Sağ üst: etiketin hemen altında havai fişek */}
      <Snowflake size={10} style={{ top: "13%", right: "30%", animationDelay: "600ms" }} />
      <Firework
        size={32}
        color={GOLD}
        style={{ top: "11%", right: "5%", animationDelay: "300ms" }}
      />
      {/* Sağ: avatarın yanından adın hizasına */}
      <Firework
        size={36}
        color={BLUE}
        style={{ top: "30%", right: "2%", animationDelay: "380ms" }}
      />
      <Snowflake
        size={13}
        style={{ top: "45%", right: "6%", rotate: "20deg", animationDelay: "500ms" }}
      />
      <Firework
        size={26}
        color={GOLD}
        style={{ top: "53%", right: "4%", animationDelay: "460ms" }}
      />
      {/* Üst orta: puan ile etiketin arasında */}
      <Firework
        size={20}
        color={GOLD}
        style={{ top: "15%", left: "39%", animationDelay: "640ms" }}
      />
      <Snowflake size={9} style={{ top: "20%", left: "53%", animationDelay: "680ms" }} />
    </div>
  )
}
