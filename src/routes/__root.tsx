import type { QueryClient } from "@tanstack/react-query"
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router"
import monoLatin from "@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2?url"
import monoCss from "@fontsource-variable/jetbrains-mono/index.css?url"
import displayCss from "@fontsource-variable/space-grotesk/index.css?url"
import { Analytics } from "@vercel/analytics/react"

import { seoHeadMeta } from "@/config/seo.config"

import appCss from "@/styles/tailwind.css?url"

import { Providers } from "@/providers/Providers"

import { DefaultCatchBoundary } from "@/components/shared/DefaultCatchBoundary"
import { NotFound } from "@/components/shared/NotFound"
import { SiteFooter } from "@/components/shared/SiteFooter"
import { SiteHeader } from "@/components/shared/SiteHeader"
import { SkipLink } from "@/components/shared/SkipLink"
import { getLocale } from "@/paraglide/runtime.js"

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      // Mobil tarayıcı çubuğu sitenin koyu zeminiyle aynı renkte.
      { name: "theme-color", content: "#0a0a0a" },
      ...seoHeadMeta()
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      // Gövde yazı tipinin Latin dosyası önceden yüklenir ki ilk çizimde yazı kaymasın.
      {
        rel: "preload",
        href: monoLatin,
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous"
      },
      { rel: "stylesheet", href: monoCss },
      { rel: "stylesheet", href: displayCss },
      { rel: "icon", href: "/logo.webp" },
      { rel: "apple-touch-icon", href: "/logo.webp" },
      { rel: "manifest", href: "/site.webmanifest" }
    ]
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
  component: RootComponent
})

function RootComponent() {
  return (
    <Providers>
      <SkipLink />
      <SiteHeader />
      <Outlet />
      <SiteFooter />
    </Providers>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    // Site yalnızca koyu temada: kart tasarımı ve stat renkleri koyu zemine göre ayarlı.
    <html lang={getLocale()} className="dark h-full" style={{ colorScheme: "dark" }}>
      <head>
        <HeadContent />
      </head>
      <body
        className="flex min-h-full flex-col font-sans tabular-nums antialiased"
        suppressHydrationWarning
      >
        {children}
        {/* Sayfa görüntülemeleri: çerezsiz, yalnızca Vercel'de yayındayken veri gönderir. */}
        <Analytics />
        <Scripts />
      </body>
    </html>
  )
}
