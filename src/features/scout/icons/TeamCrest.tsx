import type { CSSProperties } from "react"

import { cn } from "cn"

import type { Team } from "@/constants/team.constants"

import {
  MONOCHROME_CRESTS,
  TEAM_CREST_ASPECT,
  TEAM_CREST_FILES
} from "@/features/scout/constants/team-theme.constants"
import { crestFit } from "@/features/scout/helpers/crest-fit"

type TeamCrestProps = {
  team: Team
  /** Boşsa süs sayılır ve ekran okuyucuya okunmaz. */
  alt?: string
  /** Kare kutunun boyutu ve konumu; arma bu kutunun içine eşit alan kaplayacak şekilde oturur. */
  className?: string
  style?: CSSProperties
  /**
   * Site arayüzünde (kartın dışında) tek renkli koyu armayı koyu temada beyaz gösterir. Kartın kendi
   * renkleri temadan bağımsız olduğu için kartın içinde kullanılmaz.
   */
  adaptive?: boolean
}

/**
 * Kulüp arması. SVG'ler `public/crests` altında dosya olarak durur: bazıları onlarca KB, bileşene gömülse
 * kartın olduğu her sayfanın paketine girerdi. Kaynak: football-logos.cc. Uzun ve geniş armalar aynı kutuda
 * eşit alan kaplar, böylece göz için aynı büyüklükte durur.
 */
export function TeamCrest({ team, alt = "", className, style, adaptive = false }: TeamCrestProps) {
  const { width, height } = crestFit(TEAM_CREST_ASPECT[team])
  return (
    <span className={cn("grid place-items-center", className)} style={style}>
      <img
        src={`/crests/${TEAM_CREST_FILES[team] ?? `${team}.svg`}`}
        alt={alt}
        draggable={false}
        className={cn(
          "object-contain",
          adaptive && MONOCHROME_CRESTS.has(team) && "dark:brightness-0 dark:invert"
        )}
        style={{ width: `${width * 100}%`, height: `${height * 100}%` }}
      />
    </span>
  )
}
