import { describe, expect, it } from "vitest"

import { REP } from "@/features/scout/constants/scoring.constants"
import {
  activeWeeks,
  computeStats,
  creditedStars,
  externalPrs,
  isConventional,
  lifetimeReviews,
  toDisplayScore
} from "@/features/scout/helpers/compute-stats"
import {
  computeOvr,
  computePosition,
  computePositionBreakdown,
  computeRanking,
  computeRarity,
  computeTopRepos,
  scorePlayer
} from "@/features/scout/helpers/score-player"
import type { PlayerFacts, StoredPlayer } from "@/features/scout/types/player.types"

const NOW = new Date("2026-11-24T12:00:00Z")

function makeFacts(overrides: Partial<PlayerFacts> = {}): PlayerFacts {
  return {
    login: "test",
    name: "Test Oyuncu",
    avatarUrl: "https://example.com/a.png",
    bio: null,
    company: "@acme",
    followers: 0,
    createdAt: "2020-01-01T00:00:00Z",
    topOrg: null,
    mergedExternalPrs: 0,
    lastYear: { commits: 0, prs: 0, reviews: 0, issues: 0, restricted: 0 },
    ownedRepos: [],
    activeRepos: [],
    commits: [],
    calendar: [],
    yearly: [],
    ...overrides
  }
}

const stored = (facts: PlayerFacts): StoredPlayer => ({
  login: facts.login,
  fetchedAt: NOW.toISOString(),
  facts
})

describe("commit mesajı sınıflandırma", () => {
  it("conventional biçimini tanır", () => {
    expect(isConventional("feat(card): add rarity chip")).toBe(true)
    expect(isConventional("feat!: v2 rewrite")).toBe(true)
    expect(isConventional("Add feature")).toBe(false)
  })
})

describe("nadirlik ve genel puan", () => {
  it("eşiklere göre nadirlik verir", () => {
    expect(computeRarity(95)).toBe("icon")
    expect(computeRarity(75)).toBe("gold")
    expect(computeRarity(74)).toBe("silver")
    expect(computeRarity(65)).toBe("silver")
    expect(computeRarity(64)).toBe("bronze")
  })

  it("hiç katkısı olmayan profil bronz kalır", () => {
    const player = scorePlayer(stored(makeFacts()), NOW)
    expect(player.ovr).toBeLessThan(40)
    expect(player.rarity).toBe("bronze")
    expect(computeOvr(player.stats)).toBe(player.ovr)
    expect(Math.round(player.ovrExact)).toBe(player.ovr)
  })

  it("kulübü company alanından @ olmadan alır", () => {
    expect(scorePlayer(stored(makeFacts()), NOW).club).toBe("acme")
  })
})

describe("gösterim eğrisi", () => {
  it("ham puanı FIFA ölçeğine taşır ve sıralamayı korur", () => {
    expect(toDisplayScore(0)).toBe(30)
    expect(toDisplayScore(38)).toBe(70)
    expect(toDisplayScore(82)).toBe(90)
    expect(toDisplayScore(100)).toBe(99)
    expect(toDisplayScore(60)).toBeLessThanOrEqual(toDisplayScore(61))
    expect(toDisplayScore(60)).toBeLessThan(toDisplayScore(70))
  })
})

describe("mevki", () => {
  const repo = (languages: { name: string; size: number }[]) => ({
    name: "r",
    isArchived: false,
    pushedAt: NOW.toISOString(),
    stars: 0,
    forks: 0,
    hasDescription: true,
    hasHomepage: false,
    topicCount: 0,
    license: null,
    readmeBytes: 0,
    languages
  })

  it("TypeScript ağırlıklıysa Frontend", () => {
    const facts = makeFacts({ ownedRepos: [repo([{ name: "TypeScript", size: 100 }])] })
    expect(computePosition(facts)).toBe("Frontend")
  })

  it("Frontend ve Backend dengeliyse Full Stack", () => {
    const facts = makeFacts({
      ownedRepos: [
        repo([
          { name: "TypeScript", size: 50 },
          { name: "Go", size: 50 }
        ])
      ]
    })
    expect(computePosition(facts)).toBe("Full Stack")
  })

  it("tek bir dev HTML reposu, yıldızlı Python repolarını ezmez", () => {
    const facts = makeFacts({
      ownedRepos: [
        repo([{ name: "HTML", size: 10_000_000 }]),
        { ...repo([{ name: "Python", size: 50 }]), stars: 5_000 },
        { ...repo([{ name: "Python", size: 50 }]), stars: 2_000 }
      ]
    })
    expect(computePosition(facts)).toBe("Backend")
  })

  it("C# varsayılan olarak Backend, Unity izi olan repoda Game Dev", () => {
    const dotnet = makeFacts({ ownedRepos: [repo([{ name: "C#", size: 100 }])] })
    expect(computePosition(dotnet)).toBe("Backend")
    const unity = makeFacts({
      ownedRepos: [
        repo([
          { name: "C#", size: 80 },
          { name: "ShaderLab", size: 20 }
        ])
      ]
    })
    expect(computePosition(unity)).toBe("Game Dev")
  })

  it("adı yapay zekâ işaret eden repolarda Python Data sayılır", () => {
    const facts = makeFacts({
      ownedRepos: [{ ...repo([{ name: "Python", size: 100 }]), name: "turkish-llm" }]
    })
    expect(computePosition(facts)).toBe("Data")
  })

  it("notebook içeren repolar Python'u Data yapar ve dökümde dil başına repo sayılır", () => {
    const facts = makeFacts({
      ownedRepos: [
        repo([
          { name: "Python", size: 80 },
          { name: "Jupyter Notebook", size: 20 }
        ]),
        repo([{ name: "Python", size: 100 }])
      ]
    })
    const breakdown = computePositionBreakdown(facts)
    expect(breakdown.pythonAsData).toBe(true)
    expect(breakdown.repoCount).toBe(2)
    expect(breakdown.roles[0]?.group).toBe("Data")
    expect(breakdown.languages.find((language) => language.name === "Python")?.repos).toBe(2)
  })
})

describe("organizasyon yıldızları", () => {
  const orgRepo = (userYearCommits: number, history?: { all: number; mine: number }) => ({
    nameWithOwner: "acme/lib",
    isOrg: true,
    stars: 1000,
    forks: 100,
    languages: [],
    yearCommits: 100,
    userYearCommits,
    allCommits: history?.all,
    userAllCommits: history?.mine,
    hasTests: false,
    hasCi: false,
    checkStates: [],
    userCommitsLastYear: userYearCommits
  })

  it("katkıcı commit payı kadar yıldız alır", () => {
    expect(creditedStars(makeFacts({ activeRepos: [orgRepo(26, { all: 1000, mine: 100 })] }))).toBe(
      260
    )
  })

  it("kurucu, bu yıl az commit atsa da bütün geçmişteki payını alır", () => {
    expect(creditedStars(makeFacts({ activeRepos: [orgRepo(5, { all: 1200, mine: 900 })] }))).toBe(
      750
    )
  })

  it("projeyi bugün yürüten, geçmişteki payı küçük olsa da son yılın payını alır", () => {
    expect(creditedStars(makeFacts({ activeRepos: [orgRepo(54, { all: 3000, mine: 540 })] }))).toBe(
      540
    )
  })

  it("geçmişi olmayan eski kayıtta yıllık pay kullanılır", () => {
    expect(creditedStars(makeFacts({ activeRepos: [orgRepo(40)] }))).toBe(400)
  })

  it("yapay zekâ ajanı commit'leri paydadan düşülür", () => {
    const repo = {
      ...orgRepo(57, { all: 197, mine: 112 }),
      agentYearCommits: 43,
      agentAllCommits: 85
    }
    expect(creditedStars(makeFacts({ activeRepos: [repo] }))).toBe(1000)
  })

  it("ajan ağırlıklı repoda birkaç commit'lik katkıcı payda tabanını aşamaz", () => {
    const repo = {
      ...orgRepo(2, { all: 202, mine: 2 }),
      agentYearCommits: 98,
      agentAllCommits: 200
    }
    expect(creditedStars(makeFacts({ activeRepos: [repo] }))).toBe(100)
  })
})

describe("öne çıkan repolar", () => {
  const owned = (name: string, stars: number) => ({
    name,
    isArchived: false,
    pushedAt: NOW.toISOString(),
    stars,
    forks: 0,
    hasDescription: true,
    hasHomepage: false,
    topicCount: 0,
    license: null,
    readmeBytes: 0,
    languages: [
      { name: "Go", size: 10 },
      { name: "TypeScript", size: 90 }
    ]
  })

  it("kendi ve org repolarını yıldıza göre sıralar, en fazla 3 tane döner", () => {
    const facts = makeFacts({
      login: "ada",
      ownedRepos: ["a", "b", "c", "d", "e"].map((name, index) => owned(name, index * 100)),
      activeRepos: [
        {
          nameWithOwner: "acme/lib",
          isOrg: true,
          stars: 250,
          forks: 10,
          languages: [],
          yearCommits: 100,
          userYearCommits: 20,
          hasTests: false,
          hasCi: false,
          checkStates: [],
          userCommitsLastYear: 20
        }
      ]
    })
    const repos = computeTopRepos(facts)
    expect(repos.map((repo) => repo.fullName)).toEqual(["ada/e", "ada/d", "acme/lib"])
    expect(repos[0]?.language).toBe("TypeScript")
    expect(repos[2]?.isOrg).toBe(true)
  })
})

/** Son `days` gün, her gün `count` katkı. */
const calendarOf = (days: number, count: number) =>
  Array.from({ length: days }, (_, index) => ({
    date: new Date(NOW.getTime() - (days - index) * 86_400_000).toISOString().slice(0, 10),
    count
  }))

describe("adil puanlama", () => {
  it("günlük katkı tavanı commit yağmurunu sınırlar", () => {
    const steady = computeStats(makeFacts({ calendar: calendarOf(365, 40) }), NOW)
    const flood = computeStats(makeFacts({ calendar: calendarOf(365, 500) }), NOW)
    expect(flood.act.value).toBe(steady.act.value)
  })

  it("eski ama boş hesap kıdemli sayılmaz", () => {
    const idle = makeFacts({
      createdAt: "2010-01-01T00:00:00Z",
      yearly: [{ year: 2015, total: 20 }]
    })
    const active = makeFacts({
      createdAt: "2020-01-01T00:00:00Z",
      yearly: [2021, 2022, 2023, 2024, 2025, 2026].map((year) => ({ year, total: 800 }))
    })
    expect(computeStats(active, NOW).exp.value).toBeGreaterThan(computeStats(idle, NOW).exp.value)
  })

  it("içinde bulunulan yıl, geçen kısmı oranında aktif sayılır", () => {
    const january = new Date("2026-01-10T12:00:00Z")
    const facts = makeFacts({
      yearly: [2022, 2023, 2024, 2025]
        .map((year) => ({ year, total: 500 }))
        .concat({ year: 2026, total: 5 })
    })
    const years = computeStats(facts, january).con.parts.find((item) => item.id === "con_years")
    expect(years?.points).toBe(years?.max)
  })

  it("aktif hafta en fazla 52 olur", () => {
    expect(activeWeeks(calendarOf(371, 1))).toBe(52)
  })

  it("tek repodaki bot commit'leri aktiviteden düşülür, normal yoğunluk etkilenmez", () => {
    const calendar = calendarOf(365, 300)
    const bot = makeFacts({
      calendar,
      repoCommits: [{ repo: "a/proxy", commits: 100_000, stars: 200 }]
    })
    const busy = makeFacts({ calendar, repoCommits: [{ repo: "a/app", commits: 4_000, stars: 0 }] })
    expect(computeStats(bot, NOW).act.value).toBeLessThan(computeStats(busy, NOW).act.value)
    expect(computeStats(busy, NOW).act.value).toBe(
      computeStats(makeFacts({ calendar }), NOW).act.value
    )
  })

  it("en çok yıldızlı repolar ayrıntılı listede yoksa da sayılır, iki kez sayılmaz", () => {
    const facts = makeFacts({
      ownedRepos: [],
      starredRepos: [{ name: "old-hit", stars: 5_000, forks: 100, language: "C" }]
    })
    expect(creditedStars(facts)).toBe(5_000)
  })

  it("maintainer olunan organizasyondaki PR'lar düşük ağırlıkla sayılır", () => {
    const facts = makeFacts({ mergedExternalPrs: 1_000, ownOrgPrs: [{ org: "acme", prs: 800 }] })
    expect(externalPrs(facts)).toBe(1_000 - 800 * (1 - REP.ownOrgPrWeight))
    expect(externalPrs(makeFacts({ mergedExternalPrs: 1_000 }))).toBe(1_000)
  })

  it("review yıllık kırılım varsa ömür boyu, yoksa son bir yıl", () => {
    const yearly = [
      { year: 2024, total: 100, reviews: 30 },
      { year: 2025, total: 100, reviews: 20 }
    ]
    expect(lifetimeReviews(makeFacts({ yearly }))).toBe(50)
    const old = makeFacts({ yearly: [{ year: 2025, total: 100 }] })
    expect(lifetimeReviews(old)).toBe(old.lastYear.reviews)
  })
})

describe("kararlılık", () => {
  it("aynı girdiye aynı unvanı verir", () => {
    const facts = makeFacts({ login: "omergulcicek" })
    expect(scorePlayer(stored(facts), NOW).title).toEqual(scorePlayer(stored(facts), NOW).title)
  })
})

describe("sıralama", () => {
  it("eşit puanlılar aynı sırayı paylaşır, mevki sırası kendi içinde sayılır", () => {
    const player = (login: string, ovr: number, position: "Frontend" | "Data") => ({
      ...scorePlayer(stored(makeFacts({ login })), NOW),
      ovr,
      ovrExact: ovr,
      position
    })
    const all = [
      player("a", 90, "Frontend"),
      player("b", 90, "Data"),
      player("c", 80, "Frontend"),
      player("d", 70, "Frontend")
    ]
    const target = all[2]
    if (!target) throw new Error("oyuncu yok")
    expect(computeRanking(target, all)).toEqual({
      overall: 3,
      total: 4,
      inPosition: 2,
      positionTotal: 3
    })
  })

  it("kartta aynı puanı gösterenleri ondalıklı puana göre ayırır", () => {
    const player = (login: string, ovrExact: number) => ({
      ...scorePlayer(stored(makeFacts({ login })), NOW),
      ovr: Math.round(ovrExact),
      ovrExact,
      position: "Frontend" as const
    })
    const leader = player("zeynep", 90.4)
    const runnerUp = player("ada", 89.6)
    const all = [runnerUp, leader]

    expect(leader.ovr).toBe(runnerUp.ovr)
    expect(computeRanking(leader, all).overall).toBe(1)
    expect(computeRanking(runnerUp, all).overall).toBe(2)
  })
})
