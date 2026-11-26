import type { Team } from "@/constants/team.constants"

/**
 * Kartın özel yüzleri: kutlama kartları belirli bir günde ya da kişiye özel bir günde çıkar; takım kartları
 * kulüp renklerinde, istenince seçilir. GitHub Star kartını herkes
 * önizleyebilir; kalıcı seçim yalnızca GitHub Stars programındakilere açık olacak.
 */
export type CardOccasion =
  | "birthday"
  | "womens-day"
  | "programmers-day"
  | "republic-day"
  | "halloween"
  | "new-year"
  | "github-star"
  | Team
