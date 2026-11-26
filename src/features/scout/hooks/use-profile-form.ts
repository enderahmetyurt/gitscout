import { zodResolver } from "@hookform/resolvers/zod"
import { maskResolver } from "@virastack/mask"
import { useForm } from "react-hook-form"

import type { CardFace, Gender } from "@/constants/account.constants"
import type { Team } from "@/constants/team.constants"

import type { CountryCode } from "@/features/scout/constants/player-country.constants"
import { CITY_MASK } from "@/features/scout/constants/profile.constants"
import { profileFormSchema } from "@/features/scout/schemas/profile.schema"
import type { ProfileFormInput, ProfileFormValues } from "@/features/scout/schemas/profile.schema"

/** Formdaki maskeli alanlar; hem `useViraMask` hem çözümleyici aynı tanımı okur. */
export const PROFILE_MASKS = { city: CITY_MASK } as const

type SavedProfile = {
  country?: CountryCode
  birthDate: string | null
  city: string | null
  gender: Gender | null
  dreamTeam: string[]
  favoriteTeam?: Team | null
  cardFace?: CardFace | null
}

/** Kayıtlı bilgilerle açılan profil formu. Boş doğum tarihi ve boş şehir "girilmedi" demektir. */
export function useProfileForm(saved: SavedProfile) {
  return useForm<ProfileFormInput, unknown, ProfileFormValues>({
    resolver: maskResolver(PROFILE_MASKS, zodResolver(profileFormSchema)),
    defaultValues: {
      country: saved.country ?? null,
      birthDate: saved.birthDate ?? "",
      city: saved.city ?? "",
      gender: saved.gender,
      dreamTeam: saved.dreamTeam,
      favoriteTeam: saved.favoriteTeam ?? null,
      cardFace: saved.cardFace ?? null
    }
  })
}
