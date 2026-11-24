import {
  ACT,
  COM,
  CON,
  DISPLAY_CURVE,
  EXP,
  IMP,
  LANGUAGE_MIN_SHARE,
  REP
} from "@/features/scout/constants/scoring.constants"
import type {
  PlayerFacts,
  Stat,
  StatKey,
  StatPart,
  StatPartId,
  StatSummary
} from "@/features/scout/types/player.types"

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

/** 0'dan `fullAt`'e logaritmik ölçek: ilk adımlar hızlı, sonrası zorlaşır. `soft` ilk basamağı büyütür. */
const logScale = (value: number, fullAt: number, soft = 1) =>
  clamp01(Math.log10(1 + Math.max(0, value) / soft) / Math.log10(1 + fullAt / soft))

function part(id: StatPartId, ratio: number, max: number): StatPart {
  return { id, points: Math.round(clamp01(ratio) * max * 10) / 10, max }
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

function makeStat(summary: StatSummary, parts: StatPart[]): Stat {
  const raw = Math.min(
    100,
    parts.reduce((total, item) => total + item.points, 0)
  )
  return {
    key: summary.key,
    value: toDisplayScore(raw),
    raw,
    summary,
    parts
  }
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

/** Son 52 hafta; takvim 365-371 gün döndüğü için baştaki artık günler sayılmaz. */
export function activeWeeks(calendar: PlayerFacts["calendar"]): number {
  const days = calendar.slice(-52 * 7)
  let weeks = 0
  for (let start = 0; start < days.length; start += 7) {
    if (days.slice(start, start + 7).some((day) => day.count > 0)) weeks += 1
  }
  return weeks
}

/** Son 365 günde katkı olan gün sayısı. */
const activeDays = (calendar: PlayerFacts["calendar"]) =>
  calendar.slice(-365).filter((day) => day.count > 0).length

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

/** Kendi repoları: ayrıntılı liste ile en çok yıldızlı 100 repo birleşir, her repo bir kez. */
function ownedTotals(facts: PlayerFacts): { stars: number; forks: number } {
  const repos = new Map<string, { stars: number; forks: number }>()
  for (const repo of facts.ownedRepos) repos.set(repo.name.toLowerCase(), repo)
  for (const repo of facts.starredRepos ?? []) {
    if (!repos.has(repo.name.toLowerCase())) repos.set(repo.name.toLowerCase(), repo)
  }
  let stars = 0
  let forks = 0
  for (const repo of repos.values()) {
    stars += repo.stars
    forks += repo.forks
  }
  return { stars, forks }
}

export function creditedStars(facts: PlayerFacts) {
  return ownedTotals(facts).stars + orgCredits(facts).reduce((sum, credit) => sum + credit.stars, 0)
}

/** Tek repoda yıllık `repoYearCap` üstündeki commit'ler: insan temposunu aşan otomasyon. */
export function automatedCommits(facts: PlayerFacts): number {
  return (facts.repoCommits ?? []).reduce(
    (sum, repo) => sum + Math.max(0, repo.commits - ACT.repoYearCap),
    0
  )
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
  const days = facts.calendar.slice(-365)
  const raw = days.reduce((sum, day) => sum + day.count, 0)
  const capped = days.reduce((sum, day) => sum + Math.min(day.count, ACT.dailyCap), 0)
  // Takvim repo ayırmıyor; otomasyonun toplam içindeki payı kadar takvim küçültülür.
  const human = raw === 0 ? 1 : clamp01((raw - automatedCommits(facts)) / raw)
  const total = Math.round(capped * human)
  const { fullAt, soft, max } = ACT.contributions
  return makeStat({ key: "act", contributions: total }, [
    part("act_contributions", logScale(total, fullAt, soft), max)
  ])
}

function impact(facts: PlayerFacts): Stat {
  const credits = orgCredits(facts)
  const owned = ownedTotals(facts)
  const stars = owned.stars + credits.reduce((sum, credit) => sum + credit.stars, 0)
  const forks = owned.forks + credits.reduce((sum, credit) => sum + credit.forks, 0)

  return makeStat({ key: "imp", stars: Math.round(stars), forks: Math.round(forks) }, [
    part("imp_stars", logScale(stars, IMP.stars.fullAt), IMP.stars.max),
    part("imp_forks", logScale(forks, IMP.forks.fullAt), IMP.forks.max)
  ])
}

function community(facts: PlayerFacts): Stat {
  return makeStat({ key: "com", followers: facts.followers }, [
    part(
      "com_followers",
      logScale(facts.followers, COM.followers.fullAt, COM.followers.soft),
      COM.followers.max
    )
  ])
}

/** Başkasının projesinde birleştirilen PR'lar; maintainer olunan organizasyondakiler düşük ağırlıkla. */
export function externalPrs(facts: PlayerFacts): number {
  const ownOrg = Math.min(
    facts.mergedExternalPrs,
    (facts.ownOrgPrs ?? []).reduce((sum, item) => sum + item.prs, 0)
  )
  return Math.round(facts.mergedExternalPrs - ownOrg * (1 - REP.ownOrgPrWeight))
}

/** Ömür boyu review; yıllık kırılımı olmayan eski kayıtta son bir yıl. */
export function lifetimeReviews(facts: PlayerFacts): number {
  if (!facts.yearly.some((year) => year.reviews !== undefined)) return facts.lastYear.reviews
  return facts.yearly.reduce((sum, year) => sum + (year.reviews ?? 0), 0)
}

function respect(facts: PlayerFacts): Stat {
  const prs = externalPrs(facts)
  const reviews = lifetimeReviews(facts)
  return makeStat({ key: "rep", prs, reviews }, [
    part("rep_prs", logScale(prs, REP.externalPrs.fullAt), REP.externalPrs.max),
    part("rep_reviews", logScale(reviews, REP.reviews.fullAt), REP.reviews.max)
  ])
}

/** Yılın geçen kısmı (0-1); ocak ayında yeni yıl eksik sayılıp istikrar düşmesin diye. */
function yearElapsed(now: Date): number {
  const year = now.getUTCFullYear()
  const start = Date.UTC(year, 0, 1)
  return (now.getTime() - start) / (Date.UTC(year + 1, 0, 1) - start)
}

function consistency(facts: PlayerFacts, now: Date): Stat {
  const days = activeDays(facts.calendar)
  const streak = longestStreak(facts.calendar)
  const currentYear = now.getUTCFullYear()
  const recentYears = [...facts.yearly].sort((a, b) => b.year - a.year).slice(0, CON.years.span)
  const activeYears = recentYears.filter(
    (year) =>
      year.total >= CON.years.minContributions * (year.year === currentYear ? yearElapsed(now) : 1)
  )

  return makeStat({ key: "con", days, streak }, [
    part("con_days", days / CON.activeDays.fullAt, CON.activeDays.max),
    part("con_streak", logScale(streak, CON.streak.fullAt), CON.streak.max),
    part("con_years", activeYears.length / CON.years.span, CON.years.max)
  ])
}

function career(facts: PlayerFacts): Stat {
  const { fullAt, soft, max, yearCap } = EXP.lifetime
  const lifetime = facts.yearly.reduce((sum, year) => sum + Math.min(year.total, yearCap), 0)
  const years = facts.yearly.filter((year) => year.total >= EXP.activeYears.minContributions).length

  return makeStat({ key: "exp", years, contributions: lifetime }, [
    part("exp_lifetime", logScale(lifetime, fullAt, soft), max),
    part("exp_years", years / EXP.activeYears.fullAt, EXP.activeYears.max)
  ])
}

export function computeStats(facts: PlayerFacts, now: Date): Record<StatKey, Stat> {
  return {
    act: activity(facts),
    imp: impact(facts),
    com: community(facts),
    rep: respect(facts),
    con: consistency(facts, now),
    exp: career(facts)
  }
}
