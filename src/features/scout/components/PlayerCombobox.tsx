import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from "@/components/ui/combobox"
import { RarityChip } from "@/features/scout/components/RarityChip"
import type { ScoredPlayer } from "@/features/scout/types/player.types"

type PlayerComboboxProps = {
  id: string
  players: ScoredPlayer[]
  value: ScoredPlayer | null
  onChange: (player: ScoredPlayer | null) => void
  placeholder: string
  autoFocus?: boolean
}

const normalize = (text: string) => text.toLocaleLowerCase("tr-TR")

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
      filter={(player, query) => {
        const q = normalize(query.trim().replace(/^@/, ""))
        return normalize(player.name).includes(q) || normalize(player.login).includes(q)
      }}
    >
      {/* Ev sahibi önceden seçiliyse kullanıcı doğrudan rakibi aramaya başlar. */}
      <ComboboxInput id={id} placeholder={placeholder} showClear autoFocus={autoFocus} />
      <ComboboxContent>
        <ComboboxEmpty>Bu adla bir oyuncu yok.</ComboboxEmpty>
        <ComboboxList>
          {(player: ScoredPlayer) => (
            <ComboboxItem key={player.login} value={player}>
              <img
                src={player.avatarUrl}
                alt=""
                width={24}
                height={24}
                className="size-6 shrink-0 rounded-full bg-muted"
              />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate">{player.name}</span>
                <span className="truncate text-xs text-muted-foreground">@{player.login}</span>
              </span>
              <RarityChip ovr={player.ovr} rarity={player.rarity} className="h-6 min-w-9 text-xs" />
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
