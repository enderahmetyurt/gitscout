import { useNavigate, useSearch } from "@tanstack/react-router"

import type { Team } from "@/constants/team.constants"

import { specialCardsSearchSchema } from "@/features/scout/schemas/special-cards-search.schema"

/** Takım vitrininde seçili takımı adresten okur ve yazar; geçmişe yeni kayıt eklemez, sayfa kaymaz. */
export function useTeamCardSearch() {
  const { team } = specialCardsSearchSchema.parse(useSearch({ strict: false }))
  const navigate = useNavigate()

  const setTeam = (next: Team) => {
    void navigate({
      to: ".",
      search: (prev) => ({ ...prev, team: next }),
      replace: true,
      resetScroll: false
    })
  }

  return { team, setTeam }
}
