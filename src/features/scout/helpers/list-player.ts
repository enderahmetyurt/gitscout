import type { ListPlayer, ScoredPlayer, StatKey } from "@/features/scout/types/player.types"

/**
 * Tam kartı liste ekranlarının taşıdığı hafif biçime indirir. Veritabanı bu biçimi doğrudan
 * SQL'de üretir; bu fonksiyon yalnızca o an yeniden puanlanan kayıtlar için kullanılır.
 */
export function toListPlayer(player: ScoredPlayer): ListPlayer {
  const {
    positionBreakdown: _breakdown,
    topRepos: _repos,
    archetype: _archetype,
    stats,
    ...rest
  } = player
  const listStats = Object.fromEntries(
    Object.entries(stats).map(([key, stat]) => [key, { key: stat.key, value: stat.value }])
  ) as Record<StatKey, ListPlayer["stats"][StatKey]>
  return { ...rest, stats: listStats }
}
