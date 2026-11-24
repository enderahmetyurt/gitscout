import { Info } from "lucide-react"

import {
  ACT,
  COM,
  CON,
  EXP,
  FULL_STACK_MIN_SHARE,
  IMP,
  REP,
  STAT_ORDER,
  STAT_WEIGHTS
} from "@/features/scout/constants/scoring.constants"
import { number, percent, rarityLabel, statLabel } from "@/features/scout/helpers/player-text"
import { rarityRange } from "@/features/scout/helpers/rarity-range"
import { RARITIES } from "@/features/scout/schemas/leaderboard-search.schema"
import type { StatKey } from "@/features/scout/types/player.types"
import * as m from "@/paraglide/messages.js"

/** Sayılar puanlama sabitlerinden okunur; formül değişince sayfa da kendiliğinden güncellenir. */
function statDescription(key: StatKey): string {
  switch (key) {
    case "act":
      return m.about_stat_act({ full: number(ACT.contributions.fullAt) })
    case "imp":
      return m.about_stat_imp({ stars: number(IMP.stars.fullAt) })
    case "com":
      return m.about_stat_com({ full: number(COM.followers.fullAt) })
    case "rep":
      return m.about_stat_rep({ prs: number(REP.externalPrs.fullAt) })
    case "con":
      return m.about_stat_con({ years: number(CON.years.span) })
    case "exp":
      return m.about_stat_exp({ years: number(EXP.accountAge.fullAtYears) })
  }
}

export function AboutPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-4 pt-10 pb-20 outline-none sm:px-6"
    >
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold tracking-tight text-balance">{m.about_title()}</h1>
        <p className="text-pretty text-muted-foreground">{m.about_lead()}</p>
        <p className="surface flex items-start gap-2 px-4 py-3 text-sm text-pretty">
          <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          {m.about_disclaimer()}
        </p>
      </div>

      <section className="flex flex-col gap-4" aria-labelledby="about-stats">
        <h2 id="about-stats" className="text-xl font-semibold">
          {m.about_stats_title()}
        </h2>
        <p className="text-sm text-pretty text-muted-foreground">{m.about_stats_intro()}</p>
        <dl className="surface divide-y overflow-hidden">
          {STAT_ORDER.map((key) => (
            <div key={key} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:gap-4">
              <dt className="flex shrink-0 flex-col sm:w-40">
                <span className="font-medium">{statLabel(key)}</span>
                <span className="text-xs text-muted-foreground">
                  {m.about_weight({ weight: percent(STAT_WEIGHTS[key] * 100) })}
                </span>
              </dt>
              <dd className="text-sm text-pretty text-muted-foreground">{statDescription(key)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="about-ovr">
        <h2 id="about-ovr" className="text-xl font-semibold">
          {m.about_ovr_title()}
        </h2>
        <p className="text-sm text-pretty text-muted-foreground">{m.about_ovr_body()}</p>
        <ul className="flex flex-wrap gap-2">
          {RARITIES.map((rarity) => (
            <li key={rarity} className="surface flex items-center gap-2 px-3 py-1.5 text-sm">
              <span aria-hidden data-rarity={rarity} className="rarity-dot size-2.5 rounded-full" />
              {m.about_rarity({ rarity: rarityLabel(rarity), range: rarityRange(rarity) })}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="about-position">
        <h2 id="about-position" className="text-xl font-semibold">
          {m.about_position_title()}
        </h2>
        <p className="text-sm text-pretty text-muted-foreground">{m.about_position_body()}</p>
        <ul className="surface flex flex-col gap-1.5 px-4 py-3 text-sm text-muted-foreground">
          {m
            .about_position_groups()
            .split(" · ")
            .map((group) => (
              <li key={group} className="text-pretty">
                {group}
              </li>
            ))}
        </ul>
        <p className="text-sm text-pretty text-muted-foreground">
          {m.about_position_fullstack({ share: percent(FULL_STACK_MIN_SHARE * 100) })}
        </p>
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="about-badges">
        <h2 id="about-badges" className="text-xl font-semibold">
          {m.about_badges_title()}
        </h2>
        <p className="text-sm text-pretty text-muted-foreground">{m.about_badges_body()}</p>
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="about-data">
        <h2 id="about-data" className="text-xl font-semibold">
          {m.about_data_title()}
        </h2>
        <p className="text-sm text-pretty text-muted-foreground">{m.about_data_body()}</p>
      </section>
    </main>
  )
}
