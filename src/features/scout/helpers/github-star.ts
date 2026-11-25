import { GITHUB_STARS } from "@/features/scout/constants/github-star.constants"

/** GitHub Stars programında mı; kullanıcı adları büyük-küçük harf ayırmaz. */
export function isGithubStar(login: string): boolean {
  return GITHUB_STARS.has(login.toLowerCase())
}

/** Kişinin GitHub Stars programındaki profil sayfası; rozetin doğrulanabilmesi için. */
export function githubStarProfileUrl(login: string): string {
  return `https://stars.github.com/profiles/${login.toLowerCase()}`
}
