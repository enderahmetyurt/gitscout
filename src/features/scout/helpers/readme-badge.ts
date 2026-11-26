import { BADGE_CARD_SIZES } from "@/features/scout/constants/badge.constants"
import type { BadgeLocale, BadgeSize } from "@/features/scout/schemas/badge.schema"

/**
 * Rozet kodunun parçaları; ayarlar sayfası satırı bunlarla renklendirir. İngilizce varsayılan olduğu
 * için adreste dil yalnızca başka bir dil seçildiğinde yer alır; mevcut README adresleri değişmez.
 */
export function readmeBadgeParts(
  siteUrl: string,
  login: string,
  size: BadgeSize = "mini",
  locale: BadgeLocale = "en"
) {
  const params = new URLSearchParams()
  if (size !== "mini") params.set("size", size)
  if (locale !== "en") params.set("lang", locale)
  const query = params.size > 0 ? `?${params.toString()}` : ""
  return {
    alt: "Gitscout",
    image: `${siteUrl}/badge/${login}.${size === "mini" ? "svg" : "png"}${query}`,
    link: `${siteUrl}/u/${login}`,
    width: size === "mini" ? null : BADGE_CARD_SIZES[size].width
  }
}

/**
 * Profil README'sine eklenecek rozet. Görsel ve bağlantı aynı kullanıcı adını taşır; bağlantı oyuncu
 * sayfasına gider. Mini rozet Markdown, kartlar HTML'dir: PNG iki kat çözünürlükte üretildiği için
 * `width` ile küçültülmesi gerekir. Biçimler `public/llms.txt` içindeki örneklerle aynı kalmalı.
 */
export function readmeBadgeSnippet(
  siteUrl: string,
  login: string,
  size: BadgeSize = "mini",
  locale: BadgeLocale = "en"
): string {
  const { alt, image, link, width } = readmeBadgeParts(siteUrl, login, size, locale)
  return width === null
    ? `[![${alt}](${image})](${link})`
    : `<a href="${link}"><img src="${image}" alt="${alt}" width="${width}"></a>`
}
