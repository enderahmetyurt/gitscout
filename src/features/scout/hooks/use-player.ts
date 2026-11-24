import { useSuspenseQuery } from "@tanstack/react-query"

import { playerQueryOptions } from "@/features/scout/api/players.queries"

export function usePlayer(username: string) {
  return useSuspenseQuery(playerQueryOptions(username))
}
