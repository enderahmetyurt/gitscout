import type { ScoredPlayer } from "@/features/scout/types/player.types"

/** Profil adımı biter bitmez gelen özet; kart hazır olmadan kişinin kendini görmesi için. */
export type ScoutingProfile = {
  login: string
  name: string | null
  avatarUrl: string
}

/** GitHub'dan veri toplanırken biten her aşama; sıra sabittir. */
export type ScoutingStage =
  { stage: "profile"; profile: ScoutingProfile } | { stage: "repos" } | { stage: "activity" }

/** Kart ekleme akışı: önce biten aşamalar, en sonda kaydedilen kart. */
export type AddPlayerEvent =
  ({ type: "stage" } & ScoutingStage) | { type: "done"; player: ScoredPlayer }
