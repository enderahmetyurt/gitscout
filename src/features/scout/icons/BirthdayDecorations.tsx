import type { CSSProperties } from "react"

type BalloonProps = {
  /** `fill-*` sınıfı; kart indirilirken hesaplanmış renk kopyalansın diye sınıfla verilir. */
  fill: string
  width: number
  style: CSSProperties
}

function Balloon({ fill, width, style }: BalloonProps) {
  return (
    <svg
      viewBox="0 0 20 46"
      width={width}
      height={width * 2.3}
      className="card-float-in absolute"
      style={style}
    >
      <path
        d="M10 22c-2 5 2 8 0 13s2 8 0 11"
        className="fill-none stroke-current opacity-60"
        strokeWidth="1.2"
      />
      <ellipse cx="10" cy="10.5" rx="9" ry="10.5" className={fill} />
      <ellipse cx="6.5" cy="6.5" rx="2" ry="3.2" className="fill-white/45" />
      <path d="M8 20.5h4l-2 2.5Z" className={fill} />
    </svg>
  )
}

/**
 * Doğum günü kartının boş alanlarına serpiştirilen balonlar ve konfeti. Hepsi mutlak konumlu; avatar,
 * puan ve yazıların yeri değişmez. Konumlar satır içi stilde: kartın yüzde ölçülerine bağlı ve
 * indirilen görselde de aynı yerde kalmalı. Renkler `fill-*` sınıflarıyla verilir: kart görsel olarak
 * indirilirken hesaplanmış stiller kopyalanır.
 */
export function BirthdayDecorations() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* Avatarın iki yanında üç balon: solda iki, sağda bir. */}
      <Balloon
        fill="fill-verified"
        width={24}
        style={{ top: "38%", left: "4%", rotate: "-8deg", animationDelay: "250ms" }}
      />
      <Balloon
        fill="fill-chart-away"
        width={20}
        style={{ top: "50%", left: "14%", rotate: "7deg", animationDelay: "400ms" }}
      />
      <Balloon
        fill="fill-chart-home"
        width={24}
        style={{ top: "34%", right: "5%", rotate: "8deg", animationDelay: "320ms" }}
      />

      {/* Konfeti: üst ortada, puan ile etiketin arasında. */}
      <svg
        viewBox="0 0 80 24"
        width={64}
        height={19}
        className="absolute"
        style={{ top: "17%", left: "38%" }}
      >
        <rect
          x="6"
          y="6"
          width="5"
          height="3"
          rx="1"
          transform="rotate(25 8 7)"
          className="fill-verified"
        />
        <rect
          x="24"
          y="14"
          width="5"
          height="3"
          rx="1"
          transform="rotate(-30 26 15)"
          className="fill-github-star"
        />
        <circle cx="42" cy="6" r="2" className="fill-chart-away" />
        <rect
          x="56"
          y="12"
          width="5"
          height="3"
          rx="1"
          transform="rotate(40 58 13)"
          className="fill-chart-home"
        />
        <circle cx="72" cy="18" r="1.5" className="fill-verified" />
      </svg>
    </div>
  )
}
