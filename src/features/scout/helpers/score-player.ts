import {
  FULL_STACK_MIN_SHARE,
  LANGUAGE_GROUPS,
  RARITY_THRESHOLDS,
  STAT_WEIGHTS
} from "@/features/scout/constants/scoring.constants"
import {
  TITLE_PREFIX_BY_BADGE,
  TITLE_PREFIX_BY_RARITY,
  TITLE_SUFFIX_BY_STAT
} from "@/features/scout/constants/titles.constants"
import { computeBadges } from "@/features/scout/helpers/compute-badges"
import type { BadgeClock } from "@/features/scout/helpers/compute-badges"
import {
  computeStats,
  languageShares,
  toDisplayScore
} from "@/features/scout/helpers/compute-stats"
import type {
  Badge,
  PlayerFacts,
  Position,
  Rarity,
  ScoredPlayer,
  Stat,
  StatKey,
  StoredPlayer
} from "@/features/scout/types/player.types"

/** Aynı kullanıcıya her seferinde aynı seçimi yapmak için basit, kararlı bir hash. */
function hash(text: string): number {
  let value = 0
  for (const char of text.toLowerCase()) {
    value = (value * 31 + char.charCodeAt(0)) >>> 0
  }
  return value
}

function pick<T>(items: readonly T[], seed: number, fallback: T): T {
  return items[seed % items.length] ?? fallback
}

export function computePosition(facts: PlayerFacts): Position {
  const totals = new Map<Exclude<Position, "Full Stack">, number>()
  for (const language of languageShares(facts)) {
    const group = LANGUAGE_GROUPS[language.name]
    if (!group) continue
    totals.set(group, (totals.get(group) ?? 0) + language.share)
  }
  const known = [...totals.values()].reduce((sum, share) => sum + share, 0)
  if (known === 0) return "Full Stack"

  const share = (group: Exclude<Position, "Full Stack">) => (totals.get(group) ?? 0) / known
  if (share("Frontend") >= FULL_STACK_MIN_SHARE && share("Backend") >= FULL_STACK_MIN_SHARE) {
    return "Full Stack"
  }

  let best: Exclude<Position, "Full Stack"> = "Frontend"
  let bestShare = -1
  for (const [group, value] of totals) {
    if (value > bestShare) {
      best = group
      bestShare = value
    }
  }
  return best
}

function computeClub(facts: PlayerFacts): string {
  const company = facts.company?.trim().replace(/^@/, "").split(/[\s,]/)[0]
  if (company) return company
  return facts.topOrg ?? "Serbest"
}

export function computeOvr(stats: Record<StatKey, Stat>): number {
  const keys = Object.keys(STAT_WEIGHTS).filter((key): key is StatKey => key in stats)
  const raw = keys.reduce((sum, key) => sum + stats[key].raw * STAT_WEIGHTS[key], 0)
  return toDisplayScore(raw)
}

export function computeRarity(ovr: number): Rarity {
  return RARITY_THRESHOLDS.find((threshold) => ovr >= threshold.min)?.rarity ?? "bronze"
}

function computeTitle(
  login: string,
  stats: Record<StatKey, Stat>,
  badges: Badge[],
  rarity: Rarity
): string {
  const seed = hash(login)
  const prefixPool =
    badges.map((badge) => TITLE_PREFIX_BY_BADGE[badge.id]).find((pool) => pool !== undefined) ??
    TITLE_PREFIX_BY_RARITY[rarity]

  const topStat = Object.values(stats).reduce((best, stat) => (stat.raw > best.raw ? stat : best))
  const prefix = pick(prefixPool, seed, "Yükselen")
  const suffix = pick(TITLE_SUFFIX_BY_STAT[topStat.key], seed >>> 3, "Oyuncu")
  return `${prefix} ${suffix}`
}

/** Saklanan gerçeklerden kartın tamamını üretir. Saf fonksiyon: aynı girdi, aynı kart. */
export function scorePlayer(player: StoredPlayer, now = new Date()): ScoredPlayer {
  const { facts } = player
  const stats = computeStats(facts, now)
  const ovr = computeOvr(stats)
  const rarity = computeRarity(ovr)
  // Yerel saat bilinmiyorsa saat rozetleri hiç verilmez; varsayılan bir dilim yanlış rozet üretir.
  const clock: BadgeClock | null = player.timezone
    ? { timeZone: player.timezone }
    : facts.utcOffsetMinutes != null
      ? { offsetMinutes: facts.utcOffsetMinutes }
      : null
  const badges = computeBadges(facts, clock, now)

  return {
    login: facts.login,
    name: facts.name?.trim() || facts.login,
    avatarUrl: facts.avatarUrl,
    club: computeClub(facts),
    position: computePosition(facts),
    ovr,
    rarity,
    title: computeTitle(facts.login, stats, badges, rarity),
    stats,
    badges,
    fetchedAt: player.fetchedAt
  }
}
