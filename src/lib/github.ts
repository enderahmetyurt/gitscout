import { createApi } from "@/lib/api"

import { serverEnv } from "@/env.server"

/** Yalnızca sunucuda kullanılır: token istemci paketine girmemeli. */
export const githubApi = createApi({
  baseUrl: "https://api.github.com",
  getHeaders: () => ({
    ...(serverEnv.GITHUB_TOKEN ? { Authorization: `bearer ${serverEnv.GITHUB_TOKEN}` } : {}),
    "User-Agent": "gitscout"
  })
})

export const hasGithubToken = () => Boolean(serverEnv.GITHUB_TOKEN)
