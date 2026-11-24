import {
  activeWeeks,
  automatedCommits,
  checkSuccessRate,
  creditedStars,
  externalPrs,
  isConventional,
  longestStreak,
  significantLanguages
} from "@/features/scout/helpers/compute-stats"
import type { Badge, PlayerFacts } from "@/features/scout/types/player.types"

/** 0-1 oranını 0-100 tam sayıya çevirir; biçimi (`%45` ya da `45%`) arayüz seçer. */
const percent = (value: number) => Math.round(value * 100)
const YEAR_MS = 365.25 * 24 * 60 * 60 * 1000
const TEAM_MIN_COMMITS = 10
const DOCUMENTED_README_BYTES = 1000

type LocalTime = { hour: number; weekday: number }

/** Saatler ya bir IANA saat dilimiyle ya da commit'lerden çıkarılan sabit UTC farkıyla yerelleştirilir. */
export type BadgeClock = { timeZone: string } | { offsetMinutes: number }

function localTime(date: string, clock: BadgeClock): LocalTime {
  if ("offsetMinutes" in clock) {
    const shifted = new Date(new Date(date).getTime() + clock.offsetMinutes * 60_000)
    return { hour: shifted.getUTCHours(), weekday: shifted.getUTCDay() }
  }
  const timeZone = clock.timeZone
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    hourCycle: "h23",
    weekday: "short"
  }).formatToParts(new Date(date))
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0)
  const weekdayName = parts.find((p) => p.type === "weekday")?.value ?? "Mon"
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekdayName)
  return { hour, weekday }
}

/**
 * Kural tabanlı rozetler; yalnızca başarıları ödüllendirir, genel puanı etkilemez. Metinler arayüzde dile göre yazılır.
 * Saat bazlı rozetler oyuncunun saat dilimine göre hesaplanır.
 */
export function computeBadges(facts: PlayerFacts, clock: BadgeClock | null, now: Date): Badge[] {
  const badges: Badge[] = []
  const commits = facts.commits
  const n = commits.length
  if (clock && n >= 30) {
    const times = commits.map((commit) => localTime(commit.date, clock))
    const night = times.filter((time) => time.hour < 6).length / n
    if (night >= 0.2) {
      badges.push({
        id: "night-owl",
        values: { pct: percent(night) }
      })
    }
    const early = times.filter((time) => time.hour >= 5 && time.hour < 9).length / n
    if (early >= 0.2) {
      badges.push({
        id: "early-bird",
        values: { pct: percent(early) }
      })
    }
    const weekend = times.filter((time) => time.weekday === 0 || time.weekday === 6).length / n
    if (weekend >= 0.3) {
      badges.push({
        id: "weekend-warrior",
        values: { pct: percent(weekend) }
      })
    }
  }

  const streak = longestStreak(facts.calendar)
  if (streak >= 30) {
    badges.push({
      id: "marathon",
      values: { days: streak }
    })
  }

  const checks = checkSuccessRate(facts)
  if (checks.total >= 10 && checks.rate >= 0.9) {
    badges.push({
      id: "green-tick",
      values: { total: checks.total, pct: percent(checks.rate) }
    })
  }

  const languages = significantLanguages(facts)
  if (languages.length >= 5) {
    badges.push({
      id: "polyglot",
      values: {
        count: languages.length,
        languages: languages.map((language) => language.name).join(", ")
      }
    })
  }

  if (n >= 30) {
    const conventional = commits.filter((commit) => isConventional(commit.message)).length / n
    if (conventional >= 0.8) {
      badges.push({
        id: "conventional-disciple",
        values: { pct: percent(conventional) }
      })
    }
  }

  const stars = Math.round(creditedStars(facts))
  if (stars >= 1000) {
    badges.push({
      id: "star-collector",
      values: { stars }
    })
  }

  const prs = externalPrs(facts)
  if (prs >= 20) {
    badges.push({
      id: "oss-ambassador",
      values: { prs }
    })
  }

  const active = facts.activeRepos.length
  const tested = facts.activeRepos.filter((repo) => repo.hasTests).length
  if (active >= 3 && tested / active >= 0.9) {
    badges.push({
      id: "test-obsessed",
      values: { active, tested }
    })
  }

  const humanCommits = facts.lastYear.commits - automatedCommits(facts)
  if (humanCommits >= 1000) {
    badges.push({
      id: "commit-machine",
      values: { commits: humanCommits }
    })
  }

  if (facts.lastYear.prs >= 100) {
    badges.push({
      id: "pr-machine",
      values: { prs: facts.lastYear.prs }
    })
  }

  if (facts.lastYear.reviews >= 100) {
    badges.push({
      id: "code-reviewer",
      values: { reviews: facts.lastYear.reviews }
    })
  }

  if (facts.followers >= 1000) {
    badges.push({
      id: "community-leader",
      values: { followers: facts.followers }
    })
  }

  const orgRepos = facts.activeRepos.filter(
    (repo) => repo.isOrg && repo.userYearCommits >= TEAM_MIN_COMMITS
  ).length
  if (orgRepos >= 2) {
    badges.push({
      id: "team-player",
      values: { repos: orgRepos, min: TEAM_MIN_COMMITS }
    })
  }

  const liveRepos = facts.ownedRepos.filter((repo) => !repo.isArchived)
  const documented = liveRepos.filter(
    (repo) => repo.hasDescription && repo.readmeBytes >= DOCUMENTED_README_BYTES
  ).length
  if (liveRepos.length >= 5 && documented / liveRepos.length >= 0.8) {
    badges.push({
      id: "documenter",
      values: { total: liveRepos.length, documented }
    })
  }

  const years = Math.floor((now.getTime() - new Date(facts.createdAt).getTime()) / YEAR_MS)
  if (years >= 10) {
    badges.push({
      id: "veteran",
      values: { years }
    })
  }

  const weeks = activeWeeks(facts.calendar)
  if (weeks >= 40) {
    badges.push({
      id: "regular",
      values: { weeks }
    })
  }

  return badges
}
