import { useState } from "react"

import { getRouteApi, useNavigate } from "@tanstack/react-router"
import { Swords } from "lucide-react"

import { getLangParam } from "@/helpers/localized-url"

import { DuelPresets } from "@/features/scout/components/DuelPresets"
import { PlayerCombobox } from "@/features/scout/components/PlayerCombobox"
import { useLeaderboard } from "@/features/scout/hooks/use-leaderboard"
import type { ListPlayer } from "@/features/scout/types/player.types"
import * as m from "@/paraglide/messages.js"

const routeApi = getRouteApi("/{-$lang}/vs/")

/** İki oyuncu seçilince kapışma sayfasına geçer. */
export function DuelPicker() {
  const { data } = useLeaderboard()
  const search = routeApi.useSearch()
  const navigate = useNavigate()
  const [left, setLeft] = useState<ListPlayer | null>(
    () =>
      data.players.find((player) => player.login.toLowerCase() === search.left?.toLowerCase()) ??
      null
  )
  const [right, setRight] = useState<ListPlayer | null>(null)

  const choose = (side: "left" | "right", player: ListPlayer | null) => {
    const nextLeft = side === "left" ? player : left
    const nextRight = side === "right" ? player : right
    setLeft(nextLeft)
    setRight(nextRight)
    if (nextLeft && nextRight && nextLeft.login !== nextRight.login) {
      void navigate({
        to: "/{-$lang}/vs/$left/$right",
        params: { lang: getLangParam(), left: nextLeft.login, right: nextRight.login }
      })
    }
  }

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 pt-10 pb-20 outline-none sm:px-6"
    >
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold tracking-tight text-balance">{m.duel_title()}</h1>
        <p className="text-pretty text-muted-foreground">{m.duel_lead()}</p>
      </div>

      <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <div className="flex flex-col gap-2">
          <label htmlFor="duel-left" className="text-sm font-medium">
            {m.duel_home()}
          </label>
          <PlayerCombobox
            id="duel-left"
            players={data.players.filter((player) => player.login !== right?.login)}
            value={left}
            onChange={(player) => choose("left", player)}
            placeholder={m.duel_placeholder()}
          />
        </div>
        <Swords aria-hidden className="mx-auto mb-2 size-5 text-muted-foreground" />
        <div className="flex flex-col gap-2">
          <label htmlFor="duel-right" className="text-sm font-medium">
            {m.duel_away()}
          </label>
          <PlayerCombobox
            id="duel-right"
            players={data.players.filter((player) => player.login !== left?.login)}
            value={right}
            onChange={(player) => choose("right", player)}
            autoFocus={left !== null}
            placeholder={m.duel_placeholder()}
          />
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{m.duel_missing()}</p>

      <DuelPresets players={data.players} seed={data.featuredSeed} />
    </main>
  )
}
