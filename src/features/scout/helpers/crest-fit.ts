/** Armanın kare kutuda kaplayacağı alan; yuvarlak armalar kutunun yaklaşık %78'i kadar olur. */
const TARGET_AREA = 0.78 * 0.78

/**
 * En/boy oranı verilen armanın kare kutudaki genişlik ve yüksekliği (kutuya oranla, 0–1). Her arma aynı
 * alanı kaplar, böylece uzun ve geniş armalar göz için eşit büyüklükte durur; hiçbiri kutudan taşmaz.
 */
export function crestFit(aspect: number): { width: number; height: number } {
  const width = Math.sqrt(TARGET_AREA * aspect)
  const height = Math.sqrt(TARGET_AREA / aspect)
  if (height > 1) return { width: aspect, height: 1 }
  if (width > 1) return { width: 1, height: 1 / aspect }
  return { width, height }
}
