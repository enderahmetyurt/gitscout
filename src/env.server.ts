import { z } from "zod"

/**
 * Yalnızca sunucuda okunan gizli değişkenler. Bu dosya istemci paketine girmesin diye ayrı tutulur:
 * yalnızca sunucu kodu (`lib/github.ts`, `lib/db.ts`) içe aktarır.
 */
const serverSecretsSchema = z.object({
  GITHUB_TOKEN: z.string().optional(),
  DATABASE_URL: z.url().optional(),
  REFRESH_DATABASE_URL: z.url().optional(),
  CRON_SECRET: z.string().min(24).optional()
})

const parsed = serverSecretsSchema.safeParse({
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || undefined,
  DATABASE_URL: process.env.DATABASE_URL || undefined,
  REFRESH_DATABASE_URL: process.env.REFRESH_DATABASE_URL || undefined,
  CRON_SECRET: process.env.CRON_SECRET || undefined
})

if (!parsed.success) {
  // Değerler loglanmaz; yalnızca hangi alanın hatalı olduğu yazılır.
  console.error("❌ Invalid server env:", Object.keys(z.flattenError(parsed.error).fieldErrors))
  throw new Error("Invalid server environment variables. Check src/env.server.ts")
}

export const serverEnv = parsed.data
