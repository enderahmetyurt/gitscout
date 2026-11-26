/** Grafikte gösterilen hafta sayısı; "Son 1 yıl" başlığıyla uyuşsun diye 52. */
export const CHART_WEEKS = 52

type Day = { date: string; count: number }

/**
 * Takvimin son `weeks` haftasının toplam katkıları, eskiden yeniye. Haftalar GitHub'daki gibi
 * Pazar başlar; son hafta yalnızca bugüne kadarki günleri içerir.
 */
export function weeklyTotals(calendar: Day[], weeks = CHART_WEEKS): number[] {
  const last = calendar.at(-1)
  if (!last) return []
  const lastWeekLength = new Date(`${last.date}T00:00:00Z`).getUTCDay() + 1
  const days = calendar.slice(-((weeks - 1) * 7 + lastWeekLength))
  const totals: number[] = []
  for (let start = 0; start < days.length; start += 7) {
    totals.push(days.slice(start, start + 7).reduce((sum, day) => sum + day.count, 0))
  }
  return totals
}
