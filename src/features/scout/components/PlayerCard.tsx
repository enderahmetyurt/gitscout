import type { Ref } from "react"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { RARITY_LABELS, STAT_ORDER } from "@/features/scout/constants/scoring.constants"
import type { ScoredPlayer } from "@/features/scout/types/player.types"

type PlayerCardProps = {
  player: ScoredPlayer
  ref?: Ref<HTMLElement>
}

/** Büyük harfe çevirirken i/İ doğru olsun: Türkçe karakter yoksa İngilizce kural. */
const TURKISH_CHARS = /[çğıöşüÇĞİÖŞÜ]/

export function PlayerCard({ player, ref }: PlayerCardProps) {
  return (
    <figure
      ref={ref}
      data-rarity={player.rarity}
      className="scout-card relative flex h-120 w-80 shrink-0 flex-col overflow-hidden rounded-[28px] p-2"
    >
      <figcaption className="sr-only">
        {player.name}: genel {player.ovr}, {player.position}, {player.title}
      </figcaption>

      {/* İç çerçeve: dış radius = iç radius (20px) + padding (8px). */}
      <div className="scout-card-inner relative flex flex-1 flex-col rounded-[20px] px-5 pt-5 pb-4">
        <div
          aria-hidden
          className="scout-card-texture pointer-events-none absolute inset-0 rounded-[20px]"
        />

        <div className="relative flex items-start justify-between">
          <div className="flex flex-col">
            <span className="scout-card-accent text-6xl leading-none font-bold tracking-tighter tabular-nums">
              {player.ovr}
            </span>
            <span lang="en" className="mt-1.5 text-xs font-semibold tracking-widest uppercase">
              {player.position}
            </span>
          </div>
          <span className="scout-card-chip rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase">
            {RARITY_LABELS[player.rarity]}
          </span>
        </div>

        <div className="relative mt-3 flex justify-center">
          <img
            src={player.avatarUrl}
            alt=""
            crossOrigin="anonymous"
            width={128}
            height={128}
            className="scout-card-avatar size-32 rounded-full object-cover"
          />
        </div>

        <div className="relative mt-4 flex flex-col items-center text-center">
          <p
            lang={TURKISH_CHARS.test(player.name) ? "tr" : "en"}
            className="line-clamp-2 text-xl leading-tight font-semibold text-balance"
          >
            {player.name}
          </p>
          <p className="scout-card-muted mt-1 line-clamp-1 text-xs">{player.title}</p>
        </div>

        <div aria-hidden className="scout-card-rule relative mx-auto mt-4 w-full border-t" />

        <dl className="relative mt-3 grid grid-cols-6 gap-1">
          {STAT_ORDER.map((key) => {
            const stat = player.stats[key]
            return (
              <Tooltip key={key}>
                <TooltipTrigger
                  render={<div tabIndex={0} />}
                  className="flex cursor-help flex-col items-center gap-0.5 rounded-md py-1 outline-none focus-visible:ring-2 focus-visible:ring-current/50"
                >
                  <dt
                    lang="en"
                    className="scout-card-muted text-[10px] font-semibold tracking-wider"
                  >
                    {stat.short}
                  </dt>
                  <dd className="text-lg leading-none font-semibold tabular-nums">{stat.value}</dd>
                </TooltipTrigger>
                <TooltipContent>
                  <span>
                    <span className="font-semibold">{stat.label}:</span> {stat.summary}
                  </span>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </dl>

        <div className="relative mt-auto flex items-center justify-between pt-3 text-[11px]">
          <span
            lang="en"
            className="scout-card-muted truncate font-semibold tracking-wide uppercase"
          >
            {player.club}
          </span>
          {player.badges.length > 0 ? (
            <ul className="flex shrink-0 gap-1" aria-label="Rozetler">
              {player.badges.slice(0, 4).map((badge) => (
                <li
                  key={badge.id}
                  title={badge.name}
                  className="scout-card-chip grid size-6 place-items-center rounded-full text-xs"
                >
                  <span aria-label={badge.name}>{badge.emoji}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </figure>
  )
}
