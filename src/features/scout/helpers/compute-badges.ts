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
const TWO_YEARS_MS = 2 * 365 * 24 * 60 * 60 * 1000
const README_UPDATE = /^update readme(\.md)?$/i

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
 * Kural tabanlı rozetler; genel puanı etkilemez, oyuncunun karakterini anlatır. Sıra önemlidir: unvanın ön eki ilk kazanılan rozetten seçilir.
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
        emoji: "🦉",
        name: "Gece Kuşu",
        detail: `Commit'lerin ${pct(night)}'i gece 00:00–06:00 arası (yerel saat)`
      })
    }
    const early = times.filter((time) => time.hour >= 5 && time.hour < 9).length / n
    if (early >= 0.2) {
      badges.push({
        id: "early-bird",
        emoji: "🌅",
        name: "Erkenci",
        detail: `Commit'lerin ${pct(early)}'i sabah 05:00–09:00 arası (yerel saat)`
      })
    }
    const friday = times.filter((time) => time.weekday === 5 && time.hour >= 17).length / n
    if (friday >= 0.08) {
      badges.push({
        id: "friday-deployer",
        emoji: "🍻",
        name: "Cuma Akşamı Deployer'ı",
        detail: `Commit'lerin ${pct(friday)}'i cuma 17:00 sonrası (yerel saat)`
      })
    }
    const weekend = times.filter((time) => time.weekday === 0 || time.weekday === 6).length / n
    if (weekend >= 0.3) {
      badges.push({
        id: "weekend-warrior",
        emoji: "🏖️",
        name: "Hafta Sonu Savaşçısı",
        detail: `Commit'lerin ${pct(weekend)}'i hafta sonu`
      })
    }
  }

  const oldRepos = facts.ownedRepos.filter(
    (repo) => now.getTime() - new Date(repo.pushedAt).getTime() > TWO_YEARS_MS
  ).length
  if (facts.ownedRepos.length >= 5 && oldRepos / facts.ownedRepos.length >= 0.5) {
    badges.push({
      id: "graveyard",
      emoji: "🪦",
      name: "Mezarlık Bekçisi",
      detail: `${facts.ownedRepos.length} reponun ${oldRepos}'i 2 yıldır dokunulmamış`
    })
  }

  const readmeUpdates = commits.filter((commit) => README_UPDATE.test(commit.message.trim())).length
  if (readmeUpdates >= 10) {
    badges.push({
      id: "readme-master",
      emoji: "📝",
      name: "README Ustası",
      detail: `${readmeUpdates} kez "Update README.md"`
    })
  }

  const streak = longestStreak(facts.calendar)
  if (streak >= 30) {
    badges.push({
      id: "streak-killer",
      emoji: "🔥",
      name: "Seri Katili",
      detail: `${streak} gün üst üste katkı`
    })
  }

  const checks = checkSuccessRate(facts)
  if (checks.total >= 10 && checks.rate >= 0.9) {
    badges.push({
      id: "green-tick",
      emoji: "✅",
      name: "Yeşil Tik",
      detail: `Son ${checks.total} CI sonucunun ${pct(checks.rate)}'i başarılı`
    })
  }

  const languages = significantLanguages(facts)
  if (languages.length >= 5) {
    badges.push({
      id: "polyglot",
      emoji: "🗺️",
      name: "Çok Dilli",
      detail: `Kodunun %5'ten fazlasını oluşturan ${languages.length} dil: ${languages.map((language) => language.name).join(", ")}`
    })
  }

  if (n >= 30) {
    const conventional = commits.filter((commit) => isConventional(commit.message)).length / n
    if (conventional >= 0.8) {
      badges.push({
        id: "conventional-disciple",
        emoji: "📐",
        name: "Conventional Disiplini",
        detail: `Commit'lerin ${pct(conventional)}'i conventional`
      })
    }
  }

  const stars = Math.round(creditedStars(facts))
  if (stars >= 1000) {
    badges.push({
      id: "star-collector",
      emoji: "⭐",
      name: "Yıldız Toplayıcı",
      detail: `Toplam ${stars.toLocaleString("tr-TR")} yıldız`
    })
  }

  if (facts.mergedExternalPrs >= 20) {
    badges.push({
      id: "oss-ambassador",
      emoji: "🌍",
      name: "Açık Kaynak Elçisi",
      detail: `Başka repolara ${facts.mergedExternalPrs} merge edilmiş PR`
    })
  }

  const active = facts.activeRepos.length
  const tested = facts.activeRepos.filter((repo) => repo.hasTests).length
  if (active >= 3 && tested / active >= 0.9) {
    badges.push({
      id: "test-obsessed",
      emoji: "🧪",
      name: "Test Takıntılı",
      detail: `${active} aktif reponun ${tested}'inde test var`
    })
  }

  // Hiç rozet yoksa bile kart boş kalmasın diye en azından aktiflik rozeti.
  if (badges.length === 0 && activeWeeks(facts.calendar) >= 26) {
    badges.push({
      id: "regular",
      emoji: "📅",
      name: "Düzenli Oyuncu",
      detail: "Yılın yarısından fazlasında aktif"
    })
  }

  return badges
}
