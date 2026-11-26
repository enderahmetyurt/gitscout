import { z } from "zod"

import { TEAMS } from "@/constants/team.constants"

/** Özel kartlar sayfasında seçili takım; bağlantı doğrudan o takımın kartını açar. Tanınmayan değer yok sayılır. */
export const specialCardsSearchSchema = z.object({
  team: z.enum(TEAMS).optional().catch(undefined)
})
