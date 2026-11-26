import { STAT_ORDER } from "@/features/scout/constants/scoring.constants"
import { rarityLabel, statShort, titleText } from "@/features/scout/helpers/player-text"
import { statTier } from "@/features/scout/helpers/stat-tier"
import type { Rarity, ScoredPlayer } from "@/features/scout/types/player.types"

/**
 * Link önizlemelerindeki oyuncu kartı (300×450). Oyuncu ve düello görselleri ortak kullanır.
 * Satori ile çizilir: yalnızca flex düzen ve satır içi stil desteklenir.
 */

export const RARITY_COLORS: Record<
  Rarity,
  { frame: [string, string]; face: [string, string]; ink: string; muted: string }
> = {
  icon: {
    frame: ["#f6dc8c", "#a8832a"],
    face: ["#26242b", "#060607"],
    ink: "#f7f1e1",
    muted: "rgba(247,241,225,0.7)"
  },
  gold: {
    frame: ["#fff1b3", "#b0820f"],
    face: ["#fde68a", "#e6b843"],
    ink: "#2e2100",
    muted: "rgba(46,33,0,0.74)"
  },
  silver: {
    frame: ["#f4f6f9", "#7f8996"],
    face: ["#f1f4f7", "#c2c9d2"],
    ink: "#161b22",
    muted: "rgba(22,27,34,0.72)"
  },
  bronze: {
    frame: ["#f7d6b5", "#8f5428"],
    face: ["#f6d5b3", "#e3b68c"],
    ink: "#2b1406",
    muted: "rgba(43,20,6,0.74)"
  }
}

/** Kart üzerindeki istatistik renkleri: koyu (ikon) ve metal zemin için ayrı tonlar. */
const TIER_ON_DARK = {
  elite: "#4ade80",
  great: "#a3e635",
  good: "#facc15",
  fair: "#fb923c",
  poor: "#f87171"
}
const TIER_ON_METAL = {
  elite: "#14532d",
  great: "#365314",
  good: "#713f12",
  fair: "#7c2d12",
  poor: "#7f1d1d"
}

type OgPlayerCardProps = { player: ScoredPlayer; avatar: string | null }

export function OgPlayerCard({ player, avatar }: OgPlayerCardProps) {
  const colors = RARITY_COLORS[player.rarity]
  const tierColors = player.rarity === "icon" ? TIER_ON_DARK : TIER_ON_METAL

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 300,
        height: 450,
        flexShrink: 0,
        padding: 8,
        borderRadius: 26,
        backgroundImage: `linear-gradient(145deg, ${colors.frame[0]}, ${colors.frame[1]})`
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflow: "visible",
          borderRadius: 19,
          padding: "20px 20px 16px",
          color: colors.ink,
          backgroundImage: `linear-gradient(135deg, ${colors.face[0]}, ${colors.face[1]})`
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 0.9, letterSpacing: -2 }}>
              {String(player.ovr)}
            </div>
            <div style={{ marginTop: 8, fontSize: 12, fontWeight: 700, letterSpacing: 2 }}>
              {player.position.toUpperCase()}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1,
              padding: "4px 10px",
              borderRadius: 99,
              border: `1px solid ${colors.muted}`
            }}
          >
            {rarityLabel(player.rarity).toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
          {avatar ? (
            <img
              src={avatar}
              width={124}
              height={124}
              style={{ borderRadius: 999, border: `5px solid ${colors.frame[1]}` }}
            />
          ) : (
            <div
              style={{
                width: 140,
                height: 140,
                borderRadius: 999,
                backgroundColor: colors.muted
              }}
            />
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 14,
            fontSize: 21,
            fontWeight: 700
          }}
        >
          {player.name}
        </div>
        <div
          style={{ display: "flex", justifyContent: "center", fontSize: 12, color: colors.muted }}
        >
          {titleText(player.title)}
        </div>

        <div
          style={{
            display: "flex",
            height: 1,
            backgroundColor: colors.muted,
            margin: "10px 0 8px",
            opacity: 0.4
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {STAT_ORDER.map((key) => (
            <div
              key={key}
              style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, color: colors.muted }}>
                {statShort(key)}
              </div>
              <div
                style={{
                  fontSize: 19,
                  fontWeight: 700,
                  color: tierColors[statTier(player.stats[key].value)]
                }}
              >
                {String(player.stats[key].value)}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "auto",
            justifyContent: "space-between",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1
          }}
        >
          <div style={{ display: "flex" }}>{(player.club ?? "").toUpperCase()}</div>
          <div style={{ display: "flex" }}>@{player.login}</div>
        </div>
      </div>
    </div>
  )
}
