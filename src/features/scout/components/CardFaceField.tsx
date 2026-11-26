import type { CardFace } from "@/constants/account.constants"
import { TEAM_NAMES } from "@/constants/team.constants"
import type { Team } from "@/constants/team.constants"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import * as m from "@/paraglide/messages.js"

/** Radyo grubunda "gerçek kart" seçeneğinin değeri. */
const REAL = "real"

type CardFaceFieldProps = {
  value: CardFace | null
  onChange: (face: CardFace | null) => void
  /** Formdaki favori takım; takım yoksa takım kartı seçilemez. */
  team: Team | null
  /** GitHub Stars programında mı; değilse GitHub Star seçeneği hiç gösterilmez. */
  githubStar: boolean
  disabled: boolean
}

/**
 * Profilde varsayılan gösterilecek kalıcı kart: gerçek kart, takım kartı ya da (yalnızca GitHub Stars'a)
 * GitHub Star kartı. Sıralama ve kapışmalar her zaman gerçek kartı kullanır.
 */
export function CardFaceField({ value, onChange, team, githubStar, disabled }: CardFaceFieldProps) {
  return (
    <RadioGroup
      aria-labelledby="card-face-label"
      value={value ?? REAL}
      onValueChange={(next) => onChange(next === "team" || next === "github-star" ? next : null)}
      disabled={disabled}
      className="flex w-auto flex-col gap-2"
    >
      <Label className="flex items-center gap-2 text-sm font-normal">
        <RadioGroupItem value={REAL} />
        {m.card_face_real()}
      </Label>
      <Label
        className="flex items-center gap-2 text-sm font-normal data-[disabled]:opacity-60"
        data-disabled={team ? undefined : ""}
      >
        <RadioGroupItem value="team" disabled={!team} />
        {team ? m.card_face_team({ team: TEAM_NAMES[team] }) : m.card_face_team_missing()}
      </Label>
      {githubStar ? (
        <Label className="flex items-center gap-2 text-sm font-normal">
          <RadioGroupItem value="github-star" />
          {m.card_face_star()}
        </Label>
      ) : null}
    </RadioGroup>
  )
}
