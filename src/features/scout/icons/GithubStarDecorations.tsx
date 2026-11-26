import type { CSSProperties } from "react"

const STAR_POINTS = "12,2 14.6,9 22,9.3 16.2,13.9 18.2,21 12,16.9 5.8,21 7.8,13.9 2,9.3 9.4,9"

/** Holografik paletin yıldız renkleri: lavanta (kartın vurgusu), beyaz, camgöbeği ve pembe. */
const TONES = {
  accent: "var(--card-accent)",
  white: "#ffffff",
  cyan: "#7ee8fa",
  pink: "#ff9ad5"
} as const

type Tone = keyof typeof TONES

type StarSpec = {
  size: number
  top: string
  left?: string
  right?: string
  tone: Tone
  rotate?: number
  delay: number
  /** Arka plandaki soluk yıldız; derinlik verir. */
  faint?: boolean
}

/**
 * Yıldızların yeri: avatarın iki yanı, puan ile etiketin arası ve üst köşeler. Ad, slogan ve
 * istatistiklerin arkasına düşmez (kartın üst %60'ında kalır).
 */
const STARS: readonly StarSpec[] = [
  // Sol şerit
  { size: 20, top: "31%", left: "4%", tone: "accent", rotate: -12, delay: 260 },
  { size: 8, top: "28%", left: "16%", tone: "white", delay: 520, faint: true },
  { size: 12, top: "40%", left: "13%", tone: "cyan", rotate: 8, delay: 380 },
  { size: 7, top: "46%", left: "4%", tone: "pink", delay: 600, faint: true },
  { size: 15, top: "52%", left: "6%", tone: "white", rotate: -6, delay: 440 },
  { size: 6, top: "58%", left: "15%", tone: "accent", delay: 680, faint: true },
  // Sağ şerit
  { size: 9, top: "15%", right: "27%", tone: "white", delay: 560, faint: true },
  { size: 24, top: "24%", right: "4%", tone: "accent", rotate: 14, delay: 300 },
  { size: 8, top: "22%", right: "17%", tone: "pink", delay: 640 },
  { size: 11, top: "36%", right: "14%", tone: "cyan", rotate: -10, delay: 420 },
  { size: 7, top: "43%", right: "4%", tone: "white", delay: 700, faint: true },
  { size: 16, top: "49%", right: "6%", tone: "pink", rotate: 10, delay: 360 },
  { size: 6, top: "58%", right: "16%", tone: "accent", delay: 720, faint: true },
  // Üst orta: puan ile etiketin arası
  { size: 10, top: "8%", left: "40%", tone: "cyan", delay: 480 },
  { size: 6, top: "15%", left: "47%", tone: "white", delay: 660, faint: true },
  { size: 8, top: "19%", left: "36%", tone: "pink", delay: 580, faint: true },
  { size: 13, top: "13%", left: "55%", tone: "accent", rotate: 18, delay: 400 },
  // Avatarın üst köşeleri
  { size: 7, top: "24%", left: "27%", tone: "white", delay: 740, faint: true },
  { size: 9, top: "25%", right: "28%", tone: "cyan", delay: 760, faint: true }
]

function Star({ spec }: { spec: StarSpec }) {
  const style: CSSProperties = {
    top: spec.top,
    left: spec.left,
    right: spec.right,
    rotate: spec.rotate ? `${spec.rotate}deg` : undefined,
    animationDelay: `${spec.delay}ms`
  }
  return (
    <svg
      viewBox="0 0 24 24"
      width={spec.size}
      height={spec.size}
      className="card-float-in absolute"
      style={style}
    >
      <polygon
        points={STAR_POINTS}
        style={{ fill: TONES[spec.tone], opacity: spec.faint ? 0.5 : 0.95 }}
      />
    </svg>
  )
}

/**
 * GitHub Star kartının yıldız gökyüzü: farklı boy ve renkte, bir kısmı soluk yıldızlar avatarın
 * çevresine dağılır. Diğer özel kartların süsleriyle aynı süzülmeyle gelir.
 */
export function GithubStarDecorations() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {STARS.map((spec) => (
        <Star key={`${spec.top}-${spec.left ?? spec.right}`} spec={spec} />
      ))}
    </div>
  )
}
