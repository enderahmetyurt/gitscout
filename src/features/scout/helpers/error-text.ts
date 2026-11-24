import * as m from "@/paraglide/messages.js"

const GITHUB_ERRORS = {
  "github:not-found": m.error_github_not_found,
  "github:rate-limit": m.error_github_rate_limit,
  "github:missing-token": m.error_github_token,
  "github:request": m.error_github_request
} as const satisfies Record<string, () => string>

const isGithubCode = (code: string): code is keyof typeof GITHUB_ERRORS => code in GITHUB_ERRORS

/** Sunucudan gelen hata kodunu kullanıcının dilinde bir cümleye çevirir. */
export function errorText(error: unknown): string {
  const code = error instanceof Error ? error.message : ""
  return isGithubCode(code) ? GITHUB_ERRORS[code]() : m.error_generic()
}
