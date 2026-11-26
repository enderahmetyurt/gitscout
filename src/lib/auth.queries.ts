import { queryOptions } from "@tanstack/react-query"

import { getViewer } from "@/lib/auth.functions"

export const viewerKeys = {
  all: ["viewer"] as const
}

/** Giriş durumu ilk çizimde gerekmez; sayfa önbelleğe alınsa bile kişiye özel veri HTML'e girmez. */
export const viewerQueryOptions = () =>
  queryOptions({
    queryKey: viewerKeys.all,
    queryFn: ({ signal }) => getViewer({ signal }),
    staleTime: 5 * 60_000
  })
