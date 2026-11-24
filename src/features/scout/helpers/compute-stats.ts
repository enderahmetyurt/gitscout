import {
  ACT,
  COM,
  CON,
  DISPLAY_CURVE,
  EXP,
  IMP,
  LANGUAGE_MIN_SHARE,
  REP,
  STAT_LABELS
} from "@/features/scout/constants/scoring.constants"
import type { PlayerFacts, Stat, StatKey, StatPart } from "@/features/scout/types/player.types"

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
const pct = (value: number) => `%${Math.round(value * 100)}`
const fmt = (value: number) => Math.round(value).toLocaleString("tr-TR")
const YEAR_MS = 365.25 * 24 * 60 * 60 * 1000

/** 0'dan `fullAt`'e logaritmik ölçek: ilk adımlar hızlı, sonrası zorlaşır. */
const logScale = (value: number, fullAt: number) =>
  clamp01(Math.log10(Math.max(0, value) + 1) / Math.log10(fullAt + 1))

function part(label: string, detail: string, ratio: number, max: number): StatPart {
  return { label, detail, points: Math.round(clamp01(ratio) * max * 10) / 10, max }
}

/** Ham puanı FIFA ölçeğine taşır; `DISPLAY_CURVE` noktaları arasında doğrusal. */
export function toDisplayScore(raw: number): number {
  const value = Math.min(100, Math.max(0, raw))
  for (let index = 1; index < DISPLAY_CURVE.length; index += 1) {
    const [x0, y0] = DISPLAY_CURVE[index - 1] ?? [0, 0]
    const [x1, y1] = DISPLAY_CURVE[index] ?? [100, 100]
    if (value <= x1) return Math.round(y0 + ((value - x0) / (x1 - x0)) * (y1 - y0))
  }
  return Math.round(DISPLAY_CURVE[DISPLAY_CURVE.length - 1]?.[1] ?? value)
}

function makeStat(key: StatKey, summary: string, parts: StatPart[]): Stat {
  const raw = Math.min(
    100,
    parts.reduce((total, item) => total + item.points, 0)
  )
  return { key, ...STAT_LABELS[key], value: toDisplayScore(raw), raw, summary, parts }
}

/* ---------- Ortak ölçümler (rozetler ve unvanlar da kullanır) ---------- */

const CONVENTIONAL =
  /^(feat|fix|chore|docs|refactor|test|tests|style|perf|build|ci|revert)(\([^)]+\))?!?: \S/

export const isConventional = (message: string) => CONVENTIONAL.test(message.trim())

export function longestStreak(calendar: PlayerFacts["calendar"]): number {
  let best = 0
  let current = 0
  for (const day of calendar) {
    current = day.count > 0 ? current + 1 : 0
    best = Math.max(best, current)
  }
  return best
}

export function activeWeeks(calendar: PlayerFacts["calendar"]): number {
  let weeks = 0
  for (let start = 0; start < calendar.length; start += 7) {
    if (calendar.slice(start, start + 7).some((day) => day.count > 0)) weeks += 1
  }
  return weeks
}

export function checkSuccessRate(facts: PlayerFacts): { rate: number; total: number } {
  let success = 0
  let total = 0
  for (const repo of facts.activeRepos) {
    for (const state of repo.checkStates) {
      if (state === "PENDING" || state === "EXPECTED") continue
      total += 1
      if (state === "SUCCESS") success += 1
    }
  }
  return { rate: total === 0 ? 0 : success / total, total }
}

type OrgCredit = { repo: string; stars: number; forks: number; share: number; credit: number }

/** Organizasyon repolarında son bir yılın commit payı; payı yüksek olan maintainer yıldızların tamamını alır. */
function orgCredits(facts: PlayerFacts): OrgCredit[] {
  return facts.activeRepos
    .filter((repo) => repo.isOrg && repo.yearCommits > 0 && repo.userYearCommits > 0)
    .map((repo) => {
      const share = Math.min(1, repo.userYearCommits / repo.yearCommits)
      const credit = clamp01(share / IMP.orgFullShare)
      return {
        repo: repo.nameWithOwner,
        stars: repo.stars * credit,
        forks: repo.forks * credit,
        share,
        credit
      }
    })
    .sort((a, b) => b.stars - a.stars)
}

export function creditedStars(facts: PlayerFacts) {
  const owned = facts.ownedRepos.reduce((sum, repo) => sum + repo.stars, 0)
  return owned + orgCredits(facts).reduce((sum, credit) => sum + credit.stars, 0)
}

/** Dil payları: kendi repoları ve aktif organizasyon repoları birlikte, her repo bir kez. */
function languageShares(facts: PlayerFacts): { name: string; share: number }[] {
  const sizes = new Map<string, number>()
  const add = (languages: { name: string; size: number }[]) => {
    for (const language of languages) {
      sizes.set(language.name, (sizes.get(language.name) ?? 0) + language.size)
    }
  }
  const ownedNames = new Set(
    facts.ownedRepos.map((repo) => `${facts.login}/${repo.name}`.toLowerCase())
  )
  for (const repo of facts.ownedRepos) add(repo.languages)
  for (const repo of facts.activeRepos) {
    if (repo.isOrg && !ownedNames.has(repo.nameWithOwner.toLowerCase())) add(repo.languages)
  }

  const total = [...sizes.values()].reduce((sum, size) => sum + size, 0)
  if (total === 0) return []
  return [...sizes.entries()]
    .map(([name, size]) => ({ name, share: size / total }))
    .sort((a, b) => b.share - a.share)
}

export const significantLanguages = (facts: PlayerFacts) =>
  languageShares(facts).filter((language) => language.share >= LANGUAGE_MIN_SHARE)

/* ---------- Statlar ---------- */

function activity(facts: PlayerFacts): Stat {
  const { commits, prs, reviews, issues, restricted } = facts.lastYear
  const total = commits + prs + reviews + issues + restricted
  return makeStat("act", `Son 1 yılda ${fmt(total)} katkı`, [
    part(
      "Son 1 yıl katkı",
      `${fmt(total)} katkı: ${fmt(commits)} commit, ${fmt(prs)} PR, ${fmt(reviews)} review, ${fmt(issues)} issue${restricted > 0 ? `, ${fmt(restricted)} private` : ""}. Tam puan: ${fmt(ACT.contributions.fullAt)}`,
      logScale(total, ACT.contributions.fullAt),
      ACT.contributions.max
    )
  ])
}

function impact(facts: PlayerFacts): Stat {
  const ownedStars = facts.ownedRepos.reduce((sum, repo) => sum + repo.stars, 0)
  const ownedForks = facts.ownedRepos.reduce((sum, repo) => sum + repo.forks, 0)
  const credits = orgCredits(facts)
  const orgStars = credits.reduce((sum, credit) => sum + credit.stars, 0)
  const orgForks = credits.reduce((sum, credit) => sum + credit.forks, 0)
  const topOrg = credits[0]
  const orgDetail =
    orgStars >= 1
      ? ` + ${fmt(orgStars)} organizasyon payı${topOrg ? ` (en çok: ${topOrg.repo}, commit payı ${pct(topOrg.share)})` : ""}`
      : ""

  return makeStat(
    "imp",
    `${fmt(ownedStars + orgStars)} yıldız, ${fmt(ownedForks + orgForks)} fork`,
    [
      part(
        "Yıldız",
        `${fmt(ownedStars)} kendi repolarından${orgDetail}. Tam puan: ${fmt(IMP.stars.fullAt)}`,
        logScale(ownedStars + orgStars, IMP.stars.fullAt),
        IMP.stars.max
      ),
      part(
        "Fork",
        `${fmt(ownedForks + orgForks)} fork. Tam puan: ${fmt(IMP.forks.fullAt)}`,
        logScale(ownedForks + orgForks, IMP.forks.fullAt),
        IMP.forks.max
      )
    ]
  )
}

function community(facts: PlayerFacts): Stat {
  return makeStat("com", `${fmt(facts.followers)} takipçi`, [
    part(
      "Takipçi",
      `${fmt(facts.followers)} takipçi. Tam puan: ${fmt(COM.followers.fullAt)}`,
      logScale(facts.followers, COM.followers.fullAt),
      COM.followers.max
    )
  ])
}

function respect(facts: PlayerFacts): Stat {
  return makeStat(
    "rep",
    `Başka repolara ${fmt(facts.mergedExternalPrs)} kabul edilen PR, son 1 yılda ${fmt(facts.lastYear.reviews)} review`,
    [
      part(
        "Kabul edilen PR",
        `Başkalarının repolarına ${fmt(facts.mergedExternalPrs)} merge edilmiş PR (tüm zamanlar). Tam puan: ${fmt(REP.externalPrs.fullAt)}`,
        logScale(facts.mergedExternalPrs, REP.externalPrs.fullAt),
        REP.externalPrs.max
      ),
      part(
        "Code review",
        `Son 1 yılda ${fmt(facts.lastYear.reviews)} review. Tam puan: ${fmt(REP.reviews.fullAt)}`,
        logScale(facts.lastYear.reviews, REP.reviews.fullAt),
        REP.reviews.max
      )
    ]
  )
}

function consistency(facts: PlayerFacts): Stat {
  const weeks = activeWeeks(facts.calendar)
  const streak = longestStreak(facts.calendar)
  const recentYears = [...facts.yearly].sort((a, b) => b.year - a.year).slice(0, CON.years.span)
  const activeYears = recentYears.filter((year) => year.total >= CON.years.minContributions)

  return makeStat("con", `52 haftanın ${weeks}'inde aktif, en uzun seri ${streak} gün`, [
    part(
      "Aktif hafta",
      `Son 52 haftanın ${weeks}'inde katkı var. Tam puan: ${CON.activeWeeks.fullAt}`,
      weeks / CON.activeWeeks.fullAt,
      CON.activeWeeks.max
    ),
    part(
      "En uzun seri",
      `${streak} gün üst üste. Tam puan: ${CON.streak.fullAt} gün`,
      logScale(streak, CON.streak.fullAt),
      CON.streak.max
    ),
    part(
      "Aktif yıllar",
      `Son ${CON.years.span} yılın ${activeYears.length}'inde ${CON.years.minContributions}+ katkı (${recentYears
        .map((year) => `${year.year}: ${fmt(year.total)}`)
        .join(", ")})`,
      activeYears.length / CON.years.span,
      CON.years.max
    )
  ])
}

function career(facts: PlayerFacts, now: Date): Stat {
  const lifetime = facts.yearly.reduce((sum, year) => sum + year.total, 0)
  const age = Math.max(0, (now.getTime() - new Date(facts.createdAt).getTime()) / YEAR_MS)
  const firstYear = new Date(facts.createdAt).getUTCFullYear()

  return makeStat("exp", `${age.toFixed(0)} yıllık hesap, toplam ${fmt(lifetime)} katkı`, [
    part(
      "Toplam katkı",
      `${firstYear}'den bu yana ${fmt(lifetime)} katkı. Tam puan: ${fmt(EXP.lifetime.fullAt)}`,
      logScale(lifetime, EXP.lifetime.fullAt),
      EXP.lifetime.max
    ),
    part(
      "Hesap yaşı",
      `${age.toFixed(1)} yıl. Tam puan: ${EXP.accountAge.fullAtYears} yıl`,
      age / EXP.accountAge.fullAtYears,
      EXP.accountAge.max
    )
  ])
}

export function computeStats(facts: PlayerFacts, now: Date): Record<StatKey, Stat> {
  return {
    act: activity(facts),
    imp: impact(facts),
    com: community(facts),
    rep: respect(facts),
    con: consistency(facts),
    exp: career(facts, now)
  }
}
