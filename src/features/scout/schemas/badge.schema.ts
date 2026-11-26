import { z } from "zod"

import { locales } from "@/paraglide/runtime.js"

/** README rozetinin boyu: mini SVG şerit, orta ve tam boy PNG kart. */
export const badgeSizeSchema = z.enum(["mini", "medium", "full"])

export type BadgeSize = z.infer<typeof badgeSizeSchema>

/** Kart rozetinin boyu; mini rozet SVG olarak ayrı adresten sunulur. */
export const badgeCardSizeSchema = badgeSizeSchema.exclude(["mini"])

export type BadgeCardSize = z.infer<typeof badgeCardSizeSchema>

/** Rozet görselinin dili; adreste `?lang=` ile seçilir, verilmezse İngilizce. */
export const badgeLocaleSchema = z.enum(locales)

export type BadgeLocale = z.infer<typeof badgeLocaleSchema>
