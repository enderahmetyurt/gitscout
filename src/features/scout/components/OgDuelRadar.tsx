import { RADAR_ORDER } from "@/features/scout/constants/scoring.constants"
import { statShort } from "@/features/scout/helpers/player-text"
import type { ScoredPlayer } from "@/features/scout/types/player.types"

/** Sitedeki düello grafiğiyle aynı renkler, koyu zeminde okunsun diye bir ton açık. */
export const DUEL_HOME_COLOR = "#4f9be6"
export const DUEL_AWAY_COLOR = "#e09a3e"

const GRID_STEPS = [0.25, 0.5, 0.75, 1]
const LABEL_GAP = 20

type OgDuelRadarProps = { left: ScoredPlayer; right: ScoredPlayer; size: number }

/**
 * Link önizlemesindeki altıgen grafik. Satori SVG içindeki yazıyı çizemediği için etiketler
 * grafiğin üstüne mutlak konumlu kutular olarak yerleştirilir.
 */
export function OgDuelRadar({ left, right, size }: OgDuelRadarProps) {
  const center = size / 2
  const radius = center - LABEL_GAP - 14

  const point = (index: number, ratio: number) => {
    const angle = ((-90 + index * 60) * Math.PI) / 180
    return {
      x: center + Math.cos(angle) * radius * ratio,
      y: center + Math.sin(angle) * radius * ratio
    }
  }
  const polygon = (ratios: number[]) =>
    ratios
      .map((ratio, index) => {
        const { x, y } = point(index, ratio)
        return `${x.toFixed(1)},${y.toFixed(1)}`
      })
      .join(" ")
  const values = (player: ScoredPlayer) => RADAR_ORDER.map((key) => player.stats[key].value / 100)

  return (
    <div style={{ display: "flex", position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {GRID_STEPS.map((step) => (
          <polygon
            key={step}
            points={polygon(RADAR_ORDER.map(() => step))}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={1}
          />
        ))}
        {RADAR_ORDER.map((key, index) => {
          const end = point(index, 1)
          return (
            <line
              key={key}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth={1}
            />
          )
        })}
        <polygon
          points={polygon(values(left))}
          fill={DUEL_HOME_COLOR}
          fillOpacity={0.16}
          stroke={DUEL_HOME_COLOR}
          strokeWidth={3}
        />
        <polygon
          points={polygon(values(right))}
          fill={DUEL_AWAY_COLOR}
          fillOpacity={0.16}
          stroke={DUEL_AWAY_COLOR}
          strokeWidth={3}
        />
      </svg>
      {RADAR_ORDER.map((key, index) => {
        const angle = ((-90 + index * 60) * Math.PI) / 180
        const x = center + Math.cos(angle) * (radius + LABEL_GAP)
        const y = center + Math.sin(angle) * (radius + LABEL_GAP)
        return (
          <div
            key={key}
            style={{
              display: "flex",
              justifyContent: "center",
              position: "absolute",
              left: x - 30,
              top: y - 9,
              width: 60,
              fontSize: 14,
              fontWeight: 700,
              color: "#a3a3a3"
            }}
          >
            {statShort(key)}
          </div>
        )
      })}
    </div>
  )
}
