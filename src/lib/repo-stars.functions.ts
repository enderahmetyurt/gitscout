import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"

import { siteConfig } from "@/config/site.config"

import { githubApi } from "@/lib/github"

/** Yıldız sayısı yavaş değişir; her ziyarette GitHub'a gitmemek için sunucu örneği bu süre önbellekte tutar. */
const STARS_CACHE_MS = 10 * 60_000

const repoSchema = z.object({ stargazers_count: z.number() })

const repoPath = () => new URL(siteConfig.links.github).pathname

let starsCache: { at: number; stars: number } | null = null

/**
 * Sitenin GitHub deposundaki yıldız sayısı. GitHub yanıt vermezse `null` döner:
 * buton sayısız da çalışır, hata sayfayı bozmamalı.
 */
export const getRepoStars = createServerFn({ method: "GET" }).handler(async () => {
  if (starsCache && Date.now() - starsCache.at < STARS_CACHE_MS) return starsCache.stars

  try {
    const repo = await githubApi.get(`/repos${repoPath()}`, {
      schema: repoSchema,
      timeoutMs: 5000
    })
    starsCache = { at: Date.now(), stars: repo.stargazers_count }
    return repo.stargazers_count
  } catch (error) {
    console.error("Could not fetch repository stars", error)
    return starsCache?.stars ?? null
  }
})
