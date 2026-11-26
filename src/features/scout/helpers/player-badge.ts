import { renderBadgeSvg } from "@/features/scout/helpers/badge-svg"
import type { BadgeLocale } from "@/features/scout/schemas/badge.schema"
import type { Rarity } from "@/features/scout/types/player.types"
import * as m from "@/paraglide/messages.js"

/**
 * README rozeti adres dil öneki taşımaz; dil `?lang=` ile seçilir, verilmezse İngilizce. Sayfadaki
 * önizleme de sayfa dili ne olursa olsun seçilen dille birebir aynı kalsın diye dil hep açıkça verilir.
 */

/** Rozette nadirlik adı küçük harfle yazılır; sayfadaki başlıklardan ayrı mesajlardır. */
const TIER_NAMES = {
  icon: m.badge_tier_icon,
  gold: m.badge_tier_gold,
  silver: m.badge_tier_silver,
  bronze: m.badge_tier_bronze
} as const

/** Kartı olan oyuncunun rozeti; sunucu yanıtı ve profil sayfasındaki önizleme aynı çıktıyı kullanır. */
export function playerBadgeSvg({
  ovr,
  rarity,
  locale = "en"
}: {
  ovr: number
  rarity: Rarity
  locale?: BadgeLocale
}): string {
  const options = { locale }
  return renderBadgeSvg({
    label: m.badge_label({}, options),
    value: m.badge_value({ ovr, tier: TIER_NAMES[rarity]({}, options) }, options),
    tone: rarity
  })
}

/** Kartı olmayan ya da geçersiz kullanıcı adı için gri rozet. */
export function unrankedBadgeSvg(locale: BadgeLocale = "en"): string {
  const options = { locale }
  return renderBadgeSvg({
    label: m.badge_label({}, options),
    value: m.badge_not_ranked({}, options),
    tone: "none"
  })
}

/** Ağ isteği olmadan `<img src>` olarak gösterilebilen SVG adresi. */
export function svgDataUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
