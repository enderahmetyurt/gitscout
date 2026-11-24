import { TriangleAlert } from "lucide-react"

type StaleNoticeProps = {
  count: number
}

/** Formül ya da veri biçimi değiştiği için tabloda görünmeyen oyuncular. */
export function StaleNotice({ count }: StaleNoticeProps) {
  if (count === 0) return null
  return (
    <p role="status" className="surface flex items-start gap-2 px-4 py-3 text-sm">
      <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-warning" />
      {count} oyuncunun verisi eski biçimde kaydedilmiş ve tabloda görünmüyor. Kullanıcı adını forma
      yazınca GitHub'dan yeniden çekilir.
    </p>
  )
}
