import { TriangleAlert } from "lucide-react"

import * as m from "@/paraglide/messages.js"

type StaleNoticeProps = {
  count: number
}

/** Formül ya da veri biçimi değiştiği için tabloda görünmeyen oyuncular. */
export function StaleNotice({ count }: StaleNoticeProps) {
  if (count === 0) return null
  return (
    <p role="status" className="surface flex items-start gap-2 px-4 py-3 text-sm">
      <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-warning" />
      {m.stale_notice({ count })}
    </p>
  )
}
