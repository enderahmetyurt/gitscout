import type { Ref } from "react"

import { cn } from "cn"

import { BadgeIcon } from "@/features/scout/components/BadgeIcon"
import { STAT_ORDER } from "@/features/scout/constants/scoring.constants"
import { STAT_TIER_TEXT } from "@/features/scout/constants/stat-tier.constants"
import {
  badgeName,
  clubLabel,
  rarityLabel,
  statShort,
  titleText
} from "@/features/scout/helpers/player-text"
import { statTier } from "@/features/scout/helpers/stat-tier"
import type { ScoredPlayer } from "@/features/scout/types/player.types"
import * as m from "@/paraglide/messages.js"

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
      className="scout-card relative flex h-120 w-80 shrink-0 flex-col overflow-hidden rounded-[28px] p-2 max-[351px]:[zoom:0.9]"
    >
      <figcaption className="sr-only">
        {m.card_caption({
          name: player.name,
          ovr: player.ovr,
          position: player.position,
          title: titleText(player.title)
        })}
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
            {rarityLabel(player.rarity)}
          </span>
        </div>

        <div className="relative mt-3 flex justify-center">
          <img
            src={player.avatarUrl}
            alt=""
            crossOrigin="anonymous"
            width={152}
            height={152}
            className="scout-card-avatar size-38 rounded-full object-cover"
          />
        </div>

        <div className="relative mt-4 flex flex-col items-center text-center">
          <p
            lang={TURKISH_CHARS.test(player.name) ? "tr" : "en"}
            className="line-clamp-2 text-xl leading-tight font-semibold text-balance"
          >
            {player.name}
          </p>
          <p className="scout-card-muted mt-1 line-clamp-1 text-xs">{titleText(player.title)}</p>
        </div>

        <div aria-hidden className="scout-card-rule relative mx-auto mt-4 w-full border-t" />

        <dl className="relative mt-3 grid grid-cols-6 gap-1">
          {STAT_ORDER.map((key) => {
            const stat = player.stats[key]
            return (
              <div key={key} className="flex flex-col items-center gap-0.5 py-1">
                <dt className="scout-card-muted text-[10px] font-semibold tracking-wider">
                  {statShort(key)}
                </dt>
                <dd
                  className={cn(
                    "text-xl leading-none font-bold tabular-nums",
                    STAT_TIER_TEXT[statTier(stat.value)]
                  )}
                >
                  {stat.value}
                </dd>
              </div>
            )
          })}
        </dl>

        <div className="relative mt-auto flex items-center justify-between pt-3 text-[11px]">
          <span
            lang="en"
            className="scout-card-muted truncate font-semibold tracking-wide uppercase"
          >
            {clubLabel(player.club)}
          </span>
          {player.badges.length > 0 ? (
            <ul className="flex shrink-0 gap-1" aria-label={m.badges_heading()}>
              {player.badges.slice(0, 4).map((badge) => (
                <li
                  key={badge.id}
                  title={badgeName(badge.id)}
                  data-badge={badge.id}
                  className="badge-tint grid size-6 place-items-center rounded-full"
                >
                  <BadgeIcon id={badge.id} className="size-3.5" />
                  <span className="sr-only">{badgeName(badge.id)}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </figure>
  )
}
