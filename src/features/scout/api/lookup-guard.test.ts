import { describe, expect, it, vi } from "vitest"

import { createLookupGuard } from "@/features/scout/api/lookup-guard"
import type { LookupFailure } from "@/features/scout/api/lookup-guard"

const HOUR = 60 * 60_000
const TTL = 10 * 60_000

function setup() {
  let now = 0
  const guard = createLookupGuard({
    windowMs: HOUR,
    notFoundTtlMs: TTL,
    classify: (error) => (error instanceof Error ? (error.message as LookupFailure) : "costly"),
    clock: () => now
  })
  return { guard, advance: (ms: number) => (now += ms) }
}

describe("createLookupGuard", () => {
  it("aynı ad için süren sorguyu paylaşır", async () => {
    const { guard } = setup()
    const task = vi.fn(async () => "card")

    const results = await Promise.all([guard.run("octocat", task), guard.run("octocat", task)])

    expect(results).toEqual(["card", "card"])
    expect(task).toHaveBeenCalledOnce()
  })

  it("sorgu bitince aynı ad yeniden sorulabilir", async () => {
    const { guard } = setup()
    const task = vi.fn(async () => "card")

    await guard.run("octocat", task)
    await guard.run("octocat", task)

    expect(task).toHaveBeenCalledTimes(2)
  })

  it("bulunamayan adı süre dolana kadar GitHub'a sormadan reddeder", async () => {
    const { guard, advance } = setup()
    const task = vi.fn(async () => {
      throw new Error("not-found")
    })

    await expect(guard.run("ghost", task)).rejects.toThrow("not-found")
    await expect(guard.run("ghost", task)).rejects.toThrow("not-found")
    expect(task).toHaveBeenCalledOnce()

    advance(TTL)
    await expect(guard.run("ghost", task)).rejects.toThrow("not-found")
    expect(task).toHaveBeenCalledTimes(2)
  })

  it("kota harcayan başarısızlıkları bir saat boyunca sayar", async () => {
    const { guard, advance } = setup()
    const fail = (message: string) => async () => {
      throw new Error(message)
    }

    await guard.run("a", fail("not-found")).catch(() => {})
    await guard.run("b", fail("costly")).catch(() => {})
    await guard.run("c", fail("free")).catch(() => {})

    expect(guard.recentFailures()).toBe(2)
    advance(HOUR)
    expect(guard.recentFailures()).toBe(0)
  })
})
