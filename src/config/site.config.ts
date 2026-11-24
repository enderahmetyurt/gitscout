import type { SiteConfig } from "@/types/site-config.types"
import { env } from "@/env"

export const siteConfig: SiteConfig = {
  name: env.VITE_APP_NAME,
  description:
    "GitHub profilini aktivite, etki, topluluk, saygınlık, istikrar ve kıdeme göre puanlayıp koleksiyon kartına çeviren liderlik tablosu.",
  shortName: "Gitscout",
  url: env.VITE_APP_URL,
  apiUrl: env.VITE_API_URL,
  ogImage: `${env.VITE_APP_URL}/og.png`,
  links: {
    github: "https://github.com/omergulcicek/gitscout",
    twitter: "https://x.com/virastack"
  }
}
