import {
  AMBIGUOUS_ISO_CODES,
  LOCATION_ALIASES
} from "@/features/scout/constants/location-country.constants"
import { COUNTRIES } from "@/features/scout/constants/player-country.constants"
import type { CountryCode } from "@/features/scout/constants/player-country.constants"

const MAX_ALIAS_WORDS = 3

/**
 * Büyük-küçük harf, aksan ve Türkçe karakterden bağımsız karşılaştırma için sadeleştirir:
 * "İstanbul" ve "ISTANBUL" aynı "istanbul" olur. Harf ve rakam dışındakiler boşluğa döner.
 */
function fold(text: string): string {
  return text
    .replace(/[İIı]/g, "i")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/ß/g, "ss")
    .replace(/ø/g, "o")
    .replace(/ł/g, "l")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

const aliasIndex: ReadonlyMap<string, CountryCode> = new Map(
  COUNTRIES.flatMap((country) =>
    LOCATION_ALIASES[country].map((alias) => [fold(alias), country] as const)
  )
)

function isCountryCode(value: string): value is CountryCode {
  return COUNTRIES.some((country) => country === value)
}

/** 🇹🇷 gibi bayrak emojisi iki bölgesel gösterge harfidir; kodu çıkarır. */
function flagEmojiCountry(text: string): CountryCode | undefined {
  const letters = [...text]
    .map((char) => char.codePointAt(0) ?? 0)
    .filter((code) => code >= 0x1f1e6 && code <= 0x1f1ff)
    .map((code) => String.fromCharCode(code - 0x1f1e6 + 65))
  for (let index = letters.length - 2; index >= 0; index -= 2) {
    const code = `${letters[index]}${letters[index + 1]}`
    if (isCountryCode(code)) return code
  }
  return undefined
}

/** Bir parçadaki en sondaki, en uzun takma adı bulur: "Remote, Istanbul Turkey" → Turkey. */
function segmentCountry(segment: string): CountryCode | undefined {
  const raw = segment.trim()
  if (/^[A-Z]{2}$/.test(raw) && isCountryCode(raw) && !AMBIGUOUS_ISO_CODES.has(raw)) return raw

  const words = fold(raw).split(" ").filter(Boolean)
  for (let end = words.length; end > 0; end--) {
    for (let size = Math.min(MAX_ALIAS_WORDS, end); size > 0; size--) {
      const country = aliasIndex.get(words.slice(end - size, end).join(" "))
      if (country) return country
    }
  }
  return undefined
}

/**
 * GitHub profilindeki serbest metin konumdan ülkeyi çıkarır; bulamazsa `undefined`.
 * Son parça en güvenilir olandır ("Paris, Texas" ABD'dir), bu yüzden sondan başa doğru bakılır.
 * Yalnızca bayrağı olan ülkeler döner.
 */
export function countryFromLocation(location: string | null | undefined): CountryCode | undefined {
  if (!location) return undefined
  const flag = flagEmojiCountry(location)
  if (flag) return flag
  const segments = location.split(/[,;/|·•]|\s[-–—]\s/)
  for (let index = segments.length - 1; index >= 0; index--) {
    const country = segmentCountry(segments[index] ?? "")
    if (country) return country
  }
  return undefined
}
