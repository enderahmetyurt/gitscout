/** Programcılar Günü yılın 256. günü (2⁸): normal yıllarda 13 Eylül, artık yıllarda 12 Eylül. */
const PROGRAMMERS_DAY_OF_YEAR = 256
const DAY_MS = 86_400_000

/** Verilen yılın 256. günü (UTC gece yarısı). */
const programmersDayOf = (year: number) =>
  new Date(Date.UTC(year, 0, 1) + (PROGRAMMERS_DAY_OF_YEAR - 1) * DAY_MS)

const startOfUtcDay = (date: Date) =>
  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())

/** `now` anı (UTC) Programcılar Günü mü? Herkes için aynı gün; kişinin bir şey girmesi gerekmez. */
export function isProgrammersDay(now: Date): boolean {
  return startOfUtcDay(now) === programmersDayOf(now.getUTCFullYear()).getTime()
}

/** Bugün ya da sonraki ilk Programcılar Günü; tarihi sabit yazmak yerine kullanıcıya gösterilir. */
export function nextProgrammersDay(now: Date): Date {
  const thisYear = programmersDayOf(now.getUTCFullYear())
  return startOfUtcDay(now) <= thisYear.getTime()
    ? thisYear
    : programmersDayOf(now.getUTCFullYear() + 1)
}
