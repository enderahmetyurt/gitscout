import { useState } from "react"

import { getRouteApi, useNavigate, useRouter } from "@tanstack/react-router"
import { Dices } from "lucide-react"
import { cn } from "cn"

import { getLangParam } from "@/helpers/localized-url"

import { Button } from "@/components/ui/button"
import { DuelPresets } from "@/features/scout/components/DuelPresets"
import { DuelSlot } from "@/features/scout/components/DuelSlot"
import { STAT_ORDER } from "@/features/scout/constants/scoring.constants"
import { statShort } from "@/features/scout/helpers/player-text"
import { useLeaderboard } from "@/features/scout/hooks/use-leaderboard"
import { usePrefetchPlayer } from "@/features/scout/hooks/use-prefetch-player"
import type { ListPlayer } from "@/features/scout/types/player.types"
import * as m from "@/paraglide/messages.js"

const routeApi = getRouteApi("/{-$lang}/vs/")

const LEFT_ID = "duel-left"
const RIGHT_ID = "duel-right"

/**
 * Kapışma sayfasının boş hali: kapışma sayfasının iki köşesi, ters duran iki kart ve aralarında VS ile
 * altı raundun listesi. İki taraf seçilince kapışma açılır; kartlar view transition ile yerlerine kayar,
 * maç özeti ortada belirir.
 */
export function DuelPicker() {
  const { data } = useLeaderboard()
  const search = routeApi.useSearch()
  const navigate = useNavigate()
  const router = useRouter()
  const prefetchPlayer = usePrefetchPlayer()
  const [isOpening, setIsOpening] = useState(false)
  const [left, setLeft] = useState<ListPlayer | null>(
    () =>
      data.players.find((player) => player.login.toLowerCase() === search.left?.toLowerCase()) ??
      null
  )
  const [right, setRight] = useState<ListPlayer | null>(null)

  const open = (nextLeft: ListPlayer | null, nextRight: ListPlayer | null) => {
    setLeft(nextLeft)
    setRight(nextRight)
    if (!nextLeft || !nextRight || nextLeft.login === nextRight.login) return false
    const target = {
      to: "/{-$lang}/vs/$left/$right",
      params: { lang: getLangParam(), left: nextLeft.login, right: nextRight.login }
    } as const
    // Veri önce yüklenir; yoksa geçiş kartlara değil yükleniyor iskeletine kayar. Yükleme hata
    // verse de sayfa açılır ve hatayı kendisi gösterir.
    setIsOpening(true)
    void router
      .preloadRoute(target)
      .catch((error: unknown) => console.error("Could not preload the duel", error))
      .finally(
        () =>
          void navigate({
            ...target,
            viewTransition: true,
            state: (previous) => ({ ...previous, duelTransition: true })
          })
      )
    return true
  }

  const choose = (side: "left" | "right", player: ListPlayer | null) => {
    const nextLeft = side === "left" ? player : left
    const nextRight = side === "right" ? player : right
    if (player) prefetchPlayer(player.login)
    if (open(nextLeft, nextRight)) return
    // Rakip henüz seçilmediyse arama doğrudan öbür tarafa geçer.
    const missing = nextLeft ? (nextRight ? null : RIGHT_ID) : LEFT_ID
    if (player && missing) requestAnimationFrame(() => document.getElementById(missing)?.focus())
  }

  /** Boş kalan tarafları listeden rastgele doldurur; seçilmiş taraf yerinde kalır. */
  const pickRandom = () => {
    const nextLeft = left ?? randomPlayer(data.players, right)
    const nextRight = right ?? randomPlayer(data.players, nextLeft)
    open(nextLeft, nextRight)
  }

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 overflow-x-clip px-4 pt-2 pb-20 outline-none sm:px-6"
    >
      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className="font-mono text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          {m.duel_title()}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {m.duel_lead()}
        </h1>
        <p className="max-w-xl text-sm text-balance text-muted-foreground">{m.duel_sublead()}</p>
      </div>

      <div className="relative isolate">
        {/* Sahne: iki tarafın arkasında hafif renk. Geçişte sayfayla birlikte söner. */}
        <div aria-hidden className="pointer-events-none absolute -inset-x-4 -inset-y-10 -z-10">
          <div className="duel-stage-glow absolute inset-0" />
          <div className="duel-stage-grid absolute inset-0" />
        </div>

        {/* Ortadaki sütun eski VS + boşluk kadar geniş: kartlar geçişten önce yine aynı yerde durur. */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-3 lg:grid-cols-[20rem_8rem_20rem] lg:justify-center lg:gap-4">
          <DuelSlot
            id={LEFT_ID}
            side="left"
            label={m.duel_home()}
            player={left}
            players={data.players.filter((player) => player.login !== right?.login)}
            onChange={(player) => choose("left", player)}
          />
          <div className="flex flex-col items-center gap-6 self-center lg:mt-12">
            <VsMark isOpening={isOpening} />
            <StatLadder left={left} right={right} />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={pickRandom}
              disabled={isOpening}
              className="max-lg:hidden"
            >
              <Dices aria-hidden />
              {m.duel_random()}
            </Button>
          </div>
          <DuelSlot
            id={RIGHT_ID}
            side="right"
            label={m.duel_away()}
            player={right}
            players={data.players.filter((player) => player.login !== left?.login)}
            onChange={(player) => choose("right", player)}
            autoFocus={left !== null}
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={pickRandom}
          disabled={isOpening}
          className="lg:hidden"
        >
          <Dices aria-hidden />
          {m.duel_random()}
        </Button>
        <p className="text-center text-sm text-muted-foreground" aria-live="polite">
          {isOpening ? m.duel_preparing() : m.duel_missing()}
        </p>
      </div>

      <DuelPresets
        players={data.players}
        seed={data.featuredSeed}
        profileViews={data.profileViews}
      />
    </main>
  )
}

function randomPlayer(players: ListPlayer[], except: ListPlayer | null): ListPlayer | null {
  const pool = players.filter((player) => player.login !== except?.login)
  return pool[Math.floor(Math.random() * pool.length)] ?? null
}

/** Ortadaki VS: iki tarafın renginden bir halka; arkasında renkler arasında gidip gelen ışıma. */
function VsMark({ isOpening }: { isOpening: boolean }) {
  return (
    <span aria-hidden className="relative flex size-12 items-center justify-center lg:size-20">
      <span data-side="left" className="duel-vs-glow absolute -inset-6" />
      <span data-side="right" className="duel-vs-glow absolute -inset-6" />
      <span
        className={cn(
          "relative flex size-full items-center justify-center rounded-full bg-linear-to-br from-chart-home to-chart-away p-0.5 shadow-lg",
          isOpening && "animate-pulse"
        )}
      >
        <span className="flex size-full items-center justify-center rounded-full bg-background font-mono text-base font-bold tracking-tight lg:text-2xl">
          VS
        </span>
      </span>
    </span>
  )
}

/**
 * Altı raundun listesi: seçilen tarafın değerleri kendi renginde dolar, boş taraf soru işaretiyle
 * bekler. Kartlardaki statların tekrarı olduğu için ekran okuyucudan gizli.
 */
function StatLadder({ left, right }: { left: ListPlayer | null; right: ListPlayer | null }) {
  return (
    <ol aria-hidden className="w-full max-lg:hidden">
      {STAT_ORDER.map((key) => (
        <li
          key={key}
          className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-dashed border-border py-1.5 font-mono text-xs last:border-b-0"
        >
          <span
            className={cn(
              "text-end font-bold tabular-nums",
              left ? "text-chart-home" : "text-muted-foreground/50"
            )}
          >
            {left ? left.stats[key].value : "?"}
          </span>
          <span className="text-[10px] font-semibold tracking-wider text-muted-foreground">
            {statShort(key)}
          </span>
          <span
            className={cn(
              "font-bold tabular-nums",
              right ? "text-chart-away" : "text-muted-foreground/50"
            )}
          >
            {right ? right.stats[key].value : "?"}
          </span>
        </li>
      ))}
    </ol>
  )
}
