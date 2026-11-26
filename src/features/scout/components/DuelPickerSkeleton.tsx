import { Skeleton } from "@/components/ui/skeleton"
import * as m from "@/paraglide/messages.js"

/** Kapışma seçimindeki bir köşe: etiket, oyuncu seçici ve boş kart. */
function SlotSkeleton() {
  return (
    <div className="flex min-w-0 flex-col items-center gap-3">
      <div className="flex w-full max-w-80 flex-col gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-full" />
      </div>
      <Skeleton className="h-120 w-80 rounded-[28px] max-lg:hidden" />
      <Skeleton className="h-40 w-full rounded-2xl lg:hidden" />
    </div>
  )
}

/**
 * Kapışma seçimi yüklenirken gösterilir. Yerleşim `DuelPicker` ile aynı: başlık, iki köşe ve ortada kılıçlar,
 * altında not ve popüler kapışma kartları.
 */
export function DuelPickerSkeleton() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      aria-busy="true"
      className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 overflow-x-clip px-4 pt-6 pb-20 outline-none sm:px-6"
    >
      <p role="status" className="sr-only">
        {m.page_loading()}
      </p>

      <div aria-hidden className="flex flex-col items-center gap-3">
        <div className="flex flex-col items-center gap-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-80 max-w-full sm:h-10" />
        </div>
        <Skeleton className="h-5 w-[32rem] max-w-full" />
      </div>

      <div
        aria-hidden
        className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-3 lg:grid-cols-[20rem_8rem_20rem] lg:justify-center lg:gap-4"
      >
        <SlotSkeleton />
        <div className="flex flex-col items-center gap-6 self-center lg:mt-12">
          <div className="flex size-12 items-center justify-center lg:size-20">
            <Skeleton className="size-9 rounded-md lg:size-14" />
          </div>
          <Skeleton className="h-52 w-full max-lg:hidden" />
          <Skeleton className="h-8 w-32 max-lg:hidden" />
        </div>
        <SlotSkeleton />
      </div>

      <div aria-hidden className="flex flex-col items-center gap-3">
        <Skeleton className="h-8 w-36 lg:hidden" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>

      <div aria-hidden className="mx-auto flex w-full max-w-[49rem] flex-col gap-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} className="h-37 rounded-xl" />
          ))}
        </div>
      </div>
    </main>
  )
}
