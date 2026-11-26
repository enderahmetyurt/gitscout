/** Takım vitrininde sekme olan ülkeler, gösterilme sırasıyla. Lig adı yerine ülke kullanılır. */
export const TEAM_COUNTRIES = ["turkey", "england", "spain", "germany", "italy", "france"] as const

export type TeamCountry = (typeof TEAM_COUNTRIES)[number]

/** Her ülkenin takımları, vitrinde gösterilme sırasıyla. Kimlikler adreste ve veritabanında kullanılır. */
export const TEAMS_BY_COUNTRY = {
  turkey: ["galatasaray", "fenerbahce", "besiktas", "trabzonspor", "bursaspor", "goztepe"],
  england: ["arsenal", "chelsea", "liverpool", "manchester-city", "manchester-united", "tottenham"],
  spain: ["real-madrid", "barcelona", "atletico-madrid", "athletic-club", "sevilla", "valencia"],
  germany: ["bayern-munchen", "borussia-dortmund", "bayer-leverkusen"],
  italy: ["inter", "juventus", "milan", "napoli", "roma", "lazio"],
  france: ["paris-saint-germain", "marseille", "lyon"]
} as const satisfies Record<TeamCountry, readonly string[]>

/**
 * Ayarlarda seçilebilen favori takımlar; boş bırakmak da mümkün. Değerler veritabanı kısıtıyla aynı:
 * yeni takım eklenince kısıt da migration ile güncellenir.
 */
export const TEAMS = [
  ...TEAMS_BY_COUNTRY.turkey,
  ...TEAMS_BY_COUNTRY.england,
  ...TEAMS_BY_COUNTRY.spain,
  ...TEAMS_BY_COUNTRY.germany,
  ...TEAMS_BY_COUNTRY.italy,
  ...TEAMS_BY_COUNTRY.france
] as const

export type Team = (typeof TEAMS)[number]

/** Kulüp adları her dilde aynı yazılır. */
export const TEAM_NAMES = {
  galatasaray: "Galatasaray",
  fenerbahce: "Fenerbahçe",
  besiktas: "Beşiktaş",
  trabzonspor: "Trabzonspor",
  arsenal: "Arsenal",
  chelsea: "Chelsea",
  liverpool: "Liverpool",
  "manchester-city": "Manchester City",
  "manchester-united": "Manchester United",
  tottenham: "Tottenham Hotspur",
  "real-madrid": "Real Madrid",
  barcelona: "Barcelona",
  "atletico-madrid": "Atlético Madrid",
  "bayern-munchen": "Bayern München",
  "borussia-dortmund": "Borussia Dortmund",
  inter: "Inter",
  juventus: "Juventus",
  milan: "Milan",
  napoli: "Napoli",
  "paris-saint-germain": "Paris Saint-Germain",
  bursaspor: "Bursaspor",
  goztepe: "Göztepe",
  "athletic-club": "Athletic Bilbao",
  sevilla: "Sevilla",
  valencia: "Valencia",
  "bayer-leverkusen": "Bayer Leverkusen",
  roma: "Roma",
  lazio: "Lazio",
  marseille: "Marseille",
  lyon: "Lyon"
} as const satisfies Record<Team, string>
