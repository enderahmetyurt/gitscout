import type { ReactNode } from "react"

import latin400 from "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff?inline"
import latin700 from "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff?inline"
import latin800 from "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-800-normal.woff?inline"
import latinExt400 from "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-ext-400-normal.woff?inline"
import latinExt700 from "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-ext-700-normal.woff?inline"
import latinExt800 from "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-ext-800-normal.woff?inline"
import { Resvg } from "@resvg/resvg-js"
import satori from "satori"

/** Sosyal medya önizlemelerinin standart boyutu. */
export const OG_SIZE = { width: 1200, height: 630 }

/** Derlemeye gömülen font dosyaları (data URL); satori woff2 okuyamadığı için woff kullanılır. */
const decode = (dataUrl: string) => Buffer.from(dataUrl.slice(dataUrl.indexOf(",") + 1), "base64")

/**
 * Latin ve Latin Extended alt kümeleri ayrı aile adıyla verilir; satori aynı adlı fontlarda yalnızca
 * ilkini kullandığı için "ş", "İ" gibi harfler ancak böyle ikinci aileden bulunur.
 */
export const OG_FONT_FAMILY = "JetBrains Mono, JetBrains Mono Ext"

const FONTS = [
  { name: "JetBrains Mono", data: latin400, weight: 400 },
  { name: "JetBrains Mono", data: latin700, weight: 700 },
  { name: "JetBrains Mono", data: latin800, weight: 800 },
  { name: "JetBrains Mono Ext", data: latinExt400, weight: 400 },
  { name: "JetBrains Mono Ext", data: latinExt700, weight: 700 },
  { name: "JetBrains Mono Ext", data: latinExt800, weight: 800 }
] as const

let fonts: { name: string; data: Buffer; weight: 400 | 700 | 800; style: "normal" }[] | null = null

type RenderOptions = { width: number; height: number; scale?: number }

/**
 * JSX'i önce SVG'ye, sonra PNG'ye çevirir. Yalnızca sunucuda çalışır. `scale` çıktıyı büyütür:
 * README kartları retina ekranda keskin görünsün diye iki kat çizilip HTML `width` ile küçültülür.
 */
export async function renderOgPng(
  node: ReactNode,
  { width, height, scale = 1 }: RenderOptions = OG_SIZE
): Promise<Uint8Array> {
  fonts ??= FONTS.map((font) => ({
    name: font.name,
    data: decode(font.data),
    weight: font.weight,
    style: "normal"
  }))
  const svg = await satori(node, { width, height, fonts })
  return new Resvg(svg, { fitTo: { mode: "width", value: width * scale } }).render().asPng()
}
