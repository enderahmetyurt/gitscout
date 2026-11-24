import { createFileRoute } from "@tanstack/react-router"

import { hreflangLinks } from "@/helpers/localized-url"

import { AboutPage } from "@/features/scout/components/AboutPage"
import * as m from "@/paraglide/messages.js"

export const Route = createFileRoute("/{-$lang}/about")({
  head: () => ({ meta: [{ title: m.meta_about() }], links: hreflangLinks("/about") }),
  component: AboutPage
})
