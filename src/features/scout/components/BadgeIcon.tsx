import {
  Award,
  CalendarCheck,
  CircleCheck,
  Earth,
  Eye,
  FileText,
  Flame,
  FlaskConical,
  GitCommitHorizontal,
  GitPullRequest,
  Languages,
  Megaphone,
  Moon,
  Ruler,
  Star,
  Sunrise,
  TreePalm,
  Users
} from "lucide-react"
import type { LucideIcon, LucideProps } from "lucide-react"

import type { BadgeId } from "@/features/scout/types/player.types"

const BADGE_ICONS = {
  "night-owl": Moon,
  "early-bird": Sunrise,
  "weekend-warrior": TreePalm,
  marathon: Flame,
  "green-tick": CircleCheck,
  polyglot: Languages,
  "conventional-disciple": Ruler,
  "star-collector": Star,
  "oss-ambassador": Earth,
  "test-obsessed": FlaskConical,
  "commit-machine": GitCommitHorizontal,
  "pr-machine": GitPullRequest,
  "code-reviewer": Eye,
  "community-leader": Megaphone,
  "team-player": Users,
  documenter: FileText,
  veteran: Award,
  regular: CalendarCheck
} as const satisfies Record<BadgeId, LucideIcon>

type BadgeIconProps = LucideProps & {
  id: BadgeId
}

/** Rozetin ikonu; anlam rozet adında olduğu için ekran okuyuculardan gizli. */
export function BadgeIcon({ id, ...props }: BadgeIconProps) {
  const Icon = BADGE_ICONS[id]
  return <Icon aria-hidden {...props} />
}
