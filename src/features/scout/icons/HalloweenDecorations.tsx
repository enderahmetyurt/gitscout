import type { CSSProperties } from "react"

function Pumpkin({ size, style }: { size: number; style: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 32 30"
      width={size}
      height={size * 0.94}
      className="card-float-in absolute"
      style={style}
    >
      <path
        d="M15 6c0-3 1-5 4-5"
        className="fill-none stroke-success"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <ellipse cx="9" cy="18" rx="8" ry="10" style={{ fill: "var(--card-line)" }} />
      <ellipse cx="23" cy="18" rx="8" ry="10" style={{ fill: "var(--card-line)" }} />
      <ellipse cx="16" cy="18" rx="8" ry="11" style={{ fill: "var(--card-accent)" }} />
      <path d="M10 15l3 3h-4Zm12 0l1 3h-4Z" style={{ fill: "var(--bg-2)" }} />
      <path d="M10 22c2 3 10 3 12 0l-2 1-2-1-2 1-2-1-2 1Z" style={{ fill: "var(--bg-2)" }} />
    </svg>
  )
}

function Bat({ size, style }: { size: number; style: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 40 18"
      width={size}
      height={size * 0.45}
      className="card-float-in absolute"
      style={style}
    >
      <path
        d="M20 6c1-3 2-4 2-4l1 3c3-2 7-3 10-2-2 1-3 3-3 5 3-1 6 0 9 2-4 0-7 1-9 4-2-1-4-1-6 0-1 1-2 3-4 4-2-1-3-3-4-4-2-1-4-1-6 0-2-3-5-4-9-4 3-2 6-3 9-2 0-2-1-4-3-5 3-1 7 0 10 2l1-3s1 1 2 4Z"
        style={{ fill: "var(--card-muted)" }}
      />
    </svg>
  )
}

function GhostShape({ size, style }: { size: number; style: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 24 28"
      width={size}
      height={size * 1.17}
      className="card-float-in absolute"
      style={style}
    >
      <path
        d="M12 1C6 1 3 6 3 11v15l3-2 3 2 3-2 3 2 3-2 3 2V11c0-5-3-10-9-10Z"
        style={{ fill: "var(--card-ink)", opacity: 0.9 }}
      />
      <circle cx="9" cy="11" r="1.6" style={{ fill: "var(--bg-2)" }} />
      <circle cx="15" cy="11" r="1.6" style={{ fill: "var(--bg-2)" }} />
    </svg>
  )
}

/**
 * Cadılar Bayramı kartının boş alanlarına serpiştirilen balkabağı, yarasalar ve küçük bir hayalet.
 * Avatar ve yazıların yeri değişmez; diğer özel günlerin süsleriyle aynı yerlerde ve aynı süzülmeyle gelir.
 */
export function HalloweenDecorations() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* Sol: bayrağın altından adın hizasına */}
      <GhostShape
        size={20}
        style={{ top: "33%", left: "5%", rotate: "-8deg", animationDelay: "400ms" }}
      />
      <Pumpkin
        size={32}
        style={{ top: "47%", left: "3%", rotate: "-6deg", animationDelay: "250ms" }}
      />
      <Bat size={18} style={{ top: "59%", left: "5%", rotate: "8deg", animationDelay: "540ms" }} />
      {/* Sağ üst: etiketin hemen altı */}
      <Bat
        size={22}
        style={{ top: "12%", right: "26%", rotate: "-10deg", animationDelay: "600ms" }}
      />
      <Pumpkin
        size={24}
        style={{ top: "13%", right: "5%", rotate: "8deg", animationDelay: "300ms" }}
      />
      <GhostShape
        size={16}
        style={{ top: "20%", right: "20%", rotate: "10deg", animationDelay: "560ms" }}
      />
      {/* Sağ: avatarın yanından adın hizasına */}
      <Bat
        size={28}
        style={{ top: "27%", right: "4%", rotate: "10deg", animationDelay: "340ms" }}
      />
      <Pumpkin
        size={30}
        style={{ top: "37%", right: "3%", rotate: "7deg", animationDelay: "440ms" }}
      />
      <Bat
        size={16}
        style={{ top: "50%", right: "6%", rotate: "-8deg", animationDelay: "500ms" }}
      />
      <Pumpkin
        size={20}
        style={{ top: "57%", right: "4%", rotate: "-6deg", animationDelay: "580ms" }}
      />
      {/* Üst orta: puan ile etiketin arasında */}
      <Pumpkin size={16} style={{ top: "17%", left: "40%", animationDelay: "620ms" }} />
    </div>
  )
}
