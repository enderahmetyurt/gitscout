import postgres from "postgres"

import { serverEnv } from "@/env.server"

let client: postgres.Sql | null = null

/**
 * Yalnızca sunucuda kullanılır. `gitscout_app` rolü yalnızca `gitscout` şemasında okuma ve ekleme yapabilir.
 * Transaction pooler hazır ifade (prepared statement) desteklemediği için `prepare: false`.
 * Bağlantı ilk sorguda açılır; `DATABASE_URL` olmadan test ve derleme çalışmaya devam eder.
 */
export function getDb(): postgres.Sql {
  if (!serverEnv.DATABASE_URL) throw new Error("DATABASE_URL tanımlı değil")
  client ??= postgres(serverEnv.DATABASE_URL, {
    prepare: false,
    max: 3,
    idle_timeout: 20,
    connect_timeout: 10
  })
  return client
}

let refreshClient: postgres.Sql | null = null

/**
 * Yalnızca haftalık yenileme işi kullanır. `gitscout_refresher` rolü okuyup ham veriyi güncelleyebilir;
 * ekleme ve silme yetkisi yoktur. Sitenin normal istekleri bu bağlantıya hiç dokunmaz.
 */
export function getRefreshDb(): postgres.Sql {
  if (!serverEnv.REFRESH_DATABASE_URL) throw new Error("REFRESH_DATABASE_URL tanımlı değil")
  refreshClient ??= postgres(serverEnv.REFRESH_DATABASE_URL, {
    prepare: false,
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10
  })
  return refreshClient
}
