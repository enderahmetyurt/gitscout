import type { ReactNode } from "react"

import { cn } from "cn"

type PageHeaderProps = {
  title: ReactNode
  /** Başlığın üstündeki küçük, büyük harfli etiket. */
  eyebrow?: ReactNode
  /** Başlığın altındaki açıklama ve ek bilgi. */
  children?: ReactNode
  /** Simetrik sahneli sayfalar (kapışma) ortalı, diğerleri logoyla aynı hizada solda. */
  align?: "start" | "center"
  className?: string
}

/**
 * İç sayfaların ortak başlığı: tek H1 ölçüsü, isteğe bağlı üst etiket ve açıklama. Ana sayfanın vitrin
 * başlığı bilerek bunun dışında ve daha büyük.
 */
export function PageHeader({
  title,
  eyebrow,
  children,
  align = "start",
  className
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <div className={cn("flex flex-col gap-1.5", align === "center" && "items-center")}>
        {eyebrow ? (
          <p className="font-mono text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h1>
      </div>
      {children}
    </div>
  )
}
