import { useEffect } from "react"

import { useLocation } from "@tanstack/react-router"

import { pagePathSchema } from "@/schemas/analytics.schema"

import { recordPageView } from "@/lib/site-analytics.functions"

/**
 * Her sayfa açılışında ve istemci tarafı gezinmede yolu Supabase'e yazar. Yalnızca yol gider,
 * sorgu dizesi (arama metni) gönderilmez; sitenin tanımadığı yollar kaydedilmez.
 */
export function usePageViewLogging() {
  const pathname = useLocation({ select: (location) => location.pathname })

  useEffect(() => {
    const path = pagePathSchema.safeParse(pathname)
    if (!path.success) return
    recordPageView({ data: { path: path.data } }).catch((error: unknown) => {
      console.error("Could not record page view", error)
    })
  }, [pathname])
}
