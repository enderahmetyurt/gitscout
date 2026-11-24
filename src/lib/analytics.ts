import { track } from "@vercel/analytics"

/**
 * Vercel Web Analytics özel olayları. Çerez kullanılmaz ve kişisel veri gönderilmez;
 * yalnızca zaten herkese açık olan GitHub kullanıcı adları ve hata kodları gider.
 */
type AnalyticsEvent =
  | { name: "card_requested"; login: string }
  | { name: "card_request_failed"; reason: string }
  | { name: "card_downloaded"; login: string }
  | { name: "card_shared"; login: string; target: string }
  | { name: "duel_shared"; left: string; right: string; via: "image" | "link" | "x" }

export function trackEvent({ name, ...properties }: AnalyticsEvent) {
  track(name, properties)
}
