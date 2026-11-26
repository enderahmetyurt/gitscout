import { z } from "zod"

import { CARD_FACES, GENDERS } from "@/constants/account.constants"
import { TEAMS } from "@/constants/team.constants"

import { COUNTRIES } from "@/features/scout/constants/player-country.constants"
import { CITY_LENGTH, DREAM_TEAM_SIZE } from "@/features/scout/constants/profile.constants"
import { usernameSchema } from "@/features/scout/schemas/player.schema"
import * as m from "@/paraglide/messages.js"

const CITY_PATTERN = /^\p{L}[\p{L}\p{M} '’-]*$/u

/** Yazılan şehir adını saklanacak biçime getirir: Unicode NFC, tek boşluk, baş ve sonda boşluk yok. */
const normalizeCity = (value: string) => value.normalize("NFC").replace(/\s+/g, " ").trim()

/** Boş metin "şehir yok" demektir; dolu metin harf kuralına ve uzunluk sınırına uyar. */
const citySchema = z
  .string()
  .transform(normalizeCity)
  .refine(
    (value) =>
      value === "" ||
      (value.length >= CITY_LENGTH.min &&
        value.length <= CITY_LENGTH.max &&
        CITY_PATTERN.test(value)),
    { error: () => m.city_invalid() }
  )

const dreamTeamSchema = z
  .array(usernameSchema.transform((login) => login.toLowerCase()))
  .max(DREAM_TEAM_SIZE)
  .refine((logins) => new Set(logins).size === logins.length)

/** Ayarlar sayfasındaki profil formu. Doğum tarihi boşsa "değişmedi" sayılır. */
export const profileFormSchema = z.object({
  country: z.enum(COUNTRIES).nullable(),
  birthDate: z.union([z.literal(""), z.iso.date()]),
  city: citySchema,
  gender: z.enum(GENDERS).nullable(),
  dreamTeam: dreamTeamSchema,
  favoriteTeam: z.enum(TEAMS).nullable(),
  cardFace: z.enum(CARD_FACES).nullable()
})

export type ProfileFormInput = z.input<typeof profileFormSchema>
export type ProfileFormValues = z.output<typeof profileFormSchema>

/**
 * Sunucuya giden isteğe bağlı profil bilgileri; yalnızca değişen alanlar gönderilir.
 * Boş şehir `null` olarak saklanır.
 */
export const profileDetailsSchema = z
  .object({
    city: citySchema.transform((value) => (value === "" ? null : value)),
    gender: z.enum(GENDERS).nullable(),
    dreamTeam: dreamTeamSchema,
    favoriteTeam: z.enum(TEAMS).nullable(),
    cardFace: z.enum(CARD_FACES).nullable()
  })
  .partial()

export type ProfileDetailsInput = z.input<typeof profileDetailsSchema>
