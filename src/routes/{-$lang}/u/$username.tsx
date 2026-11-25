import { createFileRoute } from "@tanstack/react-router"

import { siteConfig } from "@/config/site.config"

import { hreflangLinks } from "@/helpers/localized-url"

import { playerQueryOptions } from "@/features/scout/api/players.queries"
import { AddPlayerForm } from "@/features/scout/components/AddPlayerForm"
import { PlayerDetail } from "@/features/scout/components/PlayerDetail"
import { PlayerDetailSkeleton } from "@/features/scout/components/PlayerDetailSkeleton"
import * as m from "@/paraglide/messages.js"

export const Route = createFileRoute("/{-$lang}/u/$username")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(playerQueryOptions(params.username)),
  head: ({ params, loaderData }) => {
    const title = loaderData ? `${loaderData.name} · Gitscout` : `${params.username} · Gitscout`
    if (!loaderData) return { meta: [{ title }], links: hreflangLinks(`/u/${params.username}`) }

    // Görsel adresi kartın yenilenme tarihini taşır: kart yenilenince platformlar yeni görseli çeker.
    const prefix = params.lang ? `/${params.lang}` : ""
    const version = Date.parse(loaderData.fetchedAt)
    const image = `${siteConfig.url}${prefix}/og/${loaderData.login}?v=${version}`
    const description = m.og_description({ name: loaderData.name, ovr: loaderData.ovr })
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "profile" },
        { property: "og:url", content: `${siteConfig.url}${prefix}/u/${loaderData.login}` },
        { property: "og:image", content: image },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image }
      ],
      links: hreflangLinks(`/u/${params.username}`)
    }
  },
  pendingComponent: PlayerDetailSkeleton,
  notFoundComponent: PlayerNotFound,
  component: PlayerPage
})

function PlayerPage() {
  const { username } = Route.useParams()
  return <PlayerDetail username={username} />
}

function PlayerNotFound() {
  const { username } = Route.useParams()
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center gap-4 px-6 py-24 text-center outline-none"
    >
      <meta name="robots" content="noindex" />
      <h1 className="text-3xl font-bold">{m.player_not_found_title({ username })}</h1>
      <p className="text-muted-foreground">{m.player_not_found_description()}</p>
      <div className="w-full text-left">
        <AddPlayerForm defaultUsername={username} />
      </div>
    </main>
  )
}
