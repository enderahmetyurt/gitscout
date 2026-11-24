import { timingSafeEqual } from "node:crypto"

import { fetchPlayerFacts } from "@/features/scout/api/fetch-player-facts.api"
import { GithubError } from "@/features/scout/api/get-github-data.api"
import {
  getStaleLogins,
  postponePlayer,
  replacePlayerFacts
} from "@/features/scout/api/player-store"
import { REFRESH } from "@/features/scout/constants/scoring.constants"
import { serverEnv } from "@/env.server"

/** Vercel Cron `Authorization: Bearer <CRON_SECRET>` gönderir; karşılaştırma sabit sürede yapılır. */
export function isAuthorizedCron(header: string | null): boolean {
  const secret = serverEnv.CRON_SECRET
  if (!secret || !header) return false
  const expected = Buffer.from(`Bearer ${secret}`)
  const received = Buffer.from(header)
  return expected.length === received.length && timingSafeEqual(expected, received)
}

type RefreshResult = { refreshed: string[]; postponed: string[]; failed: string[] }

/** En eski birkaç kartı sırayla GitHub'dan yeniden çeker. Bir kartın hatası diğerlerini durdurmaz. */
export async function refreshStalePlayers(): Promise<RefreshResult> {
  const result: RefreshResult = { refreshed: [], postponed: [], failed: [] }
  for (const login of await getStaleLogins(REFRESH.perRun)) {
    try {
      const facts = await fetchPlayerFacts(login)
      await replacePlayerFacts(login, {
        login: facts.login,
        fetchedAt: new Date().toISOString(),
        facts
      })
      result.refreshed.push(login)
    } catch (error) {
      if (error instanceof GithubError && error.kind === "not-found") {
        await postponePlayer(login)
        result.postponed.push(login)
      } else {
        console.error(
          "[refresh] yenilenemedi",
          login,
          error instanceof Error ? error.message : error
        )
        result.failed.push(login)
      }
    }
  }
  return result
}
