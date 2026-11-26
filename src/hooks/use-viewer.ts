import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { logout, startGithubLogin } from "@/lib/auth.functions"
import { viewerKeys, viewerQueryOptions } from "@/lib/auth.queries"

/** Giriş yapmış kişi; yalnızca arayüz içindir. Her yetki kontrolü sunucuda yeniden yapılır. */
export function useViewer() {
  return useQuery(viewerQueryOptions())
}

/** GitHub girişini başlatır; sunucunun verdiği yetkilendirme adresine gider. */
export function useStartGithubLogin() {
  return useMutation({
    mutationFn: () => startGithubLogin(),
    onSuccess: ({ url }) => {
      window.location.assign(url)
    }
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => logout(),
    onSettled: () => queryClient.invalidateQueries({ queryKey: viewerKeys.all })
  })
}
