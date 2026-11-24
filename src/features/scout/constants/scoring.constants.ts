import type { Position, Rarity, StatKey } from "@/features/scout/types/player.types"

/** Bütün eşikler ve ağırlıklar burada; revizyonlar bu dosyadan yapılır. */

export const STAT_WEIGHTS: Record<StatKey, number> = {
  act: 0.2,
  imp: 0.2,
  com: 0.15,
  rep: 0.2,
  con: 0.1,
  exp: 0.15
}

export const STAT_LABELS: Record<StatKey, { short: string; label: string }> = {
  act: { short: "ACT", label: "Aktivite" },
  imp: { short: "IMP", label: "Etki" },
  com: { short: "COM", label: "Topluluk" },
  rep: { short: "REP", label: "Saygınlık" },
  con: { short: "CON", label: "İstikrar" },
  exp: { short: "EXP", label: "Kıdem" }
}

/** Kartta statların sırası: ilk üçü sol sütun, son üçü sağ sütun. */
export const STAT_ORDER: StatKey[] = ["act", "imp", "com", "rep", "con", "exp"]

/**
 * Her stat logaritmik ölçekte `fullAt` değerinde tavan yapar.
 * Tavanlar dünyanın en uç profillerine göre seçildi (ör. 300 bin takipçi, 500 bin yıldız):
 * 99 yalnızca gerçekten benzersiz değerlerde çıkar, güçlü profiller 85-95 bandına yayılır.
 */

/** Son 1 yıl: commit + PR + review + issue + private katkılar. */
export const ACT = {
  contributions: { max: 100, fullAt: 10_000 }
}

/** Kendi repoları + katkı payı oranında organizasyon repoları. */
export const IMP = {
  stars: { max: 75, fullAt: 500_000 },
  forks: { max: 25, fullAt: 100_000 },
  /** Org reposunda son bir yılın commit'lerinin bu kadarı kullanıcınınsa yıldızların tamamı yazılır. */
  orgFullShare: 0.25
}

export const COM = {
  followers: { max: 100, fullAt: 300_000 }
}

/** Başkasının kodunu kabul etmesi: kodu okumadan elde edilebilecek en güçlü güven sinyali. */
export const REP = {
  externalPrs: { max: 60, fullAt: 2_000 },
  reviews: { max: 40, fullAt: 2_000 }
}

export const CON = {
  activeWeeks: { max: 50, fullAt: 52 },
  streak: { max: 25, fullAt: 365 },
  years: { max: 25, span: 5, minContributions: 50 }
}

export const EXP = {
  lifetime: { max: 60, fullAt: 100_000 },
  accountAge: { max: 40, fullAtYears: 18 }
}

/** Rozetler için commit örneklemi. */
export const COMMIT_SAMPLE_SIZE = 300

export const ACTIVE_REPOS = {
  /** Son bir yılda en az bu kadar commit atılan başka sahipli repolar aktif sayılır. */
  contributedMinCommits: 10,
  max: 30
}

export const LANGUAGE_MIN_SHARE = 0.05

/**
 * Ham puanı (0-100) FIFA ölçeğine yayan eğri: [ham, gösterilen] noktaları arasında doğrusal.
 * FIFA'da olduğu gibi aktif oyuncular 70-85 bandında toplanır, 90+ en iyilere kalır.
 * Ham sıralama değişmez; yalnızca gösterilen sayı değişir.
 */
export const DISPLAY_CURVE: [number, number][] = [
  [0, 30],
  [20, 55],
  [38, 70],
  [57, 81],
  [70, 86],
  [82, 90],
  [100, 99]
]

export const RARITY_THRESHOLDS: { rarity: Rarity; min: number }[] = [
  { rarity: "icon", min: 90 },
  { rarity: "gold", min: 80 },
  { rarity: "silver", min: 65 },
  { rarity: "bronze", min: 0 }
]

export const RARITY_LABELS: Record<Rarity, string> = {
  icon: "İkon",
  gold: "Altın",
  silver: "Gümüş",
  bronze: "Bronz"
}

/** Dil → mevki grubu. Listede olmayan diller mevki hesabına girmez. */
export const LANGUAGE_GROUPS: Record<string, Exclude<Position, "Full Stack">> = {
  TypeScript: "Frontend",
  JavaScript: "Frontend",
  CSS: "Frontend",
  SCSS: "Frontend",
  Sass: "Frontend",
  Less: "Frontend",
  HTML: "Frontend",
  Vue: "Frontend",
  Svelte: "Frontend",
  Astro: "Frontend",
  MDX: "Frontend",
  Go: "Backend",
  Java: "Backend",
  Python: "Backend",
  PHP: "Backend",
  Ruby: "Backend",
  Elixir: "Backend",
  Scala: "Backend",
  Clojure: "Backend",
  Shell: "DevOps",
  HCL: "DevOps",
  Dockerfile: "DevOps",
  Nix: "DevOps",
  PowerShell: "DevOps",
  Makefile: "DevOps",
  Swift: "Mobile",
  Kotlin: "Mobile",
  Dart: "Mobile",
  "Objective-C": "Mobile",
  "Jupyter Notebook": "Data",
  R: "Data",
  Cuda: "Data",
  MATLAB: "Data",
  Julia: "Data",
  C: "Systems",
  "C++": "Systems",
  Rust: "Systems",
  Zig: "Systems",
  Assembly: "Systems",
  "C#": "Backend",
  GDScript: "Game Dev",
  ShaderLab: "Game Dev",
  HLSL: "Game Dev"
}

/** Frontend ve Backend payları bu oranı geçerse Full Stack. */
export const FULL_STACK_MIN_SHARE = 0.3

/** Football Manager tarzı renk kademeleri: değer bu eşiğe eşit ya da üstündeyse o kademe. */
export const STAT_TIERS = [
  { tier: "elite", min: 90 },
  { tier: "great", min: 80 },
  { tier: "good", min: 70 },
  { tier: "fair", min: 60 },
  { tier: "poor", min: 0 }
] as const

export type StatTier = (typeof STAT_TIERS)[number]["tier"]
