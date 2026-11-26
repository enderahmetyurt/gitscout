import type { MaskSpec } from "@virastack/mask"

/** Rüya takımına en fazla kaç geliştirici seçilebilir. Seçim zorunlu değil. */
export const DREAM_TEAM_SIZE = 5

/** Şehir adı uzunluğu; sınır veritabanı kısıtıyla aynı. */
export const CITY_LENGTH = { min: 2, max: 60 } as const

/**
 * Şehir alanının maskesi: harfle başlar, sonra harf, boşluk, tire ve kesme işareti ("Saint-Étienne", "Xi'an").
 * Rakam ve diğer işaretler yazılamaz. Kayıttan önce aynı kural sunucuda Zod ile yeniden denetlenir.
 */
export const CITY_MASK = {
  mask: `a[${"n".repeat(CITY_LENGTH.max - 1)}]`,
  tokens: { n: /[\p{L}\p{M} '’-]/u },
  normalize: (value: string) => value.normalize("NFC").replace(/\s+/g, " ").trimStart(),
  inputMode: "text",
  autoComplete: "address-level2"
} as const satisfies MaskSpec

/** Özel kartlar sayfasında giriş yapmamış (ya da kartı olmayan) ziyaretçiye gösterilen örnek kartın sahibi. */
export const SPECIAL_CARDS_SAMPLE_LOGIN = "omergulcicek"
