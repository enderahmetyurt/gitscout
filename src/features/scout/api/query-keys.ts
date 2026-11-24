export const playerKeys = {
  all: ["players"] as const,
  lists: () => [...playerKeys.all, "list"] as const,
  details: () => [...playerKeys.all, "detail"] as const,
  detail: (login: string) => [...playerKeys.details(), login.toLowerCase()] as const
}
