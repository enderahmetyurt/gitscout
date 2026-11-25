import { getBadgePlayer } from "@/features/scout/api/players.functions"
import { renderBadgeSvg } from "@/features/scout/helpers/badge-svg"
import { usernameSchema } from "@/features/scout/schemas/player.schema"
import * as m from "@/paraglide/messages.js"

/** Rozette nadirlik adı küçük harfle yazılır; sayfadaki başlıklardan ayrı mesajlardır. */
const TIER_NAMES = {
  icon: m.badge_tier_icon,
  gold: m.badge_tier_gold,
  silver: m.badge_tier_silver,
  bronze: m.badge_tier_bronze
} as const

/**
 * Kullanıcı adı README'lerde yıllarca kalacağı için bilinmeyen ya da geçersiz adda da 200 ve
 * "sırada değil" rozeti döner; 404 GitHub'da kırık görsel olarak görünürdü.
 */
async function badgeSvg(username: string): Promise<string> {
  const label = m.badge_label()
  const parsed = usernameSchema.safeParse(username)
  const entry = parsed.success ? await getBadgePlayer(parsed.data) : null
  if (!entry) return renderBadgeSvg({ label, value: m.badge_not_ranked(), tone: "none" })

  const { player } = entry
  return renderBadgeSvg({
    label,
    value: m.badge_value({ ovr: player.ovr, tier: TIER_NAMES[player.rarity]() }),
    tone: player.rarity
  })
}

/** README rozeti. GitHub görseli kendi proxy'sinde önbelleğe aldığından süre kısa tutulur. */
export async function playerBadgeResponse(username: string): Promise<Response> {
  return new Response(await badgeSvg(username), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400"
    }
  })
}
