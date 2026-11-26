import type { Team } from "@/constants/team.constants"

/**
 * Takım kartının renkleri: zeminin iki tonu, çerçevedeki iki çubuk rengi, vurgu (puan ve slogan) ve çizgi.
 * `light` açık zeminli kart (koyu yazı); arması koyu olan ya da beyaz formalı takımlar için. Renkler
 * kulüplerin yayımladığı bir kılavuzdan değil, arma SVG'lerinden ve yaygın kullanılan değerlerden.
 */
export type TeamTheme = {
  bg: readonly [string, string]
  stripes: readonly [string, string]
  accent: string
  line: string
  tone: "dark" | "light"
}

export const TEAM_THEMES = {
  galatasaray: {
    bg: ["#a90432", "#5c0119"],
    stripes: ["#a90432", "#fdb912"],
    accent: "#fdb912",
    line: "#fdb912",
    tone: "dark"
  },
  fenerbahce: {
    bg: ["#163962", "#08182c"],
    stripes: ["#163962", "#ffed00"],
    accent: "#ffed00",
    line: "#ffed00",
    tone: "dark"
  },
  besiktas: {
    bg: ["#262626", "#000000"],
    stripes: ["#000000", "#ffffff"],
    accent: "#ffffff",
    line: "#e00505",
    tone: "dark"
  },
  trabzonspor: {
    bg: ["#902f2f", "#4a1414"],
    stripes: ["#902f2f", "#4fbff0"],
    accent: "#4fbff0",
    line: "#4fbff0",
    tone: "dark"
  },
  arsenal: {
    bg: ["#db0007", "#6e0004"],
    stripes: ["#db0007", "#ffffff"],
    accent: "#ffffff",
    line: "#9c824a",
    tone: "dark"
  },
  chelsea: {
    bg: ["#051495", "#020a4a"],
    stripes: ["#051495", "#ffffff"],
    accent: "#fbb701",
    line: "#fbb701",
    tone: "dark"
  },
  liverpool: {
    bg: ["#c8102e", "#5e0614"],
    stripes: ["#c8102e", "#ffffff"],
    accent: "#ffffff",
    line: "#ffffff",
    tone: "dark"
  },
  "manchester-city": {
    bg: ["#00285e", "#00122b"],
    stripes: ["#6caddf", "#ffffff"],
    accent: "#6caddf",
    line: "#6caddf",
    tone: "dark"
  },
  "manchester-united": {
    bg: ["#da020e", "#6a0107"],
    stripes: ["#da020e", "#ffe500"],
    accent: "#ffe500",
    line: "#ffe500",
    tone: "dark"
  },
  tottenham: {
    bg: ["#ffffff", "#eef0f6"],
    stripes: ["#000a3c", "#ffffff"],
    accent: "#000a3c",
    line: "#000a3c",
    tone: "light"
  },
  "real-madrid": {
    bg: ["#ffffff", "#eef3fa"],
    stripes: ["#febe10", "#ffffff"],
    accent: "#00529f",
    line: "#febe10",
    tone: "light"
  },
  barcelona: {
    bg: ["#004d98", "#00264d"],
    stripes: ["#004d98", "#a50044"],
    accent: "#edbb00",
    line: "#edbb00",
    tone: "dark"
  },
  "atletico-madrid": {
    bg: ["#282a6f", "#11123a"],
    stripes: ["#e8151e", "#ffffff"],
    accent: "#ffffff",
    line: "#e8151e",
    tone: "dark"
  },
  "bayern-munchen": {
    bg: ["#dc052d", "#6b0216"],
    stripes: ["#dc052d", "#ffffff"],
    accent: "#ffffff",
    line: "#ffffff",
    tone: "dark"
  },
  "borussia-dortmund": {
    bg: ["#262626", "#000000"],
    stripes: ["#000000", "#fde100"],
    accent: "#fde100",
    line: "#fde100",
    tone: "dark"
  },
  inter: {
    bg: ["#00239c", "#000e40"],
    stripes: ["#00239c", "#000000"],
    accent: "#ffffff",
    line: "#ffffff",
    tone: "dark"
  },
  juventus: {
    bg: ["#ffffff", "#eeeeee"],
    stripes: ["#000000", "#ffffff"],
    accent: "#000000",
    line: "#000000",
    tone: "light"
  },
  milan: {
    bg: ["#e4002b", "#7a0017"],
    stripes: ["#e4002b", "#101820"],
    accent: "#ffffff",
    line: "#ffffff",
    tone: "dark"
  },
  napoli: {
    bg: ["#007fb1", "#003a57"],
    stripes: ["#00abe7", "#ffffff"],
    accent: "#ffffff",
    line: "#00abe7",
    tone: "dark"
  },
  "paris-saint-germain": {
    bg: ["#004170", "#001c33"],
    stripes: ["#004170", "#e30613"],
    accent: "#ffffff",
    line: "#e30613",
    tone: "dark"
  },
  bursaspor: {
    bg: ["#02863a", "#01401b"],
    stripes: ["#02863a", "#ffffff"],
    accent: "#ffffff",
    line: "#ffffff",
    tone: "dark"
  },
  goztepe: {
    bg: ["#e82029", "#6e0d11"],
    stripes: ["#e82029", "#ffdc00"],
    accent: "#ffdc00",
    line: "#ffdc00",
    tone: "dark"
  },
  "athletic-club": {
    bg: ["#ee2523", "#6f0d0c"],
    stripes: ["#ee2523", "#ffffff"],
    accent: "#ffffff",
    line: "#ffffff",
    tone: "dark"
  },
  sevilla: {
    bg: ["#d10a11", "#650508"],
    stripes: ["#d10a11", "#ffffff"],
    accent: "#ffffff",
    line: "#c79c00",
    tone: "dark"
  },
  valencia: {
    bg: ["#262626", "#000000"],
    stripes: ["#000000", "#ffffff"],
    accent: "#ee8707",
    line: "#ee8707",
    tone: "dark"
  },
  "bayer-leverkusen": {
    bg: ["#262626", "#000000"],
    stripes: ["#e32221", "#000000"],
    accent: "#e32221",
    line: "#e32221",
    tone: "dark"
  },
  roma: {
    bg: ["#8e1f2f", "#470d17"],
    stripes: ["#8e1f2f", "#fbb900"],
    accent: "#fbb900",
    line: "#fbb900",
    tone: "dark"
  },
  lazio: {
    bg: ["#003a70", "#001a33"],
    stripes: ["#74d1ea", "#ffffff"],
    accent: "#74d1ea",
    line: "#74d1ea",
    tone: "dark"
  },
  marseille: {
    bg: ["#0b61ad", "#052e52"],
    stripes: ["#2faee0", "#ffffff"],
    accent: "#ffffff",
    line: "#2faee0",
    tone: "dark"
  },
  lyon: {
    bg: ["#0f23aa", "#070f4f"],
    stripes: ["#0f23aa", "#e5202e"],
    accent: "#ffffff",
    line: "#c88c28",
    tone: "dark"
  }
} as const satisfies Record<Team, TeamTheme>

/**
 * Armaların en/boy oranı (SVG viewBox'tan). Uzun ve geniş armalar aynı kutuda farklı büyüklükte görünmesin
 * diye her arma eşit alan kaplayacak şekilde boyutlandırılır.
 */
export const TEAM_CREST_ASPECT = {
  galatasaray: 0.779,
  fenerbahce: 1,
  besiktas: 0.617,
  trabzonspor: 0.608,
  arsenal: 0.85,
  chelsea: 1,
  liverpool: 0.546,
  "manchester-city": 1,
  "manchester-united": 0.987,
  tottenham: 0.403,
  "real-madrid": 0.716,
  barcelona: 0.988,
  "atletico-madrid": 0.779,
  "bayern-munchen": 1,
  "borussia-dortmund": 1,
  inter: 1,
  juventus: 0.629,
  milan: 0.638,
  napoli: 1,
  "paris-saint-germain": 1,
  bursaspor: 0.915,
  goztepe: 1.178,
  "athletic-club": 0.883,
  sevilla: 0.821,
  valencia: 0.767,
  "bayer-leverkusen": 1.271,
  roma: 0.747,
  lazio: 1.5,
  marseille: 1.0,
  lyon: 0.86
} as const satisfies Record<Team, number>

/**
 * Tek renkten oluşan koyu armalar. Site arayüzünde koyu temada beyaz gösterilir; kulüpler de koyu zeminde
 * armalarının beyaz versiyonunu kullanır. Çok renkli armalar koyu zeminde zaten okunur, bu listeye girmez.
 */
export const MONOCHROME_CRESTS: ReadonlySet<Team> = new Set<Team>(["juventus", "tottenham"])

/**
 * SVG yerine görsel olarak tutulan armalar. Sevilla ve Roma'nın kaynak SVG'leri çok büyük (1,3 MB ve 240 KB);
 * kart filigranında yirmiden fazla kez çizildikleri için 500 px yüksekliğinde şeffaf WebP'ye çevrildi.
 */
export const TEAM_CREST_FILES: Partial<Record<Team, string>> = {
  sevilla: "sevilla.webp",
  roma: "roma.webp"
}
