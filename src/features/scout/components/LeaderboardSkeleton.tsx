import { Skeleton } from "@/components/ui/skeleton"
import { LeaderboardTableSkeleton } from "@/features/scout/components/LeaderboardTableSkeleton"
import * as m from "@/paraglide/messages.js"

/**
 * Sıralama sayfası yüklenirken gösterilir. Yerleşim `LeaderboardPage` ile aynı: başlık ve özet, arama ile
 * filtreler, nadirlik çipleri ve oyuncu sayısı, altında tablo.
 */
export function LeaderboardSkeleton() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      aria-busy="true"
      className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 pt-6 pb-20 outline-none sm:px-6"
    >
      <p role="status" className="sr-only">
        {m.page_loading()}
      </p>

      <div aria-hidden className="flex flex-col gap-3">
        <Skeleton className="h-9 w-48 sm:h-10" />
        <div className="flex max-w-prose flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>

      <div aria-hidden className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Skeleton className="h-8 w-full sm:w-64" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div className="flex flex-wrap gap-2">
            {[0, 1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-7 w-20 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-4 w-28" />
        </div>
      </div>

      <div aria-hidden>
        <LeaderboardTableSkeleton rows={12} />
      </div>
    </main>
  )
}
