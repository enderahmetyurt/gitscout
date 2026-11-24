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

export const leaderboardSearchDefaults = { sort: "ovr", dir: "desc" } as const

/** Liderlik tablosunun sıralaması URL'de tutulur ki paylaşılan link aynı sırayı göstersin. */
export const leaderboardSearchSchema = z.object({
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
