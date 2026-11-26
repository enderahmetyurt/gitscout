/** Onaylı sayılmak ve profil ayarlarını değiştirebilmek için gereken en düşük GitHub hesabı koşulları. Sahte hesapları eler. */
export const ACCOUNT_ELIGIBILITY = {
  minAgeMonths: 6,
  minFollowers: 5
} as const

/** Uygulamanın kendi oturumu. Tarayıcıda yalnızca httpOnly çerezde rastgele bir anahtar durur. */
export const SESSION = {
  cookieName: "gs_session",
  maxAgeDays: 30
} as const

/** Ayarlarda seçilebilen cinsiyetler; boş bırakmak da mümkün. Herkese açık oyuncu verisine eklenmez. */
export const GENDERS = ["female", "male"] as const

export type Gender = (typeof GENDERS)[number]

/**
 * Onaylı hesabın profilde varsayılan gösterebileceği kalıcı kart yüzleri; boş bırakmak gerçek kart demek.
 * Takım kartı favori takım seçiliyken, GitHub Star kartı yalnızca GitHub Stars programındakilere açık.
 */
export const CARD_FACES = ["team", "github-star"] as const

export type CardFace = (typeof CARD_FACES)[number]
