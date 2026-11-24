import { OG_FONT_FAMILY } from "@/lib/og-image"

import { STAT_ORDER } from "@/features/scout/constants/scoring.constants"
import { rarityLabel, statLabel, statShort, titleText } from "@/features/scout/helpers/player-text"
import { statTier } from "@/features/scout/helpers/stat-tier"
import type { Rarity, ScoredPlayer } from "@/features/scout/types/player.types"
import * as m from "@/paraglide/messages.js"

/**
 * Link önizlemesi (1200×630). Satori ile çizilir: yalnızca flex düzen ve satır içi stil desteklenir.
 * Sıralama gibi sık değişen bilgiler bilerek yok; paylaşılan gönderide eski kalan görsel yanlış görünmesin.
 */

const RARITY_COLORS: Record<
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

type OgImageProps = { player: ScoredPlayer; avatar: string | null }

export function OgImage({ player, avatar }: OgImageProps) {
  const colors = RARITY_COLORS[player.rarity]
  const tierColors = player.rarity === "icon" ? TIER_ON_DARK : TIER_ON_METAL

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        gap: 64,
        padding: "0 72px",
        backgroundColor: "#0b0b0c",
        backgroundImage: `radial-gradient(circle at 300px 315px, ${colors.frame[1]}55, transparent 380px)`,
        color: "#fafafa",
        fontFamily: OG_FONT_FAMILY
      }}
    >
      {/* Kart */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 300,
          height: 450,
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
            overflow: "hidden",
            borderRadius: 19,
            padding: "20px 20px 16px",
            color: colors.ink,
            backgroundImage: `linear-gradient(135deg, ${colors.face[0]}, ${colors.face[1]})`
          }}
        >
          <div
            style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
          >
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

      {/* Sağ taraf */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 22 }}>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 4,
            color: "#d8d8d8"
          }}
        >
          GITSCOUT
        </div>
        {/* İsim zaten kartın üzerinde; başlık tek satır, kim paylaşırsa paylaşsın doğru okunur. */}
        <div style={{ display: "flex", fontSize: 64, fontWeight: 800, lineHeight: 1 }}>
          {m.og_rating()}&nbsp;
          <span style={{ color: colors.frame[0] }}>{String(player.ovr)}</span>
        </div>
        <div style={{ display: "flex", fontSize: 20, color: "#a3a3a3" }}>
          {m.og_meta({ rarity: rarityLabel(player.rarity), position: player.position })}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", width: 640, rowGap: 14 }}>
          {STAT_ORDER.map((key) => (
            <div
              key={key}
              style={{ display: "flex", flexDirection: "column", width: 200, marginRight: 13 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                  color: "#a3a3a3",
                  marginBottom: 6
                }}
              >
                <span>{statLabel(key)}</span>
                <span style={{ color: "#fafafa" }}>{String(player.stats[key].value)}</span>
              </div>
              <div
                style={{ display: "flex", height: 8, borderRadius: 99, backgroundColor: "#26262a" }}
              >
                <div
                  style={{
                    width: `${player.stats[key].value}%`,
                    height: 8,
                    borderRadius: 99,
                    backgroundColor: "#3f8fd8"
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div
          style={{ display: "flex", alignItems: "baseline", gap: 12, fontSize: 22, marginTop: 6 }}
        >
          <span>{m.cta_title()}</span>
          <span style={{ color: "#60a5fa", textDecoration: "underline" }}>gitscout.io</span>
        </div>
      </div>
    </div>
  )
}
