import { queryOptions } from "@tanstack/react-query"

import { getRepoStars } from "@/lib/repo-stars.functions"

export const repoStarsQueryOptions = () =>
  queryOptions({
    queryKey: ["repo-stars"] as const,
    queryFn: ({ signal }) => getRepoStars({ signal }),
    staleTime: 10 * 60_000
  })
