/** Doğum günü kartındaki genel puan. Yalnızca kartta görünür; sıralamaya ve kapışmaya girmez. */
export const BIRTHDAY_OVR = 100

const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0

/**
 * Kişinin yerel saatine göre bugün doğum günü mü? `birthMonthDay` "AA-GG" biçiminde.
 * Yerel saat bilinmiyorsa UTC kullanılır. 29 Şubat doğumlular artık olmayan yıllarda 28 Şubat'ta kutlanır.
 */
export function isBirthdayToday(
  birthMonthDay: string,
  now: Date,
  utcOffsetMinutes: number | null
): boolean {
  const local = new Date(now.getTime() + (utcOffsetMinutes ?? 0) * 60_000)
  const year = local.getUTCFullYear()
  const today = `${String(local.getUTCMonth() + 1).padStart(2, "0")}-${String(local.getUTCDate()).padStart(2, "0")}`
  const celebrated = birthMonthDay === "02-29" && !isLeapYear(year) ? "02-28" : birthMonthDay
  return today === celebrated
}

/** Doğum tarihi (YYYY-AA-GG) `now` anında kaç yaşı gösterir; tarih geçersizse `null`. */
export function ageOn(birthDate: string, now: Date): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate)
  if (!match) return null
  const [, y, mo, d] = match.map(Number)
  if (!y || !mo || !d) return null
  const birth = new Date(Date.UTC(y, mo - 1, d))
  if (birth.getUTCMonth() !== mo - 1 || birth.getUTCDate() !== d) return null
  const hadBirthday =
    now.getUTCMonth() + 1 > mo || (now.getUTCMonth() + 1 === mo && now.getUTCDate() >= d)
  return now.getUTCFullYear() - y - (hadBirthday ? 0 : 1)
}
