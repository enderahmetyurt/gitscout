import { useEffect } from "react"
import type { ReactNode } from "react"

import { useLocation } from "@tanstack/react-router"
import { ExternalLink, Info } from "lucide-react"
import { cn } from "cn"

import { siteConfig } from "@/config/site.config"

import {
  ACT,
  COM,
  CON,
  EXP,
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

const STAT_DESCRIPTIONS: Record<StatKey, () => string> = {
  act: m.about_stat_act,
  imp: m.about_stat_imp,
  com: m.about_stat_com,
  rep: m.about_stat_rep,
  con: m.about_stat_con,
  exp: m.about_stat_exp
}

/** Tam puan eşikleri puanlama sabitlerinden okunur; formül değişince sayfa da güncellenir. */
function fullMarks(key: StatKey): string {
  switch (key) {
    case "act":
      return m.about_full_act({ full: number(ACT.contributions.fullAt) })
    case "imp":
      return m.about_full_imp({
        stars: number(IMP.stars.fullAt),
        forks: number(IMP.forks.fullAt)
      })
    case "com":
      return m.about_full_com({ full: number(COM.followers.fullAt) })
    case "rep":
      return m.about_full_rep({
        prs: number(REP.externalPrs.fullAt),
        reviews: number(REP.reviews.fullAt)
      })
    case "con":
      return m.about_full_con({ years: number(CON.years.span) })
    case "exp":
      return m.about_full_exp({
        years: number(EXP.activeYears.fullAt),
        full: number(EXP.lifetime.fullAt)
      })
  }
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3" aria-labelledby={id}>
      <h2 id={id} className="text-xl font-semibold">
        {title}
      </h2>
      {children}
    </section>
  )
}

const bodyClass = "text-sm text-pretty text-muted-foreground"

export function AboutPage() {
  const hash = useLocation({ select: (location) => location.hash })

  // Oyuncu sayfasındaki "kartını kaldır" bağlantısı ilgili maddeye iner. Yönlendirici sayfa geçişinden
  // sonra kaydırmayı sıfırladığı için kaydırma bir sonraki turda yapılır.
  useEffect(() => {
    if (!hash) return
    const timer = setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ block: "start" })
    }, 100)
    return () => clearTimeout(timer)
  }, [hash])

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

      <Section id="about-stats" title={m.about_stats_title()}>
        <p className={bodyClass}>{m.about_stats_intro()}</p>
        <dl className="surface divide-y overflow-hidden">
          {STAT_ORDER.map((key) => (
            <div key={key} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:gap-4">
              <dt className="flex shrink-0 flex-col sm:w-40">
                <span className="font-medium">{statLabel(key)}</span>
                <span className="text-xs text-muted-foreground">
                  {m.about_weight({ weight: percent(STAT_WEIGHTS[key] * 100) })}
                </span>
              </dt>
              <dd className={cn("flex flex-col gap-1", bodyClass)}>
                <span>{STAT_DESCRIPTIONS[key]()}</span>
                <span className="text-xs">{fullMarks(key)}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="about-ovr" title={m.about_ovr_title()}>
        <p className={bodyClass}>{m.about_ovr_body()}</p>
        <ul className="flex flex-wrap gap-2">
          {RARITIES.map((rarity) => (
            <li key={rarity} className="surface flex items-center gap-2 px-3 py-1.5 text-sm">
              <span aria-hidden data-rarity={rarity} className="rarity-dot size-2.5 rounded-full" />
              {m.about_rarity({ rarity: rarityLabel(rarity), range: rarityRange(rarity) })}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="about-position" title={m.about_position_title()}>
        <p className={bodyClass}>{m.about_position_body()}</p>
      </Section>

      <Section id="about-badges" title={m.about_badges_title()}>
        <p className={bodyClass}>{m.about_badges_body()}</p>
      </Section>

      <Section id="about-privacy" title={m.about_privacy_title()}>
        <ul className={cn("flex list-disc flex-col gap-2 pl-5", bodyClass)}>
          <li>{m.about_privacy_source()}</li>
          <li>{m.about_privacy_private()}</li>
        </ul>
        {/* "Kartının kaldırılmasını mı istiyorsun?" bağlantıları buraya iner; aynı kırmızıyla eşleşir. */}
        <div id="remove-card" className="flex scroll-mt-24 flex-col gap-1">
          <h3 className="text-sm font-semibold text-destructive">{m.remove_card_link()}</h3>
          <p className={bodyClass}>
            {m.about_privacy_removal()}{" "}
            <a
              href={`${siteConfig.links.github}/issues/new`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-medium text-foreground underline underline-offset-4 hover:no-underline"
            >
              {m.about_privacy_issue()}
              <ExternalLink aria-hidden className="size-3.5" />
              <span className="sr-only">{m.new_tab()}</span>
            </a>
          </p>
        </div>
      </Section>
    </main>
  )
}
