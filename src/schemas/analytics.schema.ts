import { z } from "zod"

/** GitHub kullanıcı adı biçimi; harf farkını veritabanı fonksiyonu birleştirir. */
const LOGIN = "[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}"

/**
 * Sitenin sayfa yolları: isteğe bağlı dil öneki, ardından ana sayfa, liderlik, hakkında, kapışma ya da profil.
 * Sorgu dizesi hiç gönderilmez; listede olmayan yollar (404, rastgele istekler) kaydedilmez.
 */
const PAGE_PATH = new RegExp(
  `^(?=/)(?:/(?:tr|en))?(?:/(?:leaderboard|about|vs(?:/${LOGIN}/${LOGIN})?|u/${LOGIN}))?/?$`
)

export const pagePathSchema = z.string().max(2048).regex(PAGE_PATH)

const login = z.string().max(64)

/**
 * Sitenin özel olayları. Çerez ve kişisel veri yok; yalnızca zaten herkese açık GitHub kullanıcı adları,
 * hata kodları ve hangi butona basıldığı gider.
 */
export const analyticsEventSchema = z.discriminatedUnion("name", [
  z.object({ name: z.literal("card_requested"), login }),
  z.object({ name: z.literal("card_request_failed"), reason: z.string().max(64) }),
  z.object({ name: z.literal("card_downloaded"), login }),
  z.object({ name: z.literal("card_shared"), login, target: z.string().max(32) }),
  z.object({
    name: z.literal("duel_shared"),
    left: login,
    right: login,
    via: z.enum(["image", "link", "x"])
  }),
  z.object({
    name: z.literal("github_star_clicked"),
    placement: z.enum(["header", "hero", "card"])
  }),
  z.object({
    name: z.literal("readme_badge_copied"),
    login,
    via: z.enum(["prompt", "markdown"])
  })
])

export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>
