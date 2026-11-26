import { useState } from "react"

import { useQuery } from "@tanstack/react-query"
import { IdCard } from "lucide-react"
import { cn } from "cn"
import { useWatch } from "react-hook-form"

import { ACCOUNT_ELIGIBILITY } from "@/constants/account.constants"
import type { Gender, CardFace as ProfileCardFace } from "@/constants/account.constants"
import type { Team } from "@/constants/team.constants"

import { useViewer } from "@/hooks/use-viewer"

import { Skeleton } from "@/components/ui/skeleton"
import { playerQueryOptions } from "@/features/scout/api/players.queries"
import { CardOccasionPicker } from "@/features/scout/components/CardOccasionPicker"
import { PlayerCard } from "@/features/scout/components/PlayerCard"
import { ProfileForm } from "@/features/scout/components/ProfileForm"
import { ReadmeBadgeSection } from "@/features/scout/components/ReadmeBadgeSection"
import { SettingsSkeleton } from "@/features/scout/components/SettingsSkeleton"
import { SignInPanel } from "@/features/scout/components/SignInPanel"
import { VerifiedIcon } from "@/features/scout/components/VerifiedIcon"
import { COUNTRIES } from "@/features/scout/constants/player-country.constants"
import type { CountryCode } from "@/features/scout/constants/player-country.constants"
import { BIRTHDAY_OVR } from "@/features/scout/helpers/birthday"
import { playerCountry } from "@/features/scout/helpers/player-country"
import { useProfileForm } from "@/features/scout/hooks/use-profile-form"
import type { CardOccasion } from "@/features/scout/types/card-preview.types"
import type { ListPlayer } from "@/features/scout/types/player.types"
import * as m from "@/paraglide/messages.js"
import { getLocale } from "@/paraglide/runtime.js"

/**
 * Giriş yapan kişinin ayarları. Görünürlük yalnızca arayüz içindir: kaydetme isteğinde kim olduğu
 * ve onay durumu sunucuda oturumdan yeniden okunur. Yeni ayarlar buraya bölüm olarak eklenir.
 */
export function SettingsPage() {
  const { data: viewer, isPending } = useViewer()
  const country = COUNTRIES.find((code) => code === viewer?.country)

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 pt-6 pb-20 outline-none sm:px-6"
    >
      {/* Giriş yapılmamışken sayfanın ana başlığını giriş tanıtımı verir; iki başlık üst üste binmez. */}
      <div className={cn("flex flex-col gap-2", !isPending && !viewer && "sr-only")}>
        <h1 className="text-3xl font-bold">{m.settings_title()}</h1>
        {viewer ? (
          <div className="flex flex-col gap-1">
            <p className="flex items-center gap-1.5 font-mono text-sm text-muted-foreground">
              @{viewer.login}
              {viewer.eligible ? <VerifiedIcon /> : null}
            </p>
            {viewer.verifiedAt ? (
              <p className="text-xs text-muted-foreground">
                {m.settings_verified_since({
                  date: new Intl.DateTimeFormat(getLocale(), { dateStyle: "long" }).format(
                    new Date(viewer.verifiedAt)
                  )
                })}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {isPending ? (
        <SettingsSkeleton />
      ) : !viewer ? (
        <div className="pt-4">
          <SignInPanel title={m.settings_signed_out_title()} lead={m.settings_signed_out()} />
        </div>
      ) : (
        <SettingsContent
          login={viewer.login}
          eligible={viewer.eligible}
          country={country}
          birthDate={viewer.birthDate}
          birthDateChangesLeft={viewer.birthDateChangesLeft}
          city={viewer.city}
          gender={viewer.gender}
          dreamTeam={viewer.dreamTeam}
          favoriteTeam={viewer.favoriteTeam}
          cardFace={viewer.cardFace}
        />
      )}
    </main>
  )
}

type SettingsContentProps = {
  login: string
  eligible: boolean
  country?: CountryCode
  birthDate: string | null
  birthDateChangesLeft: number
  city: string | null
  gender: Gender | null
  dreamTeam: string[]
  favoriteTeam: Team | null
  cardFace: ProfileCardFace | null
}

/** Form burada kurulur ki kart, kaydetmeden önce seçilen ülkeyi anlık gösterebilsin. */
function SettingsContent({
  login,
  eligible,
  country,
  birthDate,
  birthDateChangesLeft,
  city,
  gender,
  dreamTeam,
  favoriteTeam,
  cardFace
}: SettingsContentProps) {
  const { data: player, isPending } = useQuery(playerQueryOptions(login))
  const form = useProfileForm({
    country,
    birthDate,
    city,
    gender,
    dreamTeam,
    favoriteTeam,
    cardFace
  })
  const draft = useWatch({ control: form.control, name: "country" })
  const changed = draft !== (country ?? null)
  // Seçilen ülke yalnızca onaylı hesapta karta yansır; diğerlerinde kart olduğu gibi kalır.
  const previewPlayer =
    player && eligible ? { ...player, claimedCountry: draft ?? undefined } : player
  // Kart her değişimde yarım tur daha döner; görünür olmayan yüz bir önceki kartı tutar, böylece
  // gerçek → doğum günü → Kadınlar Günü gibi her geçişte dönüş baştan sona oynar.
  const [flip, setFlip] = useState<{ turns: number; faces: [CardFace, CardFace] }>({
    turns: 0,
    faces: ["real", "real"]
  })
  const visibleIndex = flip.turns % 2
  const shown = flip.faces[visibleIndex] ?? "real"

  const genderDraft = useWatch({ control: form.control, name: "gender" })
  const teamDraft = useWatch({ control: form.control, name: "favoriteTeam" })
  // Yalnızca kişiye o gün çıkacak kartlar önizlenir: Kadınlar Günü kadın seçiliyken, Cumhuriyet Bayramı ülkesi
  // Türkiye iken. Takım kartı seçilen takımınki; diğer takımlar özel kartlar sayfasında görülür.
  const occasionOptions: CardOccasion[] = [
    "birthday",
    // GitHub Star kartını herkes önizleyip indirebilir; kalıcı seçim yalnızca GitHub Stars'a açık olacak.
    "github-star",
    "new-year",
    "programmers-day",
    "halloween",
    ...(previewPlayer && playerCountry(previewPlayer) === "TR" ? (["republic-day"] as const) : []),
    ...(eligible && genderDraft === "female" ? (["womens-day"] as const) : []),
    ...(eligible && teamDraft ? [teamDraft] : [])
  ]

  const changePreview = (next: CardOccasion | null) => {
    const target: CardFace = next ?? "real"
    if (target === shown) return
    setFlip(({ turns, faces }) => {
      const nextFaces: [CardFace, CardFace] = [faces[0], faces[1]]
      nextFaces[(turns + 1) % 2] = target
      return { turns: turns + 1, faces: nextFaces }
    })
  }

  return (
    // Sol sütun her zaman yerinde: kart yüklenirken iskelet, kart yoksa yer tutucu durur; form sağda kalır.
    <div className="grid items-start gap-8 md:grid-cols-[20rem_1fr]">
      <aside className="flex flex-col items-center gap-3 md:sticky md:top-6">
        {previewPlayer ? (
          <>
            <div
              data-rarity={shown === "birthday" ? "icon" : previewPlayer.rarity}
              className="relative flex w-full justify-center perspective-distant"
            >
              <div aria-hidden className="scout-card-glow pointer-events-none absolute -inset-8" />
              {/* İki yüzlü kart, yalnızca önizleme: gerçek, doğum günü ya da Kadınlar Günü kartı. */}
              <div
                className="relative transition-transform duration-700 ease-out transform-3d motion-reduce:transition-none"
                style={{ transform: `rotateY(${flip.turns * 180}deg)` }}
              >
                <div aria-hidden={visibleIndex !== 0} className="backface-hidden">
                  {/* Her dönüşte yeniden kurulur: süsler aşağıdan süzülüp gelir. */}
                  <div key={`${flip.faces[0]}-${flip.turns}`} className="card-lift">
                    <PreviewCard player={previewPlayer} face={flip.faces[0]} />
                  </div>
                </div>
                <div
                  aria-hidden={visibleIndex !== 1}
                  className="absolute inset-0 rotate-y-180 backface-hidden"
                >
                  <div key={`${flip.faces[1]}-${flip.turns}`} className="card-lift">
                    <PreviewCard player={previewPlayer} face={flip.faces[1]} />
                  </div>
                </div>
              </div>
            </div>
            <CardOccasionPicker
              value={shown === "real" ? null : shown}
              options={occasionOptions}
              onChange={changePreview}
            />
            <p
              aria-live="polite"
              className={cn(
                "text-center text-xs text-muted-foreground transition-opacity",
                changed ? "opacity-100" : "opacity-0"
              )}
            >
              {changed ? m.settings_card_preview() : null}
            </p>
          </>
        ) : isPending ? (
          <Skeleton className="h-120 w-80 rounded-[28px]" />
        ) : (
          <div className="flex h-120 w-80 max-w-full flex-col items-center justify-center gap-2 rounded-[28px] border border-dashed p-6 text-center">
            <IdCard aria-hidden className="size-6 text-muted-foreground" />
            <p className="text-sm text-pretty text-muted-foreground">{m.settings_no_card()}</p>
          </div>
        )}
      </aside>

      <div className="flex min-w-0 flex-col gap-6">
        {eligible ? (
          <ProfileForm
            form={form}
            login={login}
            birthDate={birthDate}
            birthDateChangesLeft={birthDateChangesLeft}
            cardPreview={shown === "real" ? null : shown}
            onCardPreviewChange={changePreview}
          />
        ) : (
          <p className="surface p-4 text-sm text-muted-foreground">
            {m.owner_not_eligible({
              months: ACCOUNT_ELIGIBILITY.minAgeMonths,
              followers: ACCOUNT_ELIGIBILITY.minFollowers
            })}
          </p>
        )}
        {player ? (
          <ReadmeBadgeSection login={player.login} ovr={player.ovr} rarity={player.rarity} />
        ) : null}
      </div>
    </div>
  )
}

type CardFace = CardOccasion | "real"

/** Önizlemedeki tek bir yüz. Doğum günü kartı 100 puanlıdır; diğer özel kartlarda puanlar gerçek. */
function PreviewCard({ player, face }: { player: ListPlayer; face: CardFace }) {
  if (face === "real") return <PlayerCard player={player} />
  if (face === "birthday") {
    return (
      <PlayerCard
        player={{ ...player, ovr: BIRTHDAY_OVR, ovrExact: BIRTHDAY_OVR, rarity: "icon" }}
        occasion="birthday"
      />
    )
  }
  return <PlayerCard player={player} occasion={face} />
}
