import { mkdir, readFile, rename, writeFile } from "node:fs/promises"
import path from "node:path"

import { z } from "zod"

import { storedPlayerSchema } from "@/features/scout/schemas/player.schema"
import type { StoredPlayer } from "@/features/scout/types/player.types"

/**
 * Yerel geliştirme için JSON dosyası tabanlı depo.
 * Yayına alınırken yalnızca bu dosyanın içi bir veritabanıyla değiştirilir.
 */
const DATA_FILE = path.resolve(process.cwd(), "data/players.json")

const looseFileSchema = z.object({ players: z.record(z.string(), z.unknown()) })

type PlayersState = {
  valid: Record<string, StoredPlayer>
  /** Veri biçimi değiştiği için yeniden çekilmesi gereken oyuncular (eski kayıt olduğu gibi saklanır). */
  stale: Record<string, unknown>
}

async function readState(): Promise<PlayersState> {
  let text: string
  try {
    text = await readFile(DATA_FILE, "utf8")
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return { valid: {}, stale: {} }
    }
    throw new Error("data/players.json okunamadı", { cause: error })
  }

  const file = looseFileSchema.parse(JSON.parse(text))
  const state: PlayersState = { valid: {}, stale: {} }
  for (const [key, value] of Object.entries(file.players)) {
    const parsed = storedPlayerSchema.safeParse(value)
    if (parsed.success) state.valid[key] = parsed.data
    else state.stale[key] = value
  }
  return state
}

async function writeState(state: PlayersState) {
  await mkdir(path.dirname(DATA_FILE), { recursive: true })
  const players = Object.fromEntries(
    Object.entries({ ...state.stale, ...state.valid }).sort(([a], [b]) => a.localeCompare(b))
  )
  // Önce geçici dosyaya yazılır ki yarım kalan bir yazma dosyayı bozmasın.
  const temp = `${DATA_FILE}.tmp`
  await writeFile(temp, `${JSON.stringify({ players }, null, 2)}\n`, "utf8")
  await rename(temp, DATA_FILE)
}

const keyOf = (login: string) => login.toLowerCase()

export async function getPlayers(): Promise<StoredPlayer[]> {
  const state = await readState()
  return Object.values(state.valid)
}

export async function getStaleCount(): Promise<number> {
  const state = await readState()
  return Object.keys(state.stale).length
}

export async function getStoredPlayer(login: string): Promise<StoredPlayer | null> {
  const state = await readState()
  return state.valid[keyOf(login)] ?? null
}

export async function savePlayer(player: StoredPlayer) {
  const state = await readState()
  const key = keyOf(player.login)
  const previous = state.valid[key]
  delete state.stale[key]
  // Elle ayarlanan saat dilimi yenilemede kaybolmasın.
  state.valid[key] = { ...player, timezone: player.timezone ?? previous?.timezone }
  await writeState(state)
}
