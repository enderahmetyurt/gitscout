import { getLocale } from "@/paraglide/runtime.js"

/** Aksanları ve noktasız ı'yı düzler: "omer" yazınca "Ömer", "gurlu" yazınca "GÜRLÜ" bulunsun. */
function normalizeSearch(text: string): string {
  return text
    .toLocaleLowerCase(getLocale())
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/ı/g, "i")
    .trim()
}

/** Oyuncu adında ya da kullanıcı adında geçiyor mu; baştaki @ yok sayılır. */
export function matchesPlayer(player: { name: string; login: string }, query: string): boolean {
  const q = normalizeSearch(query.replace(/^@/, ""))
  return (
    q === "" ||
    normalizeSearch(player.name).includes(q) ||
    normalizeSearch(player.login).includes(q)
  )
}

/** Metinde aranan ifade geçiyor mu; aksanlar ve büyük-küçük harf yok sayılır. */
export function matchesText(text: string, query: string): boolean {
  const q = normalizeSearch(query)
  return q === "" || normalizeSearch(text).includes(q)
}
