import { useState } from "react"

import { Link } from "@tanstack/react-router"
import { Shuffle } from "lucide-react"
import { cn } from "cn"

import { getLangParam } from "@/helpers/localized-url"

import { Button } from "@/components/ui/button"
import { duelPresets } from "@/features/scout/helpers/duel-presets"
import { playerCountry } from "@/features/scout/helpers/player-country"
import { rarityLabel } from "@/features/scout/helpers/player-text"
import type { ListPlayer } from "@/features/scout/types/player.types"
import * as m from "@/paraglide/messages.js"
import { getLocale } from "@/paraglide/runtime.js"

// Puanlar gizli: kimin kazanacağı kapışma açılınca belli olsun.
const PRESET_COUNT = 9

type PresetView = "tr" | "world"

type DuelPresetsProps = {
  players: ListPlayer[]
  /** İlk liste bu tohumla kurulur; sunucu ve tarayıcı aynı eşleşmeleri çizsin diye veriyle gelir. */
  seed: number
}

/** Kapışma sayfasının boş halinde tek tıkla açılan, aynı alan ve kart türünden eşleşmeler. */
export function DuelPresets({ players, seed }: DuelPresetsProps) {
  const [currentSeed, setCurrentSeed] = useState(seed)
  const [selectedView, setSelectedView] = useState<PresetView>("tr")
  // Ana sayfadaki ilk 10 gibi: Türkçede varsayılan Türkiye, İngilizcede karışık liste.
  const turkishPresets = duelPresets(
    players.filter((player) => playerCountry(player) === "TR"),
    currentSeed,
    PRESET_COUNT
  )
  const canSwitch = getLocale() === "tr" && turkishPresets.length > 0
  const view: PresetView = canSwitch ? selectedView : "world"
  const presets = view === "tr" ? turkishPresets : duelPresets(players, currentSeed, PRESET_COUNT)
  if (presets.length === 0) return null

  const viewButton = (target: PresetView, label: string) => (
    <button
      type="button"
      aria-pressed={view === target}
      onClick={() => setSelectedView(target)}
      className={cn(
        "inline-flex min-h-6 items-center rounded-sm px-1.5 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        view === target
          ? "font-semibold text-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
    </button>
  )

  return (
    <section className="flex flex-col gap-4" aria-labelledby="duel-presets-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 id="duel-presets-heading" className="text-xl font-semibold">
            {m.duel_presets_title()}
          </h2>
          <p className="text-sm text-muted-foreground">{m.duel_presets_lead()}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {canSwitch ? (
            <div
              role="group"
              aria-label={m.duel_presets_switch_label()}
              className="flex items-center"
            >
              {viewButton("tr", m.home_top_tr())}
              <span aria-hidden className="text-muted-foreground">
                ·
              </span>
              {viewButton("world", m.home_top_world())}
            </div>
          ) : null}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentSeed(Math.floor(Math.random() * 2 ** 32))}
          >
            <Shuffle aria-hidden />
            {m.duel_presets_shuffle()}
          </Button>
        </div>
      </div>
      <ul className="grid gap-3 sm:grid-cols-3">
        {presets.map(({ left, right, position, rarity }) => (
          <li key={`${left.login}-${right.login}`}>
            <Link
              to="/{-$lang}/vs/$left/$right"
              params={{ lang: getLangParam(), left: left.login, right: right.login }}
              aria-label={m.duel_presets_open({ left: left.name, right: right.name })}
              data-rarity={rarity}
              className="scout-card flex rounded-xl p-1 transition-[filter] outline-none hover:brightness-110 focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              {/* Kart türü çerçeve renginden okunur; ekran okuyucu için adı gizli metinde. */}
              <span className="scout-card-inner flex w-full flex-col items-center gap-3 rounded-lg px-3 pt-3 pb-2">
                <span
                  lang="en"
                  data-role={position}
                  className="role-tint inline-flex h-5 items-center rounded-full px-2 font-sans text-xs font-medium whitespace-nowrap"
                >
                  {position}
                </span>
                <span className="sr-only">{rarityLabel(rarity)}</span>
                <span className="grid w-full grid-cols-[1fr_auto_1fr] items-start gap-1">
                  <PresetSide player={left} />
                  <span aria-hidden className="scout-card-muted mt-4 text-xs font-semibold">
                    VS
                  </span>
                  <PresetSide player={right} />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

function PresetSide({ player }: { player: ListPlayer }) {
  return (
    <span className="flex min-w-0 flex-col items-center gap-1.5">
      <img
        src={player.avatarUrl}
        alt=""
        width={48}
        height={48}
        loading="lazy"
        className="scout-card-avatar size-12 shrink-0 rounded-full bg-muted"
      />
      <span className="line-clamp-2 min-h-10 w-full text-center font-sans text-sm/5 font-semibold break-words">
        {player.name}
      </span>
    </span>
  )
}
