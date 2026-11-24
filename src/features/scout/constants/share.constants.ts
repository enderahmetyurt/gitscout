/** Paylaşım hedefleri; URL'ler her tıklamada güncel sayfa adresiyle kurulur. */
export const SHARE_TARGETS = [
  {
    id: "x",
    label: "X (Twitter)",
    buildUrl: (pageUrl: string, text: string) =>
      `https://twitter.com/intent/tweet?${new URLSearchParams({ text, url: pageUrl }).toString()}`
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    buildUrl: (pageUrl: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?${new URLSearchParams({ url: pageUrl }).toString()}`
  }
] as const
