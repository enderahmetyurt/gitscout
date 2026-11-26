import { Skeleton } from "@/components/ui/skeleton"
import * as m from "@/paraglide/messages.js"

/** Kapışmadaki bir taraf: seçici, kart ve kullanıcı adı. Dar ekranda ortadaki sütun öne geçer. */
function SideSkeleton() {
  return (
    <div className="flex-col items-center gap-3 max-lg:hidden lg:flex">
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-120 w-80 rounded-[28px]" />
      <Skeleton className="h-4 w-16" />
    </div>
  )
}

/**
 * Kapışma sonucu yüklenirken gösterilir. Yerleşim `DuelView` ile aynı: başlık; iki yanda kartlar, ortada
 * skor, radar, istatistik karşılaştırması ve ayrıntılar; altında paylaşım bölümü.
 */
export function DuelSkeleton() {
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

      <div aria-hidden className="flex flex-col items-center gap-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-9 w-96 max-w-full" />
      </div>

      <div aria-hidden className="grid grid-cols-2 gap-3 lg:hidden">
        {[0, 1].map((item) => (
          <div key={item} className="flex flex-col gap-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="aspect-2/3 w-full rounded-2xl" />
          </div>
        ))}
      </div>

      <div aria-hidden className="grid items-start gap-8 lg:grid-cols-[20rem_1fr_20rem]">
        <SideSkeleton />
        <div className="flex flex-col gap-6">
          <div className="surface flex flex-col items-center gap-3 px-4 py-5">
            <Skeleton className="h-14 w-32" />
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="surface flex items-center justify-center p-6">
            <Skeleton className="aspect-square w-full max-w-64 rounded-full" />
          </div>
          <div className="surface flex flex-col gap-3 px-4 py-4">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <Skeleton className="h-5 w-6" />
                <Skeleton className="h-1.5 flex-1 rounded-full" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-1.5 flex-1 rounded-full" />
                <Skeleton className="h-5 w-6" />
              </div>
            ))}
          </div>
          <Skeleton className="h-76 w-full rounded-xl" />
        </div>
        <SideSkeleton />
      </div>

      <Skeleton aria-hidden className="mx-auto h-38 w-full max-w-xl rounded-xl" />
    </main>
  )
}
