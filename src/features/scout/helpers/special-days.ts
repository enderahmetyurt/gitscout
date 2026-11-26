/** Türkiye saati (UTC+3, 2016'dan beri yaz saati yok). Cumhuriyet Bayramı Türkiye'nin gününe göre kutlanır. */
const TURKEY_OFFSET_MS = 3 * 60 * 60 * 1000

const isMonthDay = (date: Date, month: number, day: number) =>
  date.getUTCMonth() + 1 === month && date.getUTCDate() === day

/** `now` anı Türkiye saatiyle 29 Ekim mi? */
export function isRepublicDay(now: Date): boolean {
  return isMonthDay(new Date(now.getTime() + TURKEY_OFFSET_MS), 10, 29)
}

/** `now` anı (UTC) 31 Ekim mi? Herkes için aynı gün. */
export function isHalloween(now: Date): boolean {
  return isMonthDay(now, 10, 31)
}

/** `now` anı (UTC) yılbaşı mı? Kutlama 31 Aralık ve 1 Ocak'ı kapsar; herkes için aynı. */
export function isNewYear(now: Date): boolean {
  return isMonthDay(now, 12, 31) || isMonthDay(now, 1, 1)
}
