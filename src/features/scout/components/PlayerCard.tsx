import type { Ref } from "react"

import { cn } from "cn"

import { BadgeIcon } from "@/features/scout/components/BadgeIcon"
import { COUNTRY_FLAGS, FLAG_CLASS } from "@/features/scout/constants/country-flag.constants"
import { STAT_ORDER } from "@/features/scout/constants/scoring.constants"
import { STAT_TIER_TEXT } from "@/features/scout/constants/stat-tier.constants"
import { countryName, playerCountry } from "@/features/scout/helpers/player-country"
import {
  badgeName,
  clubLabel,
  rarityLabel,
  statShort,
  titleText
} from "@/features/scout/helpers/player-text"
import { statTier } from "@/features/scout/helpers/stat-tier"
import type { ListPlayer } from "@/features/scout/types/player.types"
import * as m from "@/paraglide/messages.js"

type PlayerCardProps = {
  player: ListPlayer
  ref?: Ref<HTMLElement>
}

/** Büyük harfe çevirirken i/İ doğru olsun: Türkçe karakter yoksa İngilizce kural. */
const TURKISH_CHARS = /[çğıöşüÇĞİÖŞÜ]/

export function PlayerCard({ player, ref }: PlayerCardProps) {
  const country = playerCountry(player.login)
  const Flag = country ? COUNTRY_FLAGS[country] : undefined

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
      <div className="scout-card-inner relative flex min-h-0 flex-1 flex-col rounded-[20px] px-5 pt-5 pb-4">
        <div
          aria-hidden
          className="scout-card-texture pointer-events-none absolute inset-0 rounded-[20px]"
        />

        <div className="relative flex items-start justify-between">
          {/* Kart sabit yükseklikte: bayrak akışa girerse alt satır taşar. Avatarın kavisli köşesindeki boşluğa yerleşir. */}
          <div className="relative flex flex-col">
            <span className="scout-card-accent text-6xl leading-none font-bold tracking-tighter tabular-nums">
              {player.ovr}
            </span>
            <span lang="en" className="mt-1.5 text-xs font-semibold tracking-widest uppercase">
              {player.position}
            </span>
            {country && Flag ? (
              <Flag
                role="img"
                aria-label={countryName(country)}
                title={countryName(country)}
                className={cn(FLAG_CLASS, "absolute top-full left-0 mt-2 h-5")}
              />
            ) : null}
          </div>
          <span className="scout-card-chip rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase">
            {rarityLabel(player.rarity)}
          </span>
        </div>

        {/* Kart sabit yükseklikte: ad iki satıra sarılınca alt satır taşmasın diye boşluğu avatar küçülerek verir. */}
        <div className="relative mt-3 flex h-38 min-h-0 shrink justify-center">
          <img
            src={player.avatarUrl}
            alt={m.avatar_alt({ name: player.name })}
            crossOrigin="anonymous"
            width={152}
            height={152}
            className="scout-card-avatar aspect-square h-full w-auto rounded-full object-cover"
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
            data-card-club
            lang="en"
            className="scout-card-muted truncate font-semibold tracking-wide uppercase"
          >
            {clubLabel(player.club)}
          </span>
          {player.badges.length > 0 ? (
            <ul data-card-badges className="flex shrink-0 gap-1" aria-label={m.badges_heading()}>
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
