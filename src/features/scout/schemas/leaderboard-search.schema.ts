import { z } from "zod"

export const LEADERBOARD_SORT_KEYS = [
  "ovr",
  "name",
  "position",
  "act",
  "imp",
  "com",
  "rep",
  "con",
  "exp"
] as const

export const POSITIONS = [
  "Frontend",
  "Backend",
  "Full Stack",
  "DevOps",
  "Mobile",
  "Data",
  "Systems",
  "Game Dev"
] as const

export const RARITIES = ["icon", "gold", "silver", "bronze"] as const

export const leaderboardSearchDefaults = { sort: "ovr", dir: "desc" } as const

/** Liderlik tablosunun sıralaması ve filtreleri URL'de tutulur ki paylaşılan link aynı görünümü göstersin. */
export const leaderboardSearchSchema = z.object({
  pos: z.array(z.enum(POSITIONS)).optional().catch(undefined),
  rarity: z.array(z.enum(RARITIES)).optional().catch(undefined),
  sort: z
    .enum(LEADERBOARD_SORT_KEYS)
    .default(leaderboardSearchDefaults.sort)
    .catch(leaderboardSearchDefaults.sort),
  dir: z
    .enum(["asc", "desc"])
    .default(leaderboardSearchDefaults.dir)
    .catch(leaderboardSearchDefaults.dir)
})

export type LeaderboardSearch = z.infer<typeof leaderboardSearchSchema>
