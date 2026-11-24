import { LANGUAGE_ICONS } from "@/features/scout/constants/language-icons.constants"

type LanguageIconProps = {
  name: string | null
}

/** svgl.app ikonu; ikonu olmayan diller baş harfle gösterilir. Dil adı yanında yazdığı için dekoratif. */
export function LanguageIcon({ name }: LanguageIconProps) {
  // Dili olmayan depo (yalnızca belge, yapılandırma) için yer tutucu gösterilmez.
  if (!name) return null
  const icon = LANGUAGE_ICONS[name]
  if (icon) {
    return (
      <img
        src={`/icons/languages/${icon}.svg`}
        alt=""
        width={14}
        height={14}
        loading="lazy"
        className="size-3.5 shrink-0 object-contain"
      />
    )
  }
  return (
    <span
      aria-hidden
      className="grid size-3.5 shrink-0 place-items-center rounded-sm bg-muted text-[9px] font-semibold"
    >
      {name.charAt(0)}
    </span>
  )
}
