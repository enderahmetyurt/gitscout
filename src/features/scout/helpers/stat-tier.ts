import { STAT_TIERS } from "@/features/scout/constants/scoring.constants"
import type { StatTier } from "@/features/scout/constants/scoring.constants"

/** Stat değerinin renk kademesi. */
export function statTier(value: number): StatTier {
  return STAT_TIERS.find((entry) => value >= entry.min)?.tier ?? "poor"
}
