import type { ReactNode } from "react"

import { cn } from "cn"

import { Skeleton } from "@/components/ui/skeleton"
import * as m from "@/paraglide/messages.js"

/** Bölüm kutusu: gerçek sayfadaki `surface` kartlarıyla aynı çerçeve ve iç boşluk. */
function Block({ className, children }: { className?: string; children?: ReactNode }) {
  return <div className={cn("surface flex flex-col gap-4 p-4", className)}>{children}</div>
}

/** Bir etiket ve altında ince bir çubuk: rol payları ve kıyas satırları böyle görünür. */
function BarRow() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-8" />
      </div>
      <Skeleton className="h-1.5 w-full rounded-full" />
    </div>
  )
}

/**
 * Oyuncu sayfası yüklenirken gösterilir. Yerleşim `PlayerDetail` ile aynıdır: solda kart, sıra, eylemler;
 * sağda radar, repolar, özet, rol, kıyas ve rozetler. Böylece içerik gelince sayfa kaymaz.
 */
export function PlayerDetailSkeleton() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      aria-busy="true"
      className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 overflow-x-clip px-4 pt-2 pb-20 outline-none sm:px-6"
    >
      <p role="status" className="sr-only">
        {m.player_loading()}
      </p>

      <div aria-hidden className="flex flex-col gap-6">
        <Skeleton className="h-7 w-40" />

        <div className="grid gap-6 md:grid-cols-[20rem_1fr] md:items-start">
          <aside className="flex flex-col items-center gap-4">
            <Skeleton className="h-120 w-80 max-w-full rounded-[28px]" />
            <Skeleton className="h-16 w-full max-w-80 rounded-xl" />
            <div className="flex flex-wrap justify-center gap-2">
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="h-9 w-full max-w-80" />
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-32" />
            </div>
          </aside>

          <div className="flex min-w-0 flex-col gap-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Block className="items-center justify-center">
                <Skeleton className="aspect-square w-full max-w-[220px] rounded-full" />
              </Block>
              <Block className="gap-0 p-0">
                <Skeleton className="m-4 mb-2 h-4 w-32" />
                <div className="flex flex-1 flex-col divide-y border-t">
                  {[0, 1, 2].map((item) => (
                    <div key={item} className="flex flex-col justify-center gap-2 px-4 py-3">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  ))}
                </div>
              </Block>
            </div>

            <Block className="lg:flex-row lg:items-start lg:justify-between lg:gap-8">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-64 max-w-full" />
                <Skeleton className="h-4 w-52 max-w-full" />
              </div>
              <div className="flex gap-6 border-t pt-4 lg:border-s lg:border-t-0 lg:ps-8 lg:pt-0">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="flex flex-col gap-1.5">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-7 w-14" />
                  </div>
                ))}
              </div>
            </Block>

            <Block>
              <div className="flex items-baseline justify-between gap-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="flex-1 basis-40">
                    <BarRow />
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 border-t pt-4">
                {[0, 1, 2, 3].map((item) => (
                  <Skeleton key={item} className="h-7 w-24" />
                ))}
              </div>
            </Block>

            <Block className="gap-3">
              <div className="flex items-baseline justify-between gap-2">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-3 w-28" />
              </div>
              <div className="grid gap-x-10 gap-y-3 sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-3">
                {[0, 1, 2, 3, 4, 5].map((item) => (
                  <BarRow key={item} />
                ))}
              </div>
            </Block>

            <div className="flex flex-col gap-4">
              <Skeleton className="h-6 w-24" />
              <div className="grid gap-3 sm:grid-cols-2">
                {[0, 1, 2, 3].map((item) => (
                  <div key={item} className="surface flex items-start gap-3 p-3">
                    <Skeleton className="size-9 shrink-0" />
                    <div className="flex flex-1 flex-col gap-2">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
