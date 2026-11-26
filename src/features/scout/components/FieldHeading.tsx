import type { ReactNode } from "react"

import { Lock } from "lucide-react"

import { FieldInfo } from "@/features/scout/components/FieldInfo"
import * as m from "@/paraglide/messages.js"

type FieldHeadingProps = {
  /** Etiketin kimliği; denetim `aria-labelledby` ile buna bağlanır. */
  id: string
  label: string
  /** Verilirse etiket bu denetime bağlı `<label>` olur. */
  htmlFor?: string
  /** Bilgi simgesinin açtığı açıklama. */
  info?: ReactNode
  /** Profilde gösterilmeyen alan; etiketin yanında kilitli "Gizli" yazar. */
  isPrivate?: boolean
  /** Sağ uçtaki ek bilgi (örneğin seçili kişi sayısı). */
  aside?: ReactNode
}

/** Form alanının başlık satırı: etiket, gizlilik işareti, bilgi simgesi ve sağda ek bilgi. */
export function FieldHeading({ id, label, htmlFor, info, isPrivate, aside }: FieldHeadingProps) {
  const Tag = htmlFor ? "label" : "span"
  return (
    <div className="flex min-h-6 items-center gap-1.5">
      <Tag id={id} htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </Tag>
      {isPrivate ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
          <Lock aria-hidden className="size-3" />
          {m.field_private()}
        </span>
      ) : null}
      {info ? <FieldInfo label={label}>{info}</FieldInfo> : null}
      {aside ? <span className="ms-auto">{aside}</span> : null}
    </div>
  )
}
