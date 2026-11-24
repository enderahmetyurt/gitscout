import { z } from "zod"

import { usernameSchema } from "@/features/scout/schemas/player.schema"

/** Oyuncu sayfasındaki "Kapıştır" düğmesi ev sahibini önceden seçili gönderir. */
export const duelSearchSchema = z.object({
  left: usernameSchema.optional().catch(undefined)
})
