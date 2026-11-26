import { z } from "zod"

/**
 * Yalnızca sunucuda okunan gizli değişkenler. Bu dosya istemci paketine girmesin diye ayrı tutulur:
 * yalnızca sunucu kodu (`lib/github.ts`, `lib/db.ts`, `lib/supabase-auth.ts`) içe aktarır.
 */
const serverSecretsSchema = z.object({
  GITHUB_TOKEN: z.string().optional(),
  DATABASE_URL: z.url().optional(),
  REFRESH_DATABASE_URL: z.url().optional(),
  CRON_SECRET: z.string().min(24).optional(),
  // GitHub ile giriş yalnızca Supabase Auth'u OAuth aracısı olarak kullanır; ikisi de yoksa giriş kapalıdır.
  SUPABASE_URL: z.url().optional(),
  SUPABASE_PUBLISHABLE_KEY: z.string().min(20).optional()
})

const parsed = serverSecretsSchema.safeParse({
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || undefined,
  DATABASE_URL: process.env.DATABASE_URL || undefined,
  REFRESH_DATABASE_URL: process.env.REFRESH_DATABASE_URL || undefined,
  CRON_SECRET: process.env.CRON_SECRET || undefined,
  SUPABASE_URL: process.env.SUPABASE_URL || undefined,
  SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY || undefined
})

if (!parsed.success) {
  // Değerler loglanmaz; yalnızca hangi alanın hatalı olduğu yazılır.
  console.error("❌ Invalid server env:", Object.keys(z.flattenError(parsed.error).fieldErrors))
  throw new Error("Invalid server environment variables. Check src/env.server.ts")
}

export const serverEnv = parsed.data
