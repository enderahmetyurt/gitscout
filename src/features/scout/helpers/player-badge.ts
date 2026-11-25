import { renderBadgeSvg } from "@/features/scout/helpers/badge-svg"
import type { Rarity } from "@/features/scout/types/player.types"
import * as m from "@/paraglide/messages.js"

/**
 * README rozeti adres dil öneki taşımadığından GitHub'a herkes için aynı İngilizce görsel gider;
 * sayfadaki önizleme de sayfa dili ne olursa olsun bununla birebir aynı kalsın diye dil sabittir.
 */
const BADGE_LOCALE = { locale: "en" } as const

/** Rozette nadirlik adı küçük harfle yazılır; sayfadaki başlıklardan ayrı mesajlardır. */
const TIER_NAMES = {
  icon: m.badge_tier_icon,
  gold: m.badge_tier_gold,
  silver: m.badge_tier_silver,
  bronze: m.badge_tier_bronze
} as const

/** Kartı olan oyuncunun rozeti; sunucu yanıtı ve profil sayfasındaki önizleme aynı çıktıyı kullanır. */
export function playerBadgeSvg({ ovr, rarity }: { ovr: number; rarity: Rarity }): string {
  return renderBadgeSvg({
    label: m.badge_label({}, BADGE_LOCALE),
    value: m.badge_value({ ovr, tier: TIER_NAMES[rarity]({}, BADGE_LOCALE) }, BADGE_LOCALE),
    tone: rarity
  })
}

/** Kartı olmayan ya da geçersiz kullanıcı adı için gri rozet. */
export function unrankedBadgeSvg(): string {
  return renderBadgeSvg({
    label: m.badge_label({}, BADGE_LOCALE),
    value: m.badge_not_ranked({}, BADGE_LOCALE),
    tone: "none"
  })
}

/** Ağ isteği olmadan `<img src>` olarak gösterilebilen SVG adresi. */
export function svgDataUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
