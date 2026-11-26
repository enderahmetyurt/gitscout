import { getBadgePlayer } from "@/features/scout/api/players.functions"
import { playerBadgeSvg, unrankedBadgeSvg } from "@/features/scout/helpers/player-badge"
import type { BadgeLocale } from "@/features/scout/schemas/badge.schema"
import { usernameSchema } from "@/features/scout/schemas/player.schema"

/**
 * Kullanıcı adı README'lerde yıllarca kalacağı için bilinmeyen ya da geçersiz adda da 200 ve
 * "sırada değil" rozeti döner; 404 GitHub'da kırık görsel olarak görünürdü.
 */
async function badgeSvg(username: string, locale: BadgeLocale): Promise<string> {
  const parsed = usernameSchema.safeParse(username)
  const entry = parsed.success ? await getBadgePlayer(parsed.data) : null
  return entry ? playerBadgeSvg({ ...entry.player, locale }) : unrankedBadgeSvg(locale)
}

/** README rozeti. GitHub görseli kendi proxy'sinde önbelleğe aldığından süre kısa tutulur. */
export async function playerBadgeResponse(
  username: string,
  locale: BadgeLocale
): Promise<Response> {
  return new Response(await badgeSvg(username, locale), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400"
    }
  })
}
