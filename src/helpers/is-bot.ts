/** Arama motorları, bağlantı önizleyicileri, başsız tarayıcılar ve betik istemcileri. */
const BOT_PATTERN =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|headless|lighthouse|phantom|puppeteer|playwright|curl|wget|python|httpclient|okhttp|axios|node-fetch|undici|go-http|java\/|libwww|scrapy/i

/**
 * İstek bir insan tarayıcısından gelmiyor gibi mi görünüyor? Tarayıcı bilgisi olmayan istekler de
 * bot sayılır; gerçek tarayıcılar bu başlığı her zaman gönderir.
 */
export function isBot(userAgent: string | undefined): boolean {
  if (!userAgent) return true
  return BOT_PATTERN.test(userAgent)
}
