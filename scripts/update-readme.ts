// README'deki ilk 100 tablosunu sitedeki /api/top.json'dan yeniden yazar.
// Bağımlılığı yok; GitHub Action'da `node scripts/update-readme.ts` ile çalışır (Node 22'nin tip silmesiyle).
// Tablo yalnızca işaretler arasında değişir; veri aynıysa dosya da aynı kalır, böylece boş commit atılmaz.

import { readFile, writeFile } from "node:fs/promises"

import type { TopPlayer } from "@/features/scout/helpers/top-player"

const SITE_URL = (process.env.SITE_URL ?? "https://gitscout.io").replace(/\/$/, "")
const README = process.env.README_PATH ?? "README.md"
const START = "<!-- LEADERBOARD:START -->"
const END = "<!-- LEADERBOARD:END -->"

const TIERS: Record<TopPlayer["rarity"], string> = {
  icon: "Icon",
  gold: "Gold",
  silver: "Silver",
  bronze: "Bronze"
}
const STAT_KEYS = ["act", "imp", "com", "rep", "con", "exp"] as const
const LOGIN = /^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){0,38}$/i
const AVATAR_HOST = "https://avatars.githubusercontent.com/"

/** Tablo için gereken alanlar; veri dışarıdan geldiği için her alan tek tek doğrulanır. */
type Row = Pick<TopPlayer, "rank" | "login" | "avatarUrl" | "ovr" | "rarity" | "position"> & {
  country: string | null
  stats: Record<(typeof STAT_KEYS)[number], number>
}

const isRecord = (value: unknown): value is object => typeof value === "object" && value !== null
const isNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value)
const isRarity = (value: unknown): value is TopPlayer["rarity"] =>
  typeof value === "string" && Object.hasOwn(TIERS, value)
const isPosition = (value: unknown): value is TopPlayer["position"] =>
  typeof value === "string" && /^[A-Za-z ]{1,20}$/.test(value)

function parseRow(value: unknown): Row | null {
  if (!isRecord(value)) return null
  const get = (key: string): unknown => Reflect.get(value, key)
  const rank = get("rank")
  const login = get("login")
  const avatarUrl = get("avatarUrl")
  const ovr = get("ovr")
  const rarity = get("rarity")
  const position = get("position")
  const country = get("country")
  const rawStats = get("stats")
  if (
    !isNumber(rank) ||
    typeof login !== "string" ||
    !LOGIN.test(login) ||
    typeof avatarUrl !== "string" ||
    !avatarUrl.startsWith(AVATAR_HOST) ||
    !isNumber(ovr) ||
    !isRarity(rarity) ||
    !isPosition(position) ||
    !isRecord(rawStats)
  ) {
    return null
  }
  const values = STAT_KEYS.map((key): unknown => Reflect.get(rawStats, key))
  const [act, imp, com, rep, con, exp] = values
  if (
    !isNumber(act) ||
    !isNumber(imp) ||
    !isNumber(com) ||
    !isNumber(rep) ||
    !isNumber(con) ||
    !isNumber(exp)
  ) {
    return null
  }
  return {
    rank,
    login,
    avatarUrl,
    ovr,
    rarity,
    position,
    country: typeof country === "string" ? country : null,
    stats: { act, imp, com, rep, con, exp }
  }
}

/** ISO ülke kodunu bayrak emojisine çevirir ("TR" → 🇹🇷); bilinmeyen kod boş kalır. */
function flag(code: string | null): string {
  if (code === null || !/^[A-Z]{2}$/.test(code)) return ""
  return String.fromCodePoint(...[...code].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65))
}

/** GitHub avatarını küçük boyda ister; 100 satırda sayfa hafif kalır. */
const smallAvatar = (url: string) => `${url}${url.includes("?") ? "&" : "?"}s=40`

function renderRow(row: Row): string {
  const avatar = `<img src="${smallAvatar(row.avatarUrl)}" width="20" height="20" alt="" />`
  const developer = `${avatar} [${row.login}](${SITE_URL}/u/${row.login})`
  const cells = [
    String(row.rank),
    developer,
    flag(row.country),
    `**${row.ovr}**`,
    TIERS[row.rarity],
    row.position,
    ...STAT_KEYS.map((key) => String(row.stats[key]))
  ]
  return `| ${cells.join(" | ")} |`
}

function renderTable(rows: Row[]): string {
  return [
    "<!-- prettier-ignore-start -->",
    "| # | Developer | | OVR | Tier | Role | ACT | IMP | COM | REP | CON | EXP |",
    "|--:|:--|:-:|--:|:--|:--|--:|--:|--:|--:|--:|--:|",
    ...rows.map(renderRow),
    "<!-- prettier-ignore-end -->"
  ].join("\n")
}

async function fetchTop(): Promise<Row[]> {
  const response = await fetch(`${SITE_URL}/api/top.json`, {
    headers: { accept: "application/json" }
  })
  if (!response.ok) throw new Error(`/api/top.json ${response.status} döndü`)
  const body: unknown = await response.json()
  const players: unknown = isRecord(body) ? Reflect.get(body, "players") : null
  if (!Array.isArray(players) || players.length === 0) {
    throw new Error("/api/top.json oyuncu listesi boş")
  }
  const rows = players.map(parseRow)
  const valid = rows.filter((row) => row !== null)
  // Tek bir bozuk kayıt bile tabloyu yanlış yazmasın: iş durur, README olduğu gibi kalır.
  if (valid.length !== rows.length) {
    throw new Error(`/api/top.json içinde ${rows.length - valid.length} geçersiz kayıt var`)
  }
  return valid
}

const readme = await readFile(README, "utf8")
const start = readme.indexOf(START)
const end = readme.indexOf(END)
if (start === -1 || end === -1 || end < start) {
  throw new Error(`${README} içinde ${START} ve ${END} işaretleri bulunamadı`)
}

const table = renderTable(await fetchTop())
const next = `${readme.slice(0, start + START.length)}\n${table}\n${readme.slice(end)}`

if (next === readme) {
  console.warn("README değişmedi")
} else {
  await writeFile(README, next)
  console.warn("README güncellendi")
}
