import { useState } from "react"

import { getRouteApi, useNavigate } from "@tanstack/react-router"
import { Swords } from "lucide-react"

import { PlayerCombobox } from "@/features/scout/components/PlayerCombobox"
import { useLeaderboard } from "@/features/scout/hooks/use-leaderboard"
import type { ScoredPlayer } from "@/features/scout/types/player.types"

const routeApi = getRouteApi("/vs/")

/** İki oyuncu seçilince kapışma sayfasına geçer. */
export function DuelPicker() {
  const { data } = useLeaderboard()
  const search = routeApi.useSearch()
  const navigate = useNavigate()
  const [left, setLeft] = useState<ScoredPlayer | null>(
    () =>
      data.players.find((player) => player.login.toLowerCase() === search.left?.toLowerCase()) ??
      null
  )
  const [right, setRight] = useState<ScoredPlayer | null>(null)

  const choose = (side: "left" | "right", player: ScoredPlayer | null) => {
    const nextLeft = side === "left" ? player : left
    const nextRight = side === "right" ? player : right
    setLeft(nextLeft)
    setRight(nextRight)
    if (nextLeft && nextRight && nextLeft.login !== nextRight.login) {
      void navigate({
        to: "/vs/$left/$right",
        params: { left: nextLeft.login, right: nextRight.login }
      })
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 pt-10 pb-20 sm:px-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold tracking-tight text-balance">Kapışma</h1>
        <p className="text-pretty text-muted-foreground">
          İki oyuncu seç; altı statta karşı karşıya gelsinler. Daha çok stat kazanan maçı alır,
          eşitlikte genel puana bakılır.
        </p>
      </div>

      <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <div className="flex flex-col gap-2">
          <label htmlFor="duel-left" className="text-sm font-medium">
            Ev sahibi
          </label>
          <PlayerCombobox
            id="duel-left"
            players={data.players.filter((player) => player.login !== right?.login)}
            value={left}
            onChange={(player) => choose("left", player)}
            placeholder="Ad ya da kullanıcı adı"
          />
        </div>
        <Swords aria-hidden className="mx-auto mb-2 size-5 text-muted-foreground" />
        <div className="flex flex-col gap-2">
          <label htmlFor="duel-right" className="text-sm font-medium">
            Deplasman
          </label>
          <PlayerCombobox
            id="duel-right"
            players={data.players.filter((player) => player.login !== left?.login)}
            value={right}
            onChange={(player) => choose("right", player)}
            autoFocus={left !== null}
            placeholder="Ad ya da kullanıcı adı"
          />
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Listede olmayan biri mi? Önce ana sayfadan kartını çıkar.
      </p>
    </main>
  )
}
