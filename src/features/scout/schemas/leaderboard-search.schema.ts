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

/** URL'de görünen kısa adlar: `?pos=frontend,fullstack`. */
export const POSITION_SLUGS = {
  Frontend: "frontend",
  Backend: "backend",
  "Full Stack": "fullstack",
  DevOps: "devops",
  Mobile: "mobile",
  Data: "data",
  Systems: "systems",
  "Game Dev": "gamedev"
} as const satisfies Record<(typeof POSITIONS)[number], string>

export const leaderboardSearchDefaults = { sort: "ovr", dir: "desc" } as const

/**
 * Liderlik tablosunun sıralaması ve filtreleri URL'de tutulur ki paylaşılan link aynı görünümü göstersin.
 * Filtreler virgülle ayrılmış düz metin; geçersiz parçalar okunurken atlanır.
 */
export const leaderboardSearchSchema = z.object({
  // Router `?q=123` gibi değerleri sayı olarak okur; metne çevrilir.
  q: z.coerce.string().optional().catch(undefined),
  pos: z.string().optional().catch(undefined),
  rarity: z.string().optional().catch(undefined),
  /** Tek ülke: `?country=tr`; ülkesi bilinmeyenler `?country=unknown`. */
  country: z.string().optional().catch(undefined),
  /** Yalnızca GitHub Stars programındakiler: `?program=star`. */
  program: z.string().optional().catch(undefined),
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

/**
 * Ana sayfa aynı tabloyu kullanır; ek olarak Türkçe sayfada ilk 10'un hangi liste olduğunu seçer.
 * Türkçede varsayılan Türkiye'dir (`?top=tr` ile aynı), `?top=world` genel listeyi gösterir. İngilizcede bu parametre yok sayılır.
 */
export const homeSearchSchema = leaderboardSearchSchema.extend({
  top: z.enum(["tr", "world"]).optional().catch(undefined)
})
