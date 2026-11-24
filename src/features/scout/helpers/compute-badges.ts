import {
  activeWeeks,
  checkSuccessRate,
  creditedStars,
  isConventional,
  longestStreak,
  significantLanguages
} from "@/features/scout/helpers/compute-stats"
import type { Badge, PlayerFacts } from "@/features/scout/types/player.types"

const pct = (value: number) => `%${Math.round(value * 100)}`
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
 * Kural tabanlı rozetler; yalnızca başarıları ödüllendirir, genel puanı etkilemez. Sıra önemlidir: unvanın ön eki ilk kazanılan rozetten seçilir.
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
        name: "Gece Kuşu",
        detail: `Commit'lerin ${pct(night)}'i gece 00:00–06:00 arası (yerel saat)`
      })
    }
    const early = times.filter((time) => time.hour >= 5 && time.hour < 9).length / n
    if (early >= 0.2) {
      badges.push({
        id: "early-bird",
        name: "Erkenci",
        detail: `Commit'lerin ${pct(early)}'i sabah 05:00–09:00 arası (yerel saat)`
      })
    }
    const weekend = times.filter((time) => time.weekday === 0 || time.weekday === 6).length / n
    if (weekend >= 0.3) {
      badges.push({
        id: "weekend-warrior",
        name: "Hafta Sonu Savaşçısı",
        detail: `Commit'lerin ${pct(weekend)}'i hafta sonu`
      })
    }
  }

  const streak = longestStreak(facts.calendar)
  if (streak >= 30) {
    badges.push({
      id: "marathon",
      name: "Maratoncu",
      detail: `${streak} gün üst üste katkı`
    })
  }

  const checks = checkSuccessRate(facts)
  if (checks.total >= 10 && checks.rate >= 0.9) {
    badges.push({
      id: "green-tick",
      name: "Yeşil Tik",
      detail: `Son ${checks.total} CI sonucunun ${pct(checks.rate)}'i başarılı`
    })
  }

  const languages = significantLanguages(facts)
  if (languages.length >= 5) {
    badges.push({
      id: "polyglot",
      name: "Çok Dilli",
      detail: `Kodunun %5'ten fazlasını oluşturan ${languages.length} dil: ${languages.map((language) => language.name).join(", ")}`
    })
  }

  if (n >= 30) {
    const conventional = commits.filter((commit) => isConventional(commit.message)).length / n
    if (conventional >= 0.8) {
      badges.push({
        id: "conventional-disciple",
        name: "Conventional Disiplini",
        detail: `Commit'lerin ${pct(conventional)}'i conventional`
      })
    }
  }

  const stars = Math.round(creditedStars(facts))
  if (stars >= 1000) {
    badges.push({
      id: "star-collector",
      name: "Yıldız Toplayıcı",
      detail: `Toplam ${stars.toLocaleString("tr-TR")} yıldız`
    })
  }

  if (facts.mergedExternalPrs >= 20) {
    badges.push({
      id: "oss-ambassador",
      name: "Açık Kaynak Elçisi",
      detail: `Başka repolara ${facts.mergedExternalPrs} merge edilmiş PR`
    })
  }

  const active = facts.activeRepos.length
  const tested = facts.activeRepos.filter((repo) => repo.hasTests).length
  if (active >= 3 && tested / active >= 0.9) {
    badges.push({
      id: "test-obsessed",
      name: "Test Takıntılı",
      detail: `${active} aktif reponun ${tested}'inde test var`
    })
  }

  if (facts.lastYear.commits >= 1000) {
    badges.push({
      id: "commit-machine",
      name: "Commit Makinesi",
      detail: `Son 1 yılda ${facts.lastYear.commits.toLocaleString("tr-TR")} commit`
    })
  }

  if (facts.lastYear.prs >= 100) {
    badges.push({
      id: "pr-machine",
      name: "PR Ustası",
      detail: `Son 1 yılda ${facts.lastYear.prs} pull request`
    })
  }

  if (facts.lastYear.reviews >= 100) {
    badges.push({
      id: "code-reviewer",
      name: "Kod Gözcüsü",
      detail: `Son 1 yılda ${facts.lastYear.reviews} kod incelemesi`
    })
  }

  if (facts.followers >= 1000) {
    badges.push({
      id: "community-leader",
      name: "Topluluk Lideri",
      detail: `${facts.followers.toLocaleString("tr-TR")} takipçi`
    })
  }

  const orgRepos = facts.activeRepos.filter(
    (repo) => repo.isOrg && repo.userYearCommits >= TEAM_MIN_COMMITS
  ).length
  if (orgRepos >= 2) {
    badges.push({
      id: "team-player",
      name: "Takım Oyuncusu",
      detail: `Son 1 yılda ${orgRepos} organizasyon reposuna ${TEAM_MIN_COMMITS}+ commit`
    })
  }

  const liveRepos = facts.ownedRepos.filter((repo) => !repo.isArchived)
  const documented = liveRepos.filter(
    (repo) => repo.hasDescription && repo.readmeBytes >= DOCUMENTED_README_BYTES
  ).length
  if (liveRepos.length >= 5 && documented / liveRepos.length >= 0.8) {
    badges.push({
      id: "documenter",
      name: "Dokümantasyon Ustası",
      detail: `${liveRepos.length} reponun ${documented}'inde açıklama ve dolu bir README var`
    })
  }

  const years = Math.floor((now.getTime() - new Date(facts.createdAt).getTime()) / YEAR_MS)
  if (years >= 10) {
    badges.push({
      id: "veteran",
      name: "Emektar",
      detail: `${years} yıldır GitHub'da`
    })
  }

  const weeks = activeWeeks(facts.calendar)
  if (weeks >= 40) {
    badges.push({
      id: "regular",
      name: "Düzenli Oyuncu",
      detail: `Son 52 haftanın ${weeks}'inde aktif`
    })
  }

  return badges
}
