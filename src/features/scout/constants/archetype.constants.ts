import type { Rarity, StatKey } from "@/features/scout/types/player.types"

/** Arşetip cümlesinin başı: kart nadirliğine göre. */
export const ARCHETYPE_LEADS = {
  icon: "Efsane profil",
  gold: "Seçkin profil",
  silver: "Yükselen profil",
  bronze: "Gelişen profil"
} as const satisfies Record<Rarity, string>

/** Güçlü yan: "… ve …" ile bağlanabilecek yüklemler. */
export const ARCHETYPE_STRENGTHS = {
  act: "yıl boyu yüksek tempoda üretiyor",
  imp: "projeleri geniş kitlelere ulaşıyor",
  com: "geniş bir takipçi kitlesi var",
  rep: "başka projelere kabul gören katkılar veriyor",
  con: "neredeyse her hafta sahada",
  exp: "yılların birikimini taşıyor"
} as const satisfies Record<StatKey, string>

/** Zayıf yan: yalnızca stat gerçekten düşükse söylenir. */
export const ARCHETYPE_WEAKNESSES = {
  act: "son bir yılda temposu düşük",
  imp: "projeleri henüz geniş kitlelere ulaşmamış",
  com: "toplulukta henüz az tanınıyor",
  rep: "başka projelere katkısı henüz az",
  con: "katkıları düzensiz",
  exp: "kariyerinin başında"
} as const satisfies Record<StatKey, string>

/** Bu değerin altındaki stat zayıf yan olarak anılır. */
export const ARCHETYPE_WEAK_BELOW = 70
