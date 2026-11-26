import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"

import { analyticsEventSchema, pagePathSchema } from "@/schemas/analytics.schema"

import { getDb } from "@/lib/db"

/**
 * Yerel geliştirme canlı veritabanına bağlı ve satırlar silinemiyor; yerel gezinti sayaçlara yazılmaz.
 */
const PERSIST = !import.meta.env.DEV

/**
 * Sayfa görüntülemesini Supabase'e yazar (`source = 'site'`). Profil ve kapışma sayaçlarını
 * veritabanı fonksiyonu yoldan türetir; uygulama rolü tablolara doğrudan yazamaz.
 */
export const recordPageView = createServerFn({ method: "POST" })
  .validator(z.object({ path: pagePathSchema }))
  .handler(async ({ data }) => {
    if (!PERSIST) return
    const sql = getDb()
    await sql`select gitscout.record_page_view(${data.path})`
  })

/** Özel olayı Supabase'e yazar; aynı gün ve aynı veriyle gelen olaylar tek satırda sayılır. */
export const recordEvent = createServerFn({ method: "POST" })
  .validator(analyticsEventSchema)
  .handler(async ({ data: { name, ...properties } }) => {
    if (!PERSIST) return
    const sql = getDb()
    await sql`select gitscout.record_event(${name}, ${sql.json(properties)})`
  })
