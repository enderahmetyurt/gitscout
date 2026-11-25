import type { CountryCode } from "@/features/scout/constants/player-country.constants"
import { playerCountry } from "@/features/scout/helpers/player-country"
import type { ListPlayer, Position, Rarity, StatKey } from "@/features/scout/types/player.types"

/** `/api/top.json` içindeki tek oyuncu: README tablosu ve dış araçlar için sade, kararlı biçim. */
export type TopPlayer = {
  rank: number
  login: string
  name: string
  avatarUrl: string
  ovr: number
  rarity: Rarity
  position: Position
  country: CountryCode | null
  stats: Record<StatKey, number>
}

/** Sıralı listedeki oyuncuyu herkese açık biçime çevirir; `index` sıfırdan başlar. */
export function toTopPlayer(player: ListPlayer, index: number): TopPlayer {
  const { stats } = player
  return {
    rank: index + 1,
    login: player.login,
    name: player.name,
    avatarUrl: player.avatarUrl,
    ovr: player.ovr,
    rarity: player.rarity,
    position: player.position,
    country: playerCountry(player.login) ?? null,
    stats: {
      act: stats.act.value,
      imp: stats.imp.value,
      com: stats.com.value,
      rep: stats.rep.value,
      con: stats.con.value,
      exp: stats.exp.value
    }
  }
}
