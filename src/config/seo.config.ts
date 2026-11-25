import { siteConfig } from "@/config/site.config"

import * as m from "@/paraglide/messages.js"
import { getLocale } from "@/paraglide/runtime.js"
import type { Locale } from "@/paraglide/runtime.js"

const OG_LOCALES: Record<Locale, string> = { en: "en_US", tr: "tr_TR" }

/** Site geneli önizleme görselinin metni dile göre değişir; İngilizce olan varsayılan `og.png`. */
const OG_IMAGES: Record<Locale, string> = {
  en: siteConfig.ogImage,
  tr: siteConfig.ogImage.replace(/og\.png$/, "og-tr.png")
}

/** Shared SEO fields used by the root route `head()` and social meta tags. */
const defaultSeo = {
  title: siteConfig.name,
  titleTemplate: `%s · ${siteConfig.name}`,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    title: siteConfig.name,
    siteName: siteConfig.name,
    images: [{ width: 1200, height: 630, alt: siteConfig.name }]
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name
  }
} as const

/** A page's own title and description, also used for its social previews. */
export function pageMeta(title: string, description?: string) {
  return [
    { title },
    { property: "og:title", content: title },
    { name: "twitter:title", content: title },
    ...(description
      ? [
          { name: "description", content: description },
          { property: "og:description", content: description },
          { name: "twitter:description", content: description }
        ]
      : [])
  ]
}

/** Flatten `defaultSeo` into TanStack Router `head().meta` entries. */
export function seoHeadMeta() {
  const og = defaultSeo.openGraph
  const twitter = defaultSeo.twitter
  const description = m.site_description()
  const image = OG_IMAGES[getLocale()]

  return [
    { title: defaultSeo.title },
    { name: "description", content: description },
    { name: "author", content: defaultSeo.creator },
    { name: "creator", content: defaultSeo.creator },
    { property: "og:type", content: og.type },
    { property: "og:locale", content: OG_LOCALES[getLocale()] },
    { property: "og:title", content: og.title },
    { property: "og:description", content: description },
    { property: "og:site_name", content: og.siteName },
    { property: "og:image", content: image },
    { name: "twitter:card", content: twitter.card },
    { name: "twitter:title", content: twitter.title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image }
  ]
}
