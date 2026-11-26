import { OG_FONT_FAMILY } from "@/lib/og-image"

import * as m from "@/paraglide/messages.js"

const BORDER = 2

type OgBadgeUnrankedProps = { width: number; height: number }

/**
 * Kartı olmayan ya da geçersiz kullanıcı adı için gri kart. README'de yıllarca kalan adres kırık
 * görsel göstermesin diye rozet her durumda bir görsel döndürür.
 */
export function OgBadgeUnranked({ width, height }: OgBadgeUnrankedProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        // Satori kenarlığı ölçüye ekler (content-box): düşülmezse sağ ve alt kenar kırpılır.
        width: width - BORDER * 2,
        height: height - BORDER * 2,
        borderRadius: 18,
        border: `${BORDER}px solid #d0d7de`,
        backgroundColor: "#f6f8fa",
        color: "#57606a",
        fontFamily: OG_FONT_FAMILY
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 800 }}>{m.badge_label()}</div>
      <div style={{ fontSize: 13 }}>{m.badge_not_ranked()}</div>
    </div>
  )
}
