const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/**
 * "5 dk önce" gibi kısa göreli zaman. `now` dışarıdan gelir: sunucu ile tarayıcı aynı anı
 * kullanırsa aynı metni üretir. Bir dakikadan yeni olanlar için `null` döner; çağıran
 * "az önce" gibi kendi metnini yazar.
 */
export function formatRelative(from: string, now: string, locale: string): string | null {
  const elapsed = Math.max(0, new Date(now).getTime() - new Date(from).getTime())
  if (elapsed < MINUTE) return null
  const format = new Intl.RelativeTimeFormat(locale, { numeric: "always", style: "short" })
  if (elapsed < HOUR) return format.format(-Math.floor(elapsed / MINUTE), "minute")
  if (elapsed < DAY) return format.format(-Math.floor(elapsed / HOUR), "hour")
  return format.format(-Math.floor(elapsed / DAY), "day")
}
