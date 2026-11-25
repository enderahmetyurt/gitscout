import type { Rarity } from "@/features/scout/types/player.types"

/** Sağ bölmenin rengi: kartın nadirliği ya da sırada olmayan kullanıcı için nötr gri. */
export type BadgeTone = Rarity | "none"

type BadgeInput = { label: string; value: string; tone: BadgeTone }

const TONES: Record<BadgeTone, { fill: string; ink: string }> = {
  icon: { fill: "#26242b", ink: "#f6dc8c" },
  gold: { fill: "#e6b843", ink: "#2e2100" },
  silver: { fill: "#c2c9d2", ink: "#161b22" },
  bronze: { fill: "#e3b68c", ink: "#2b1406" },
  none: { fill: "#6e7681", ink: "#ffffff" }
}

const HEIGHT = 20
const FONT_SIZE = 11
const PADDING_X = 7
/**
 * Görsel `<img>` içinde açıldığı için web fontu yüklenemez; eş aralıklı yazı tipinde her harf yaklaşık
 * 0,6 em tuttuğundan genişlik ölçmeden hesaplanır.
 */
const CHAR_WIDTH = FONT_SIZE * 0.6

const escapeXml = (text: string) => text.replace(/[<>&"']/g, (char) => `&#${char.charCodeAt(0)};`)

const partWidth = (text: string) => Math.ceil(text.length * CHAR_WIDTH + PADDING_X * 2)

/** shields.io tarzı iki bölmeli README rozeti; solda marka, sağda sıra ve puan. */
export function renderBadgeSvg({ label, value, tone }: BadgeInput): string {
  const { fill, ink } = TONES[tone]
  const left = partWidth(label)
  const right = partWidth(value)
  const width = left + right
  const textY = HEIGHT / 2 + FONT_SIZE * 0.35
  const title = escapeXml(`${label}: ${value}`)

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${HEIGHT}" viewBox="0 0 ${width} ${HEIGHT}" role="img" aria-label="${title}"><title>${title}</title><clipPath id="r"><rect width="${width}" height="${HEIGHT}" rx="3"/></clipPath><g clip-path="url(#r)"><rect width="${left}" height="${HEIGHT}" fill="#161b22"/><rect x="${left}" width="${right}" height="${HEIGHT}" fill="${fill}"/></g><g font-family="'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace" font-size="${FONT_SIZE}" font-weight="700" text-anchor="middle"><text x="${left / 2}" y="${textY}" fill="#ffffff">${escapeXml(label)}</text><text x="${left + right / 2}" y="${textY}" fill="${ink}">${escapeXml(value)}</text></g></svg>`
}
