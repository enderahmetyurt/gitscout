import {
  FULL_STACK_MIN_SHARE,
  LANGUAGE_GROUPS,
  RARITY_THRESHOLDS,
  STAT_ORDER,
  STAT_WEIGHTS
} from "@/features/scout/constants/scoring.constants"
import { computeArchetype } from "@/features/scout/helpers/archetype"
import { computeBadges } from "@/features/scout/helpers/compute-badges"
import type { BadgeClock } from "@/features/scout/helpers/compute-badges"
import {
  computeStats,
  creditedStars,
  longestStreak,
  toDisplayScore
} from "@/features/scout/helpers/compute-stats"
import type {
  PlayerFacts,
  PlayerRanking,
  Position,
  PositionBreakdown,
  Rarity,
  RoleGroup,
  ScoredPlayer,
  Stat,
  StatKey,
  StoredPlayer,
  TitleRef,
  TopRepo
} from "@/features/scout/types/player.types"

/** Her stat ve nadirlik için kaç unvan seçeneği var; metinler mesaj dosyalarında. */
const TITLE_VARIANTS = 3

/** En yüksek stata bu kadar yakın statlar unvan için eşit sayılır. */
const TITLE_TIE_MARGIN = 1

/** Python bu dillerle aynı repodaysa veri/yapay zekâ işidir. */
const DATA_MARKERS = new Set(["Jupyter Notebook", "Cuda"])
/** Repo adı bunlardan birini içeriyorsa Python yine veri/yapay zekâ işidir (ör. nanoGPT, turkish-llm). */
const DATA_NAME =
  /gpt|llm|nlp|neural|learning|keras|torch|tensorflow|transformer|diffusion|bert|analy[sz]|predict|forecast|(^|[-_.])(ml|ai|rag|data)([-_.]|$)/i
/** C# bu dillerle aynı repodaysa oyun motoru işidir (Unity, Godot); değilse .NET backend. */
const GAME_MARKERS = new Set(["ShaderLab", "HLSL", "GLSL", "GDScript"])
/** Python repolarının (ağırlıklı) bu kadarı veri işaretliyse oyuncunun bütün Python'u Data sayılır. */
const DATA_PROFILE_SHARE = 0.3

/** Yıldızsız deneme repoları neredeyse hiç saymaz; popüler repolar logaritmik olarak ağır basar. */
const repoWeight = (stars: number) => 0.1 + Math.log10(1 + stars)

/**
 * Her repo kendi dil dağılımıyla, yıldızına göre ağırlıklı katkı yapar.
 * Toplam bayta bakmak, üretilmiş dev bir HTML dosyası olan tek bir reponun bütün profili ele geçirmesine yol açıyordu.
 */
export function computePositionBreakdown(facts: PlayerFacts): PositionBreakdown {
  const ownedNames = new Set(
    facts.ownedRepos.map((repo) => `${facts.login}/${repo.name}`.toLowerCase())
  )
  const repos = [
    ...facts.ownedRepos,
    ...facts.activeRepos.filter(
      (repo) => repo.isOrg && !ownedNames.has(repo.nameWithOwner.toLowerCase())
    )
  ].filter((repo) => repo.languages.some((language) => language.size > 0))
  type Repo = (typeof repos)[number]
  const repoName = (repo: Repo) => ("name" in repo ? repo.name : repo.nameWithOwner)
  const hasData = (repo: Repo) =>
    repo.languages.some((language) => DATA_MARKERS.has(language.name)) ||
    DATA_NAME.test(repoName(repo))
  const hasGame = (repo: Repo) => repo.languages.some((language) => GAME_MARKERS.has(language.name))
  const pythonRepos = repos.filter((repo) =>
    repo.languages.some((language) => language.name === "Python")
  )
  const pythonWeight = pythonRepos.reduce((sum, repo) => sum + repoWeight(repo.stars), 0)
  const dataWeight = pythonRepos
    .filter(hasData)
    .reduce((sum, repo) => sum + repoWeight(repo.stars), 0)
  const isDataProfile = pythonWeight > 0 && dataWeight / pythonWeight >= DATA_PROFILE_SHARE

  const roles = new Map<RoleGroup, number>()
  const languages = new Map<string, { group: RoleGroup | null; weight: number; repos: number }>()
  let total = 0
  for (const repo of repos) {
    const size = repo.languages.reduce((sum, language) => sum + language.size, 0)
    const weight = repoWeight(repo.stars)
    const pythonIsData = isDataProfile || hasData(repo)
    const csharpIsGame = hasGame(repo)
    for (const language of repo.languages) {
      if (language.size === 0) continue
      const group =
        (language.name === "Python" && pythonIsData
          ? "Data"
          : language.name === "C#" && csharpIsGame
            ? "Game Dev"
            : LANGUAGE_GROUPS[language.name]) ?? null
      const value = (language.size / size) * weight
      total += value
      const entry = languages.get(language.name) ?? { group, weight: 0, repos: 0 }
      entry.weight += value
      entry.repos += 1
      if (group) {
        entry.group = group
        roles.set(group, (roles.get(group) ?? 0) + value)
      }
      languages.set(language.name, entry)
    }
  }

  const known = [...roles.values()].reduce((sum, value) => sum + value, 0)
  return {
    repoCount: repos.length,
    pythonAsData: isDataProfile,
    roles: [...roles.entries()]
      .map(([group, value]) => ({ group, share: known === 0 ? 0 : value / known }))
      .sort((a, b) => b.share - a.share),
    languages: [...languages.entries()]
      .map(([name, entry]) => ({
        name,
        group: entry.group,
        share: total === 0 ? 0 : entry.weight / total,
        repos: entry.repos
      }))
      .sort((a, b) => b.share - a.share)
  }
}

function positionFrom(breakdown: PositionBreakdown): Position {
  const [top] = breakdown.roles
  if (!top) return "Full Stack"
  const share = (group: RoleGroup) =>
    breakdown.roles.find((role) => role.group === group)?.share ?? 0
  if (share("Frontend") >= FULL_STACK_MIN_SHARE && share("Backend") >= FULL_STACK_MIN_SHARE) {
    return "Full Stack"
  }
  return top.group
}

export function computePosition(facts: PlayerFacts): Position {
  return positionFrom(computePositionBreakdown(facts))
}

const TOP_REPO_COUNT = 3

const mainLanguage = (languages: { name: string; size: number }[]) =>
  languages.reduce<{ name: string; size: number } | null>(
    (best, language) => (best && best.size >= language.size ? best : language),
    null
  )?.name ?? null

/** Kendi repoları ve katkı verdiği organizasyon repoları arasından en çok yıldız alanlar. */
export function computeTopRepos(facts: PlayerFacts): TopRepo[] {
  const owned = facts.ownedRepos.map((repo) => ({
    fullName: `${facts.login}/${repo.name}`,
    stars: repo.stars,
    forks: repo.forks,
    language: mainLanguage(repo.languages),
    isOrg: false
  }))
  const ownedNames = new Set(owned.map((repo) => repo.fullName.toLowerCase()))
  const org = facts.activeRepos
    .filter((repo) => repo.isOrg && !ownedNames.has(repo.nameWithOwner.toLowerCase()))
    .map((repo) => ({
      fullName: repo.nameWithOwner,
      stars: repo.stars,
      forks: repo.forks,
      language: mainLanguage(repo.languages),
      isOrg: true
    }))
  return [...owned, ...org].sort((a, b) => b.stars - a.stars).slice(0, TOP_REPO_COUNT)
}

function computeClub(facts: PlayerFacts): string | null {
  const company = facts.company?.trim().replace(/^@/, "").split(/[\s,]/)[0]
  if (company) return company
  return facts.topOrg
}

export function computeOvr(stats: Record<StatKey, Stat>): number {
  const keys = Object.keys(STAT_WEIGHTS).filter((key): key is StatKey => key in stats)
  const raw = keys.reduce((sum, key) => sum + stats[key].raw * STAT_WEIGHTS[key], 0)
  return toDisplayScore(raw)
}

export function computeRarity(ovr: number): Rarity {
  return RARITY_THRESHOLDS.find((threshold) => ovr >= threshold.min)?.rarity ?? "bronze"
}

/** Aynı kullanıcıya her seferinde aynı seçimi yapmak için basit, kararlı bir hash. */
function hash(text: string): number {
  let value = 0
  for (const char of text) value = (value * 31 + char.charCodeAt(0)) >>> 0
  return value
}

/**
 * Unvan en güçlü stattan gelir. Üst düzey oyuncularda birden çok stat tavana dayandığı için
 * eşitlik kullanıcı adına göre kararlı biçimde bozulur; böylece efsaneler aynı unvana yığılmaz.
 */
function computeTitle(login: string, stats: Record<StatKey, Stat>, rarity: Rarity): TitleRef {
  const top = Math.max(...STAT_ORDER.map((key) => stats[key].raw))
  const tied = STAT_ORDER.filter((key) => stats[key].raw >= top - TITLE_TIE_MARGIN)
  const seed = hash(login)
  return {
    stat: tied[seed % tied.length] ?? "act",
    rarity,
    variant: (seed >>> 4) % TITLE_VARIANTS
  }
}

/** Oyuncunun genel ve kendi mevkisindeki sırası; eşit puanlılar aynı sırayı paylaşır. */
export function computeRanking(player: ScoredPlayer, all: ScoredPlayer[]): PlayerRanking {
  const samePosition = all.filter((other) => other.position === player.position)
  return {
    overall: 1 + all.filter((other) => other.ovr > player.ovr).length,
    total: all.length,
    inPosition: 1 + samePosition.filter((other) => other.ovr > player.ovr).length,
    positionTotal: samePosition.length
  }
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
  const positionBreakdown = computePositionBreakdown(facts)

  return {
    login: facts.login,
    name: facts.name?.trim() || facts.login,
    avatarUrl: facts.avatarUrl,
    club: computeClub(facts),
    position: positionFrom(positionBreakdown),
    positionBreakdown,
    topRepos: computeTopRepos(facts),
    ovr,
    rarity,
    title: computeTitle(facts.login, stats, rarity),
    archetype: computeArchetype(stats, rarity),
    stats,
    year: {
      commits: facts.lastYear.commits,
      prs: facts.lastYear.prs,
      reviews: facts.lastYear.reviews,
      issues: facts.lastYear.issues,
      activeDays: facts.calendar.filter((day) => day.count > 0).length,
      longestStreak: longestStreak(facts.calendar)
    },
    career: {
      followers: facts.followers,
      stars: Math.round(creditedStars(facts)),
      contributions: facts.yearly.reduce((sum, year) => sum + year.total, 0)
    },
    badges,
    fetchedAt: player.fetchedAt
  }
}
