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
import type { ScoredPlayer } from "@/features/scout/types/player.types"
import * as m from "@/paraglide/messages.js"

type PlayerComboboxProps = {
  id: string
  players: ScoredPlayer[]
  value: ScoredPlayer | null
  onChange: (player: ScoredPlayer | null) => void
  placeholder: string
  autoFocus?: boolean
}

/** Kayıtlı oyuncular arasında ad ve kullanıcı adıyla arar. */
export function PlayerCombobox({
  id,
  players,
  value,
  onChange,
  placeholder,
  autoFocus = false
}: PlayerComboboxProps) {
  return (
    <Combobox
      items={players}
      autoHighlight
      value={value}
      onValueChange={onChange}
      itemToStringLabel={(player) => player.name}
      isItemEqualToValue={(a, b) => a.login === b.login}
      filter={(player, query) => matchesPlayer(player, query)}
    >
      {/* Ev sahibi önceden seçiliyse kullanıcı doğrudan rakibi aramaya başlar. */}
      <ComboboxInput id={id} placeholder={placeholder} showClear autoFocus={autoFocus} />
      <ComboboxContent>
        <ComboboxEmpty>{m.duel_no_match()}</ComboboxEmpty>
        <ComboboxList>
          {(player: ScoredPlayer) => (
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
              <RarityChip ovr={player.ovr} rarity={player.rarity} className="text-xs" />
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
