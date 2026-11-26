import type { ListPlayer } from "@/features/scout/types/player.types"
import * as m from "@/paraglide/messages.js"

const AVATAR_LIMIT = 5

type HeroProofProps = {
  players: ListPlayer[]
  latest: { login: string }[]
  lastDayCount: number
}

/** Hero'nun altında "insanlar şu an kart basıyor" satırı: son eklenenlerin avatarları ve sayılar. */
export function HeroProof({ players, latest, lastDayCount }: HeroProofProps) {
  if (players.length === 0) return null

  const byLogin = new Map(players.map((player) => [player.login.toLowerCase(), player]))
  const avatars = latest
    .flatMap((entry) => {
      const player = byLogin.get(entry.login.toLowerCase())
      return player ? [player] : []
    })
    .slice(0, AVATAR_LIMIT)

  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      {avatars.length > 0 ? (
        <ul aria-hidden className="flex shrink-0 -space-x-2">
          {avatars.map((player) => (
            <li key={player.login}>
              <img
                src={player.avatarUrl}
                alt=""
                width={28}
                height={28}
                className="size-7 rounded-full ring-2 ring-background"
              />
            </li>
          ))}
        </ul>
      ) : null}
      <p className="flex items-center gap-2">
        <span
          aria-hidden
          className="size-1.5 shrink-0 rounded-full bg-success ring-3 ring-success/20"
        />
        <span>
          {m.home_proof_total({ count: players.length })}
          {lastDayCount > 0 ? <> · {m.home_proof_day({ count: lastDayCount })}</> : null}
        </span>
      </p>
    </div>
  )
}
