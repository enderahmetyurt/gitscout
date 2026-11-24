import type { StatKey } from "@/features/scout/types/player.types"

/**
 * Unvan = ön ek + son ek.
 * Ön ek, kazanılan ilk "karakter" rozetinden gelir (yoksa nadirlikten).
 * Son ek, en yüksek stattan gelir. Havuzdan seçim kullanıcı adının hash'iyle yapılır, böylece sabit kalır.
 */

export const TITLE_PREFIX_BY_BADGE: Record<string, string[]> = {
  "night-owl": ["Gece Yarısı", "Ay Işığı", "Uykusuz", "Gececi"],
  "early-bird": ["Şafak", "Sabah Mahmurluğu", "Gün Doğumu"],
  "friday-deployer": ["Cuma Akşamı", "Riskli", "Cesur"],
  "weekend-warrior": ["Hafta Sonu", "Pazar Mesaisi", "Tatilsiz"],
  graveyard: ["Nostaljik", "Arşivci", "Eski Toprak"],
  "readme-master": ["Web Editörü", "Tek Tıkla", "README Bağımlısı"],
  "streak-killer": ["Durdurulamaz", "Zincirleme", "Yorulmaz"],
  "green-tick": ["Yeşil Tikli", "Kusursuz", "Pürüzsüz"],
  polyglot: ["Çok Dilli", "Poliglot", "Kozmopolit"],
  "conventional-disciple": ["Düzenli", "Kurallı", "Disiplinli"],
  "star-collector": ["Yıldızlı", "Ünlü", "Sahne Işıklı"],
  "oss-ambassador": ["Sınır Tanımaz", "Gezgin", "Paylaşımcı"],
  "test-obsessed": ["Takıntılı", "Garantici", "Kurşun Geçirmez"]
}

export const TITLE_PREFIX_BY_RARITY = {
  icon: ["Efsanevi", "Ölümsüz", "Mitolojik"],
  gold: ["Parlayan", "Yıldız", "Seçkin"],
  silver: ["Yükselen", "Umut Vadeden", "Gelecek Vaat Eden"],
  bronze: ["Çaylak", "Isınan", "Yolun Başındaki"]
} as const

export const TITLE_SUFFIX_BY_STAT: Record<StatKey, string[]> = {
  act: ["Makine", "Durmayan Motor", "Klavye Canavarı"],
  imp: ["Yıldız Mıknatısı", "Fenomen", "Sahne Yıldızı"],
  com: ["Kitle Lideri", "Kanaat Önderi", "Taraftar Favorisi"],
  rep: ["Maintainer Dostu", "Kod Diplomatı", "Kabul Gören"],
  con: ["Maratoncu", "Seri Ustası", "Her Gün Sahada"],
  exp: ["Kıdemli Kaptan", "Usta Oyuncu", "Tecrübe Abidesi"]
}
