import { OG_SIZE, renderOgPng } from "@/lib/og-image"

import { getScoredPlayer } from "@/features/scout/api/player-store"
import { OgImage } from "@/features/scout/components/OgImage"

/** Avatar küçük boyutta çekilip görsele gömülür; alınamazsa yer tutucu çizilir. */
async function loadAvatar(avatarUrl: string): Promise<string | null> {
  try {
    const url = new URL(avatarUrl)
    url.searchParams.set("s", "280")
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (!response.ok) return null
    const type = response.headers.get("content-type") ?? "image/png"
    const data = Buffer.from(await response.arrayBuffer()).toString("base64")
    return `data:${type};base64,${data}`
  } catch (error) {
    console.error("[og] avatar alınamadı", error instanceof Error ? error.message : error)
    return null
  }
}

/**
 * Oyuncunun link önizleme görseli. Adres kartın yenilenme tarihini (`v`) taşıdığı için uzun süre
 * önbellekte tutulabilir; kart yenilenince adres değişir ve platformlar yeni görseli çeker.
 */
export async function playerOgResponse(username: string): Promise<Response> {
  const player = await getScoredPlayer(username)
  if (!player) return new Response("Not found", { status: 404 })

  const png = await renderOgPng(
    <OgImage player={player} avatar={await loadAvatar(player.avatarUrl)} />
  )
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Content-Length": String(png.byteLength),
      "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
      "X-Image-Size": `${OG_SIZE.width}x${OG_SIZE.height}`
    }
  })
}
