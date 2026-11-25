import { useState } from "react"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from "@/components/ui/combobox"
import { RarityChip } from "@/features/scout/components/RarityChip"
import { matchesPlayer } from "@/features/scout/helpers/search-text"
import { usernameSchema } from "@/features/scout/schemas/player.schema"
import type { ListPlayer } from "@/features/scout/types/player.types"
import * as m from "@/paraglide/messages.js"

type PlayerComboboxProps = {
  id: string
  players: ListPlayer[]
  value: ListPlayer | null
  onChange: (player: ListPlayer | null) => void
  placeholder: string
  autoFocus?: boolean
  /** Listede olmayan geçerli bir kullanıcı adı yazılınca kartını çıkarma seçeneği gösterilir. */
  onCreate?: (username: string) => void
  isCreating?: boolean
}

/** Kayıtlı oyuncular arasında ad ve kullanıcı adıyla arar. */
export function PlayerCombobox({
  id,
  players,
  value,
  onChange,
  placeholder,
  autoFocus = false,
  onCreate,
  isCreating = false
}: PlayerComboboxProps) {
  const [query, setQuery] = useState("")
  const typed = usernameSchema.safeParse(query)
  const canCreate = onCreate !== undefined && typed.success

  return (
    <Combobox
      items={players}
      onInputValueChange={setQuery}
      autoHighlight
      value={value}
      onValueChange={onChange}
      itemToStringLabel={(player) => player.name}
      // Gizli form alanına bütün oyuncu verisi değil, yalnızca kullanıcı adı yazılsın.
      itemToStringValue={(player) => player.login}
      isItemEqualToValue={(a, b) => a.login === b.login}
      filter={(player, text) => matchesPlayer(player, text)}
    >
      {/* Ev sahibi önceden seçiliyse kullanıcı doğrudan rakibi aramaya başlar. */}
      <ComboboxInput id={id} placeholder={placeholder} showClear autoFocus={autoFocus} />
      <ComboboxContent>
        <ComboboxEmpty>
          {canCreate ? (
            <button
              type="button"
              disabled={isCreating}
              onClick={() => onCreate(typed.data)}
              className="w-full rounded-sm px-2 py-1.5 text-left text-sm text-foreground outline-none hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-60"
            >
              {isCreating ? m.add_preparing() : m.duel_add_new({ username: typed.data })}
            </button>
          ) : (
            m.duel_no_match()
          )}
        </ComboboxEmpty>
        <ComboboxList>
          {(player: ListPlayer) => (
            <ComboboxItem key={player.login} value={player}>
              <img
                src={player.avatarUrl}
                alt=""
                width={24}
                height={24}
                className="size-6 shrink-0 rounded-full bg-muted outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
              />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate">{player.name}</span>
                <span className="truncate text-xs text-muted-foreground">@{player.login}</span>
              </span>
              <RarityChip ovr={player.ovr} rarity={player.rarity} size="sm" />
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
