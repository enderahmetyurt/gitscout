import type { ScoredPlayer } from "@/features/scout/types/player.types"

/** Vitrine yalnızca bu kart türleri çıkar; hiçbiri yoksa herkes aday olur. */
const FEATURED_RARITIES = new Set<ScoredPlayer["rarity"]>(["icon", "gold"])

/** Son 24 saatte eklenen bir kartın seçilme ağırlığı; diğerleri 1. */
const RECENT_WEIGHT = 3

/** Tohumdan her seferinde aynı diziyi üreten küçük rastgele sayı üreteci (mulberry32). */
function seededRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Vitrin sırası: Gold ve üstü kartlar, tohuma göre ağırlıklı karıştırılmış halde.
 * Aynı tohum her yerde aynı sırayı verir; böylece sunucu ve tarayıcı aynı kartı gösterir.
 * İlk eleman "saatin kartı", sonrakiler "Başka kart" ile sırayla gelir.
 */
export function featuredOrder(
  players: ScoredPlayer[],
  recentLogins: ReadonlySet<string>,
  seed: number
): ScoredPlayer[] {
  const elite = players.filter((player) => FEATURED_RARITIES.has(player.rarity))
  const pool = elite.length > 0 ? elite : players
  const random = seededRandom(seed)
  // Efraimidis-Spirakis: her öğeye u^(1/ağırlık) anahtarı verip büyükten küçüğe dizmek ağırlıklı karıştırmadır.
  return pool
    .map((player) => {
      const weight = recentLogins.has(player.login) ? RECENT_WEIGHT : 1
      return { player, key: random() ** (1 / weight) }
    })
    .sort((a, b) => b.key - a.key)
    .map((entry) => entry.player)
}
