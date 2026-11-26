import { ACCOUNT_ELIGIBILITY } from "@/constants/account.constants"

type EligibilityInput = { createdAt: Date; followers: number }

/** Hesap en az `minAgeMonths` aylık ve en az `minFollowers` takipçiliyse onaylı sayılır. */
export function isEligibleAccount({ createdAt, followers }: EligibilityInput, now: Date): boolean {
  const cutoff = new Date(now)
  cutoff.setUTCMonth(cutoff.getUTCMonth() - ACCOUNT_ELIGIBILITY.minAgeMonths)
  return createdAt.getTime() <= cutoff.getTime() && followers >= ACCOUNT_ELIGIBILITY.minFollowers
}
