import { env } from "@/env"

import { createApi } from "@/lib/api"

/** Yalnızca sunucuda kullanılır: token istemci paketine girmemeli. */
export const githubApi = createApi({
  baseUrl: "https://api.github.com",
  getHeaders: () => ({
    ...(env.GITHUB_TOKEN ? { Authorization: `bearer ${env.GITHUB_TOKEN}` } : {}),
    "User-Agent": "gitscout"
  })
})

export const hasGithubToken = () => Boolean(env.GITHUB_TOKEN)
