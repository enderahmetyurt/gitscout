/** Ham GitHub verisinden çıkarılmış, skorlamaya giren gerçekler. Formüller değişince bunlardan yeniden hesaplanır. */

export type CheckState = "SUCCESS" | "FAILURE" | "ERROR" | "PENDING" | "EXPECTED"

type LanguageSize = {
  name: string
  size: number
}

/** Kullanıcının sahibi olduğu, fork olmayan repo. DOC, POP ve dil dağılımı buradan hesaplanır. */
export type OwnedRepo = {
  name: string
  isArchived: boolean
  pushedAt: string
  stars: number
  forks: number
  hasDescription: boolean
  hasHomepage: boolean
  topicCount: number
  license: string | null
  readmeBytes: number
  languages: LanguageSize[]
}

/** Son 12 ayda üzerinde çalışılan repo (organizasyon repoları dahil). */
export type ActiveRepo = {
  nameWithOwner: string
  isOrg: boolean
  stars: number
  forks: number
  languages: LanguageSize[]
  /** Varsayılan dalda son bir yıldaki toplam commit ve bunların kullanıcıya ait olanları. */
  yearCommits: number
  userYearCommits: number
  hasTests: boolean
  hasCi: boolean
  checkStates: CheckState[]
  userCommitsLastYear: number
}

export type CommitSample = {
  repo: string
  sha: string
  /** Birden çok ebeveynli commit; patch'i birleştirilen başkalarının commit'lerini gösterir. */
  isMerge: boolean
  message: string
  date: string
  changedFiles: number | null
}

type ContributionDay = {
  date: string
  count: number
}

type YearlyContribution = {
  year: number
  total: number
}

/** Son bir yılın katkı toplamları; private katkılar yalnızca sayı olarak gelir. */
type LastYearTotals = {
  commits: number
  prs: number
  reviews: number
  issues: number
  restricted: number
}

export type PlayerFacts = {
  login: string
  name: string | null
  avatarUrl: string
  bio: string | null
  company: string | null
  followers: number
  createdAt: string
  topOrg: string | null
  mergedExternalPrs: number
  /** Son commit'lerden çıkarılan yerel saat farkı (dakika); saat bazlı rozetler bunu kullanır. */
  utcOffsetMinutes?: number | null
  lastYear: LastYearTotals
  ownedRepos: OwnedRepo[]
  activeRepos: ActiveRepo[]
  commits: CommitSample[]
  calendar: ContributionDay[]
  yearly: YearlyContribution[]
}

export type StoredPlayer = {
  login: string
  fetchedAt: string
  /** Saat bazlı rozetler için IANA saat dilimi; boşsa varsayılan kullanılır. */
  timezone?: string
  facts: PlayerFacts
}

/* ---------- Skorlanmış çıktı ---------- */

export type StatKey = "act" | "imp" | "com" | "rep" | "con" | "exp"

export type StatPart = {
  label: string
  detail: string
  points: number
  max: number
}

export type Stat = {
  key: StatKey
  short: string
  label: string
  /** Kartta gösterilen puan (eğriden geçmiş). */
  value: number
  /** Formülden çıkan ham puan; genel puan bunun üzerinden hesaplanır. */
  raw: number
  /** Tooltip ve özet satırı için tek cümlelik açıklama. */
  summary: string
  parts: StatPart[]
}

export type Rarity = "bronze" | "silver" | "gold" | "icon"

export type Position =
  "Frontend" | "Backend" | "Full Stack" | "DevOps" | "Mobile" | "Data" | "Systems" | "Game Dev"

export type BadgeId =
  | "night-owl"
  | "early-bird"
  | "weekend-warrior"
  | "marathon"
  | "green-tick"
  | "polyglot"
  | "conventional-disciple"
  | "star-collector"
  | "oss-ambassador"
  | "test-obsessed"
  | "commit-machine"
  | "pr-machine"
  | "code-reviewer"
  | "community-leader"
  | "team-player"
  | "documenter"
  | "veteran"
  | "regular"

export type Badge = {
  id: BadgeId
  name: string
  detail: string
}

export type RoleGroup = Exclude<Position, "Full Stack">

/** Mevkinin nasıl hesaplandığını detay sayfasında açıklamak için. Paylar yıldız ağırlıklıdır. */
export type PositionBreakdown = {
  repoCount: number
  /** Python'un Data sayılıp sayılmadığı (notebook/CUDA içeren repolar nedeniyle). */
  pythonAsData: boolean
  roles: { group: RoleGroup; share: number }[]
  languages: { name: string; group: RoleGroup | null; share: number; repos: number }[]
}

/** Detay sayfasındaki "öne çıkan repolar" listesi; yalnızca public repolar. */
export type TopRepo = {
  fullName: string
  stars: number
  forks: number
  language: string | null
  /** Organizasyon reposu: oyuncunun sahibi olmadığı ama son bir yılda katkı verdiği repo. */
  isOrg: boolean
}

/** Detay sayfasındaki "Son 1 yıl" bloğu için ham sayılar. */
/** Kariyer boyu sayılar; kapışmadaki "Rakamlar" tablosu için. */
type CareerTotals = {
  followers: number
  stars: number
  contributions: number
}

type YearSummary = {
  commits: number
  prs: number
  reviews: number
  issues: number
  activeDays: number
  longestStreak: number
}

/** Oyuncunun kayıtlı oyuncular arasındaki yeri; yalnızca detay sayfası için hesaplanır. */
export type PlayerRanking = {
  overall: number
  total: number
  inPosition: number
  positionTotal: number
}

export type ScoredPlayer = {
  login: string
  name: string
  avatarUrl: string
  club: string
  position: Position
  positionBreakdown: PositionBreakdown
  topRepos: TopRepo[]
  ovr: number
  rarity: Rarity
  title: string
  /** En güçlü ve en zayıf stattan üretilen tek cümlelik tanım. */
  archetype: string
  stats: Record<StatKey, Stat>
  year: YearSummary
  career: CareerTotals
  badges: Badge[]
  fetchedAt: string
}

export type PlayerDetail = ScoredPlayer & { ranking: PlayerRanking }
