import { useEffect } from "react"
import type { ReactNode } from "react"

import { useLocation } from "@tanstack/react-router"
import { ExternalLink } from "lucide-react"

import { siteConfig } from "@/config/site.config"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { RarityLegend } from "@/features/scout/components/RarityLegend"
import {
  ACT,
  COM,
  FULL_STACK_MIN_SHARE,
  IMP,
  REFRESH,
  REP,
  STAT_ORDER,
  STAT_WEIGHTS
} from "@/features/scout/constants/scoring.constants"
import { number, percent, statLabel } from "@/features/scout/helpers/player-text"
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

/** Sayılar sabitlerden okunur; mesajlar render sırasında çağrıldığı için dil değişince güncellenir. */
function faqItems() {
  return [
    { id: "low", question: m.about_faq_low_q(), answer: m.about_faq_low_a() },
    {
      id: "refresh",
      question: m.about_faq_refresh_q(),
      answer: m.about_faq_refresh_a({ days: REFRESH.maxAgeDays })
    },
    {
      id: "bots",
      question: m.about_faq_bots_q(),
      answer: m.about_faq_bots_a({
        daily: number(ACT.dailyCap),
        repo: number(ACT.repoYearCap)
      })
    },
    {
      id: "org",
      question: m.about_faq_org_q(),
      answer: m.about_faq_org_a({
        share: percent(IMP.orgFullShare * 100),
        weight: percent(REP.ownOrgPrWeight * 100)
      })
    },
    {
      id: "role",
      question: m.about_faq_role_q(),
      answer: m.about_faq_role_a({ share: percent(FULL_STACK_MIN_SHARE * 100) })
    }
  ]
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
      </div>

      <Section id="about-story" title={m.about_story_title()}>
        <p className={bodyClass}>{m.about_story_1()}</p>
      </Section>

      <Section id="about-stats" title={m.about_stats_title()}>
        <p className={bodyClass}>{m.about_score_intro()}</p>
        <dl className="surface divide-y">
          {STAT_ORDER.map((key) => (
            <div
              key={key}
              className="grid grid-cols-[1fr_auto] items-baseline gap-x-3 gap-y-0.5 px-4 py-2.5 text-sm sm:grid-cols-[6.5rem_1fr_auto]"
            >
              <dt className="order-1 font-medium">{statLabel(key)}</dt>
              <dd className="order-2 text-muted-foreground tabular-nums sm:order-3">
                {percent(STAT_WEIGHTS[key] * 100)}
              </dd>
              <dd className="order-3 col-span-2 text-pretty text-muted-foreground sm:order-2 sm:col-span-1">
                {STAT_DESCRIPTIONS[key]()}
              </dd>
            </div>
          ))}
        </dl>
        <p className={bodyClass}>
          {m.about_score_note({ followers: number(COM.followers.fullAt) })}
        </p>
        <RarityLegend />
      </Section>

      <Section id="about-faq" title={m.about_faq_title()}>
        <Accordion className="surface px-4">
          {faqItems().map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent className="text-pretty text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>

      <Section id="about-privacy" title={m.about_privacy_title()}>
        <p className={bodyClass}>{m.about_privacy_body()}</p>
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
