import { ACCOUNT_ELIGIBILITY } from "@/constants/account.constants"

type EligibilityInput = { createdAt: Date }

/** Hesap en az `minAgeMonths` aylıksa onaylı sayılır. */
export function isEligibleAccount({ createdAt }: EligibilityInput, now: Date): boolean {
  const cutoff = new Date(now)
  cutoff.setUTCMonth(cutoff.getUTCMonth() - ACCOUNT_ELIGIBILITY.minAgeMonths)
  return createdAt.getTime() <= cutoff.getTime()
}
