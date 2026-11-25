import { GITHUB_STARS } from "@/features/scout/constants/github-star.constants"

/** GitHub Stars programında mı; kullanıcı adları büyük-küçük harf ayırmaz. */
export function isGithubStar(login: string): boolean {
  return GITHUB_STARS.has(login.toLowerCase())
}
