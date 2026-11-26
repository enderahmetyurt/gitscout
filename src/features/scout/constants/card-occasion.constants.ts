import type { ComponentType, SVGProps } from "react"

import { Cake, Flower2, Ghost, PartyPopper, ShieldHalf, Star, Terminal } from "lucide-react"

import { TEAM_NAMES } from "@/constants/team.constants"
import type { Team } from "@/constants/team.constants"

import { CrescentStarIcon } from "@/features/scout/icons/CrescentStarIcon"
import type { CardOccasion } from "@/features/scout/types/card-preview.types"
import * as m from "@/paraglide/messages.js"

/**
 * Her özel kartın simgesi ve metinleri: kart etiketi (`chip`), kartın adındaki kutlama satırı (`wish`)
 * ve kartın adı (`card`). Mesajlar fonksiyon olarak tutulur, okunduğu anda geçerli dilde yazılır.
 */
/** Takım kartında etiket kulübün adı, kartın adı "<Kulüp> kartı". */
const teamCard = (team: Team, wish: () => string) => ({
  icon: ShieldHalf,
  chip: () => TEAM_NAMES[team],
  wish,
  card: () => m.team_card({ team: TEAM_NAMES[team] })
})

export const CARD_OCCASIONS = {
  birthday: {
    icon: Cake,
    chip: m.birthday_chip,
    wish: m.birthday_heading,
    card: m.birthday_card
  },
  "womens-day": {
    icon: Flower2,
    chip: m.womens_day_chip,
    wish: m.womens_day_wish,
    card: m.special_womens_title
  },
  "programmers-day": {
    icon: Terminal,
    chip: m.programmers_day_chip,
    wish: m.programmers_day_wish,
    card: m.programmers_day_card
  },
  "republic-day": {
    icon: CrescentStarIcon,
    chip: m.republic_day_chip,
    wish: m.republic_day_wish,
    card: m.republic_day_card
  },
  halloween: {
    icon: Ghost,
    chip: m.halloween_chip,
    wish: m.halloween_wish,
    card: m.halloween_card
  },
  "new-year": {
    icon: PartyPopper,
    chip: m.new_year_chip,
    wish: m.new_year_wish,
    card: m.new_year_card
  },
  "github-star": {
    icon: Star,
    chip: m.github_star_chip,
    wish: m.github_star_wish,
    card: m.github_star_card
  },
  galatasaray: teamCard("galatasaray", m.team_wish_galatasaray),
  fenerbahce: teamCard("fenerbahce", m.team_wish_fenerbahce),
  besiktas: teamCard("besiktas", m.team_wish_besiktas),
  trabzonspor: teamCard("trabzonspor", m.team_wish_trabzonspor),
  arsenal: teamCard("arsenal", m.team_wish_arsenal),
  chelsea: teamCard("chelsea", m.team_wish_chelsea),
  liverpool: teamCard("liverpool", m.team_wish_liverpool),
  "manchester-city": teamCard("manchester-city", m.team_wish_manchester_city),
  "manchester-united": teamCard("manchester-united", m.team_wish_manchester_united),
  tottenham: teamCard("tottenham", m.team_wish_tottenham),
  "real-madrid": teamCard("real-madrid", m.team_wish_real_madrid),
  barcelona: teamCard("barcelona", m.team_wish_barcelona),
  "atletico-madrid": teamCard("atletico-madrid", m.team_wish_atletico_madrid),
  "bayern-munchen": teamCard("bayern-munchen", m.team_wish_bayern_munchen),
  "borussia-dortmund": teamCard("borussia-dortmund", m.team_wish_borussia_dortmund),
  inter: teamCard("inter", m.team_wish_inter),
  juventus: teamCard("juventus", m.team_wish_juventus),
  milan: teamCard("milan", m.team_wish_milan),
  napoli: teamCard("napoli", m.team_wish_napoli),
  "paris-saint-germain": teamCard("paris-saint-germain", m.team_wish_paris_saint_germain),
  bursaspor: teamCard("bursaspor", m.team_wish_bursaspor),
  goztepe: teamCard("goztepe", m.team_wish_goztepe),
  "athletic-club": teamCard("athletic-club", m.team_wish_athletic_club),
  sevilla: teamCard("sevilla", m.team_wish_sevilla),
  valencia: teamCard("valencia", m.team_wish_valencia),
  "bayer-leverkusen": teamCard("bayer-leverkusen", m.team_wish_bayer_leverkusen),
  roma: teamCard("roma", m.team_wish_roma),
  lazio: teamCard("lazio", m.team_wish_lazio),
  marseille: teamCard("marseille", m.team_wish_marseille),
  lyon: teamCard("lyon", m.team_wish_lyon)
} as const satisfies Record<
  CardOccasion,
  {
    icon: ComponentType<SVGProps<SVGSVGElement>>
    chip: () => string
    wish: () => string
    card: () => string
  }
>
