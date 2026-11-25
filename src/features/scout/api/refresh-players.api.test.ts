import { beforeEach, describe, expect, it, vi } from "vitest"

import { fetchPlayerFacts } from "@/features/scout/api/fetch-player-facts.api"
import { GithubError } from "@/features/scout/api/get-github-data.api"
import {
  getStaleLogins,
  postponePlayer,
  replacePlayerFacts
} from "@/features/scout/api/player-store"
import { refreshStalePlayers } from "@/features/scout/api/refresh-players.api"
import { REFRESH } from "@/features/scout/constants/scoring.constants"
import type { PlayerFacts } from "@/features/scout/types/player.types"

vi.mock("@/features/scout/api/fetch-player-facts.api", () => ({ fetchPlayerFacts: vi.fn() }))
vi.mock("@/features/scout/api/player-store", () => ({
  getStaleLogins: vi.fn(),
  postponePlayer: vi.fn(),
  replacePlayerFacts: vi.fn()
}))

const facts = (login: string) => ({ login }) as PlayerFacts

/** Her kart `cardMs` sürüyormuş gibi ilerleyen sahte saat. */
function fakeClock(cardMs: number) {
  let now = 0
  vi.mocked(fetchPlayerFacts).mockImplementation(async (login) => {
    now += cardMs
    return facts(login)
  })
  return () => now
}

describe("refreshStalePlayers", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, "error").mockImplementation(() => {})
  })

  it("süre yettiği sürece bütün eskimiş kartları yeniler", async () => {
    vi.mocked(getStaleLogins).mockResolvedValue(["a", "b", "c", "d", "e"])
    const clock = fakeClock(1_000)

    const result = await refreshStalePlayers(clock)

    expect(getStaleLogins).toHaveBeenCalledWith(REFRESH.maxPerRun)
    expect(result.refreshed).toEqual(["a", "b", "c", "d", "e"])
    expect(result.skipped).toEqual([])
    expect(replacePlayerFacts).toHaveBeenCalledTimes(5)
  })

  it("süre dolunca durur, kalanları sonraki çalışmaya bırakır", async () => {
    vi.mocked(getStaleLogins).mockResolvedValue(["a", "b", "c", "d"])
    const clock = fakeClock(REFRESH.timeBudgetMs / 2)

    const result = await refreshStalePlayers(clock)

    expect(result.refreshed).toEqual(["a", "b"])
    expect(result.skipped).toEqual(["c", "d"])
    expect(fetchPlayerFacts).toHaveBeenCalledTimes(2)
  })

  it("bulunamayan hesabı erteler, diğer hatalarda sıradakine geçer", async () => {
    vi.mocked(getStaleLogins).mockResolvedValue(["gone", "broken", "ok"])
    vi.mocked(fetchPlayerFacts).mockImplementation(async (login) => {
      if (login === "gone") throw new GithubError("yok", "not-found")
      if (login === "broken") throw new GithubError("502", "request")
      return facts(login)
    })

    const result = await refreshStalePlayers(() => 0)

    expect(postponePlayer).toHaveBeenCalledWith("gone")
    expect(result).toEqual({
      refreshed: ["ok"],
      postponed: ["gone"],
      failed: ["broken"],
      skipped: []
    })
  })

  it("GitHub kotası bitince çalışmayı bitirir", async () => {
    vi.mocked(getStaleLogins).mockResolvedValue(["a", "b", "c"])
    vi.mocked(fetchPlayerFacts).mockImplementation(async (login) => {
      if (login === "b") throw new GithubError("limit", "rate-limit")
      return facts(login)
    })

    const result = await refreshStalePlayers(() => 0)

    expect(result).toEqual({ refreshed: ["a"], postponed: [], failed: ["b"], skipped: ["c"] })
    expect(fetchPlayerFacts).toHaveBeenCalledTimes(2)
  })
})
