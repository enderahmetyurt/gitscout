import { Skeleton } from "@/components/ui/skeleton"
import { LeaderboardTableSkeleton } from "@/features/scout/components/LeaderboardTableSkeleton"
import * as m from "@/paraglide/messages.js"

const RECENT_COUNT = 8

/**
 * Ana sayfa yüklenirken gösterilir. Yerleşim `ScoutHome` ile aynı: başlık, komut kutusu ve örnekler,
 * yanda vitrin kartı; altında son eklenenler şeridi ve ilk 10 tablosu. İçerik gelince sayfa kaymaz.
 */
export function HomeSkeleton() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      aria-busy="true"
      className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-4 pt-6 pb-20 outline-none sm:px-6"
    >
      <p role="status" className="sr-only">
        {m.page_loading()}
      </p>

      <div aria-hidden className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
        <section className="flex max-w-2xl flex-col gap-5 pt-4 sm:pt-8">
          <Skeleton className="h-10 w-3/4 sm:h-12" />
          <div className="flex max-w-xl flex-col gap-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
          </div>
          <Skeleton className="h-14 w-full max-w-xl rounded-lg" />
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-4 w-10" />
            {[0, 1, 2, 3, 4].map((item) => (
              <Skeleton key={item} className="h-7 w-20 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-7 w-72 max-w-full" />
          <Skeleton className="h-5 w-44" />
        </section>
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-120 w-80 max-w-full rounded-[28px]" />
          <div className="flex w-80 max-w-full justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      </div>

      <section aria-hidden className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="-mx-4 flex gap-3 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-8 lg:px-0">
          {Array.from({ length: RECENT_COUNT }, (_item, index) => (
            <div key={index} className="flex w-28 shrink-0 flex-col items-center gap-1.5 lg:w-auto">
              <Skeleton className="h-31 w-full rounded-xl" />
              <Skeleton className="h-3 w-14" />
            </div>
          ))}
        </div>
      </section>

      <section aria-hidden className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-4">
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-8 w-44" />
        </div>
        <LeaderboardTableSkeleton rows={10} />
        <div className="flex flex-wrap justify-center gap-2">
          {[0, 1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-6 w-20 rounded-full" />
          ))}
        </div>
      </section>
    </main>
  )
}
