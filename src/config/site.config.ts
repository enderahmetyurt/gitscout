import type { SiteConfig } from "@/types/site-config.types"
import { env } from "@/env"

export const siteConfig: SiteConfig = {
  name: env.VITE_APP_NAME,
  description: "Turn any GitHub profile into a collectible card and see where it ranks.",
  shortName: "Gitscout",
  url: env.VITE_APP_URL,
  ogImage: `${env.VITE_APP_URL}/og.png`,
  links: {
    github: "https://github.com/omergulcicek/gitscout",
    buyMeACoffee: "https://buymeacoffee.com/omergulcicek"
  }
}
