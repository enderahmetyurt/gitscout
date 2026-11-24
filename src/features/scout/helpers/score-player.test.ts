import { describe, expect, it } from "vitest"

import {
  creditedStars,
  isConventional,
  toDisplayScore
} from "@/features/scout/helpers/compute-stats"
import {
  computeOvr,
  computePosition,
  computeRarity,
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
    expect(computeRarity(80)).toBe("gold")
    expect(computeRarity(79)).toBe("silver")
    expect(computeRarity(65)).toBe("silver")
    expect(computeRarity(64)).toBe("bronze")
  })

  it("hiç katkısı olmayan profil bronz kalır", () => {
    const player = scorePlayer(stored(makeFacts()), NOW)
    expect(player.ovr).toBeLessThan(40)
    expect(player.rarity).toBe("bronze")
    expect(computeOvr(player.stats)).toBe(player.ovr)
  })

  it("kulübü company alanından @ olmadan alır", () => {
    expect(scorePlayer(stored(makeFacts()), NOW).club).toBe("acme")
  })
})

describe("gösterim eğrisi", () => {
  it("ham puanı FIFA ölçeğine taşır ve sıralamayı korur", () => {
    expect(toDisplayScore(0)).toBe(30)
    expect(toDisplayScore(45)).toBe(71)
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
})

describe("organizasyon yıldızları", () => {
  const orgRepo = (userYearCommits: number) => ({
    nameWithOwner: "acme/lib",
    isOrg: true,
    stars: 1000,
    forks: 100,
    languages: [],
    yearCommits: 100,
    userYearCommits,
    hasTests: false,
    hasCi: false,
    checkStates: [],
    userCommitsLastYear: userYearCommits
  })

  it("ana maintainer yıldızların tamamını alır", () => {
    expect(creditedStars(makeFacts({ activeRepos: [orgRepo(40)] }))).toBe(1000)
  })

  it("küçük katkı payı oranında yıldız alır", () => {
    expect(creditedStars(makeFacts({ activeRepos: [orgRepo(10)] }))).toBe(400)
  })
})

describe("kararlılık", () => {
  it("aynı girdiye aynı unvanı verir", () => {
    const facts = makeFacts({ login: "omergulcicek" })
    expect(scorePlayer(stored(facts), NOW).title).toBe(scorePlayer(stored(facts), NOW).title)
  })
})
