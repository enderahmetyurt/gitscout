import { track } from "@vercel/analytics"

import type { AnalyticsEvent } from "@/schemas/analytics.schema"

import { recordEvent } from "@/lib/site-analytics.functions"

/**
 * Özel olayı hem Vercel Web Analytics'e hem Supabase'e gönderir. Çerez kullanılmaz ve kişisel veri
 * gönderilmez; yalnızca zaten herkese açık olan GitHub kullanıcı adları ve hata kodları gider.
 * Kayıt arka planda gider; başarısız olursa kullanıcının işi etkilenmez, hata konsola yazılır.
 */
export function trackEvent(event: AnalyticsEvent) {
  const { name, ...properties } = event
  track(name, properties)
  recordEvent({ data: event }).catch((error: unknown) => {
    console.error("Could not record analytics event", error)
  })
}
