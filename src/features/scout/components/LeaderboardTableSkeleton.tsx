import { Skeleton } from "@/components/ui/skeleton"

const STAT_COLUMNS = 6

/**
 * Sıralama tablosunun iskeleti: başlık satırı ve oyuncu satırları gerçek tabloyla aynı yükseklikte
 * (başlık 41, satır 65 piksel). Sıra, avatar ve ad, rol, puan ve altı istatistik sütunu yerinde durur.
 */
export function LeaderboardTableSkeleton({ rows }: { rows: number }) {
  return (
    <div className="surface overflow-hidden">
      <div className="flex h-10 items-center gap-4 border-b px-4">
        <Skeleton className="h-3 w-4" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="ms-auto hidden h-3 w-12 md:block" />
        <Skeleton className="h-3 w-10" />
        {Array.from({ length: STAT_COLUMNS }, (_item, index) => (
          <Skeleton key={index} className="hidden h-3 w-7 md:block" />
        ))}
      </div>
      {Array.from({ length: rows }, (_row, row) => (
        <div key={row} className="flex h-16 items-center gap-4 border-b px-4 last:border-0">
          <Skeleton className="size-7 shrink-0 rounded-full" />
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Skeleton className="size-9 shrink-0 rounded-full" />
            <div className="flex min-w-0 flex-col gap-1.5">
              <Skeleton className="h-4 w-32 max-w-full" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="hidden h-5 w-20 rounded-full md:block" />
          <Skeleton className="h-8 w-9" />
          {Array.from({ length: STAT_COLUMNS }, (_item, index) => (
            <Skeleton key={index} className="hidden h-4 w-7 md:block" />
          ))}
        </div>
      ))}
    </div>
  )
}
