/**
 * Bir sorgunun başarısızlığı nasıl ele alınır:
 * - `not-found`: GitHub'a gidildi, kota harcandı; aynı ad bir süre GitHub'a sorulmadan reddedilir.
 * - `costly`: GitHub'a gidildi, kota harcandı; yalnızca sayılır.
 * - `free`: GitHub'a gidilmedi (sınır doldu, token yok); sayılmaz.
 */
export type LookupFailure = "not-found" | "costly" | "free"

type LookupGuardOptions = {
  /** Başarısız sorguların sayıldığı pencere. */
  windowMs: number
  /** Bulunamayan adın hatırlandığı süre. */
  notFoundTtlMs: number
  classify: (error: unknown) => LookupFailure
  clock?: () => number
}

/**
 * Yeni kart sorgularını GitHub kotasına karşı korur. Aynı ad için süren sorgu paylaşılır, başarısız
 * sorgular saatlik sınıra sayılsın diye tutulur, bulunamayan adlar bir süre hatırlanır. Durum sunucu
 * örneğinin belleğindedir: örnekler arasında paylaşılmaz ama aynı örneğe gelen tekrarları keser.
 */
export function createLookupGuard({
  windowMs,
  notFoundTtlMs,
  classify,
  clock = Date.now
}: LookupGuardOptions) {
  const inFlight = new Map<string, Promise<unknown>>()
  const notFound = new Map<string, { until: number; error: unknown }>()
  let failures: number[] = []

  const prune = (now: number) => {
    failures = failures.filter((at) => now - at < windowMs)
    for (const [key, entry] of notFound) if (entry.until <= now) notFound.delete(key)
  }

  return {
    /** Penceredeki, kota harcamış başarısız sorgu sayısı. */
    recentFailures(): number {
      prune(clock())
      return failures.length
    },

    /** `task`'ı `key` için bir kez çalıştırır; aynı anda gelen çağrılar aynı sonucu bekler. */
    run<T>(key: string, task: () => Promise<T>): Promise<T> {
      const now = clock()
      prune(now)
      const remembered = notFound.get(key)
      if (remembered) return Promise.reject(remembered.error)

      const pending = inFlight.get(key)
      if (pending) return pending as Promise<T>

      const promise = task()
        .catch((error: unknown) => {
          const kind = classify(error)
          if (kind !== "free") failures.push(clock())
          if (kind === "not-found") notFound.set(key, { until: clock() + notFoundTtlMs, error })
          throw error
        })
        .finally(() => inFlight.delete(key))
      inFlight.set(key, promise)
      return promise
    }
  }
}
