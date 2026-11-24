import {
  fetchActiveRepos,
  fetchCommitUtcOffset,
  fetchProfile,
  fetchYearlyContributions,
  GithubError
} from "@/features/scout/api/get-github-data.api"
import { COMMIT_SAMPLE_SIZE, CON } from "@/features/scout/constants/scoring.constants"
import { buildFacts, pickActiveRepos } from "@/features/scout/helpers/build-facts"
import type { PlayerFacts } from "@/features/scout/types/player.types"

/** Bir oyuncunun bütün verisini toplar: profil, sayfalı repolar, aktif repolar ve hesabın açıldığı yıldan bu yana yıllık katkılar. */
export async function fetchPlayerFacts(login: string, now = new Date()): Promise<PlayerFacts> {
  const profile = await fetchProfile(login)
  const user = profile.user
  if (!user) {
    throw new GithubError("Bu kullanıcı adıyla bir GitHub hesabı bulunamadı", "not-found")
  }

  const activeRefs = pickActiveRepos(user, now)
  const currentYear = now.getUTCFullYear()
  const firstYear = Math.min(
    new Date(user.createdAt).getUTCFullYear(),
    currentYear - CON.years.span + 1
  )
  const years = Array.from(
    { length: currentYear - firstYear + 1 },
    (_, index) => currentYear - index
  )
  const since = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString()

  const [activeNodes, yearlyResponse] = await Promise.all([
    fetchActiveRepos(user.id, activeRefs, since),
    fetchYearlyContributions(user.login, years)
  ])

  const yearly = years.map((year) => ({
    year,
    total: yearlyResponse.user[`y${year}`]?.contributionCalendar.totalContributions ?? 0
  }))

  const facts = buildFacts({
    user,
    mergedExternalPrs: profile.mergedPrs.issueCount,
    activeRefs,
    activeNodes,
    yearly,
    commitSampleSize: COMMIT_SAMPLE_SIZE
  })

  return { ...facts, utcOffsetMinutes: await detectUtcOffset(facts.commits) }
}

const OFFSET_SAMPLE = 10

/** Son commit'lerin en sık görülen saat farkı; seyahat ya da tek bir sapma sonucu değiştirmez. */
async function detectUtcOffset(commits: PlayerFacts["commits"]): Promise<number | null> {
  const sample = commits.filter((commit) => commit.sha && !commit.isMerge).slice(0, OFFSET_SAMPLE)
  const offsets = (
    await Promise.all(sample.map((commit) => fetchCommitUtcOffset(commit.repo, commit.sha)))
  ).filter((offset): offset is number => offset !== null)
  if (offsets.length === 0) return null

  // GitHub arayüzünden yapılan birleştirme ve düzenlemeler her zaman +0000 kaydedilir;
  // gerçek bir yerel fark görüldüyse o sıfırlar sonucu bozmamalı.
  const local = offsets.filter((offset) => offset !== 0)
  const candidates = local.length > 0 ? local : offsets

  const counts = new Map<number, number>()
  for (const offset of candidates) counts.set(offset, (counts.get(offset) ?? 0) + 1)
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
}
