import { Skeleton } from "@/components/ui/skeleton"
import * as m from "@/paraglide/messages.js"

/** Profil formundaki bir alan: etiket satırı ve denetim. */
function FieldSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-9 w-full" />
    </div>
  )
}

/** Yan yana iki alan; formdaki çiftlerle aynı ızgara. */
function PairSkeleton() {
  return (
    <div className="grid items-start gap-x-6 gap-y-5 sm:grid-cols-2">
      <FieldSkeleton />
      <FieldSkeleton />
    </div>
  )
}

/**
 * Ayarlar içeriği yüklenirken gösterilir. Yerleşim `SettingsContent` ile aynı: solda kart önizlemesi ve
 * özel kart seçici, sağda profil formu ve README rozeti bölümü.
 */
export function SettingsSkeleton() {
  return (
    <div aria-busy="true" className="grid items-start gap-8 md:grid-cols-[20rem_1fr]">
      <p role="status" className="sr-only">
        {m.page_loading()}
      </p>
      <aside aria-hidden className="flex flex-col items-center gap-3">
        <Skeleton className="h-120 w-80 max-w-full rounded-[28px]" />
        <Skeleton className="h-10 w-64 rounded-md" />
        <Skeleton className="h-3 w-24" />
      </aside>
      <div aria-hidden className="flex min-w-0 flex-col gap-6">
        <div className="surface flex flex-col gap-6 p-4">
          <Skeleton className="h-4 w-16" />
          {/* Kişisel bilgiler: iki çift; kart: bir çift; rüya takımı: tek alan. */}
          <div className="flex flex-col gap-5">
            <Skeleton className="h-3 w-28" />
            <PairSkeleton />
            <PairSkeleton />
          </div>
          <div className="flex flex-col gap-5 pt-2">
            <Skeleton className="h-3 w-12" />
            <PairSkeleton />
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="-mx-4 flex justify-end border-t px-4 pt-4">
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
        <Skeleton className="h-56 w-full rounded-xl" />
      </div>
    </div>
  )
}
