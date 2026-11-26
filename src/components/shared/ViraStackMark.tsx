import { useId } from "react"

import { cn } from "cn"

/** ViraStack logosu (renkli simge); virastack.com marka dosyasından alındı. */
export function ViraStackMark({ className }: { className?: string }) {
  // Sayfada birden çok kez çizilirse gradyan ve filtre kimlikleri çakışmasın.
  const id = useId()
  const gradient = `${id}-g`
  const blur = `${id}-b`
  return (
    <svg viewBox="12 12 96 96" fill="none" aria-hidden className={cn("size-4 shrink-0", className)}>
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0b6b62" />
          <stop offset="1" stopColor="#00baa6" />
        </linearGradient>
        <filter id={blur} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.6" />
        </filter>
      </defs>
      <path
        d="M98 34 77.47 20 47 98h26Z"
        fill={`url(#${gradient})`}
        stroke={`url(#${gradient})`}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <g filter={`url(#${blur})`} opacity=".34">
        <path
          d="M22 34 42.53 20 73 98H47Z"
          fill="#000"
          stroke="#000"
          strokeWidth="5"
          strokeLinejoin="round"
          transform="translate(5 3)"
        />
      </g>
      <path
        d="M22 34 42.53 20 73 98H47Z"
        fill="#00baa6"
        stroke="#00baa6"
        strokeWidth="5"
        strokeLinejoin="round"
      />
    </svg>
  )
}
