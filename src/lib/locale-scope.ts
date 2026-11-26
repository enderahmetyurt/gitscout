import { getServerAsyncLocalStorage } from "@/paraglide/runtime.js"
import type { Locale } from "@/paraglide/runtime.js"

/**
 * `fn` içindeki bütün mesaj çağrıları verilen dilde yazılır. İsteğin dili adresten gelir; README
 * rozetleri ise dili `?lang=` parametresinden alır ve bileşenlerin her mesaja dil geçmesi gerekmez.
 * Yalnızca sunucuda etkilidir: async local storage yoksa (testler) `fn` olduğu gibi çalışır.
 */
export function runWithLocale<T>(locale: Locale, fn: () => T): T {
  const storage = getServerAsyncLocalStorage()
  if (!storage) return fn()
  return storage.run({ ...storage.getStore(), locale }, fn)
}
