import { z } from "zod"

import type { StoredPlayer } from "@/features/scout/types/player.types"
import * as m from "@/paraglide/messages.js"

/** GitHub kullanıcı adı kuralları: harf, rakam ve tek tire; en fazla 39 karakter. */
export const usernameSchema = z
  .string()
  .trim()
  // Mesajlar fonksiyon: okunduğu anda (doğrulama sırasında) geçerli dilde yazılır.
  .min(1, { error: () => m.username_required() })
  .max(39, { error: () => m.username_too_long() })
  .regex(/^[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d]))*$/, { error: () => m.username_invalid() })

export const addPlayerSchema = z.object({
  username: usernameSchema
})

export type AddPlayerInput = z.infer<typeof addPlayerSchema>

export const playerRequestSchema = z.object({
  username: usernameSchema,
  refresh: z.boolean().default(false)
})

const checkState = z.enum(["SUCCESS", "FAILURE", "ERROR", "PENDING", "EXPECTED"])

const playerFactsSchema = z.object({
  login: z.string(),
  name: z.string().nullable(),
  avatarUrl: z.string(),
  bio: z.string().nullable(),
  company: z.string().nullable(),
  followers: z.number(),
  createdAt: z.string(),
  topOrg: z.string().nullable(),
  mergedExternalPrs: z.number(),
  utcOffsetMinutes: z.number().nullable().optional(),
  lastYear: z.object({
    commits: z.number(),
    prs: z.number(),
    reviews: z.number(),
    issues: z.number(),
    restricted: z.number()
  }),
  ownedRepos: z.array(
    z.object({
      name: z.string(),
      isArchived: z.boolean(),
      pushedAt: z.string(),
      stars: z.number(),
      forks: z.number(),
      hasDescription: z.boolean(),
      hasHomepage: z.boolean(),
      topicCount: z.number(),
      license: z.string().nullable(),
      readmeBytes: z.number(),
      languages: z.array(z.object({ name: z.string(), size: z.number() }))
    })
  ),
  activeRepos: z.array(
    z.object({
      nameWithOwner: z.string(),
      isOrg: z.boolean(),
      stars: z.number(),
      forks: z.number(),
      languages: z.array(z.object({ name: z.string(), size: z.number() })),
      yearCommits: z.number(),
      userYearCommits: z.number(),
      hasTests: z.boolean(),
      hasCi: z.boolean(),
      checkStates: z.array(checkState),
      userCommitsLastYear: z.number()
    })
  ),
  commits: z.array(
    z.object({
      repo: z.string(),
      sha: z.string().default(""),
      isMerge: z.boolean().default(false),
      message: z.string(),
      date: z.string(),
      changedFiles: z.number().nullable()
    })
  ),
  calendar: z.array(z.object({ date: z.string(), count: z.number() })),
  yearly: z.array(
    z.object({ year: z.number(), total: z.number(), reviews: z.number().optional() })
  ),
  starredRepos: z
    .array(
      z.object({
        name: z.string(),
        stars: z.number(),
        forks: z.number(),
        language: z.string().nullable()
      })
    )
    .optional(),
  repoCommits: z
    .array(z.object({ repo: z.string(), commits: z.number(), stars: z.number() }))
    .optional(),
  ownOrgPrs: z.array(z.object({ org: z.string(), prs: z.number() })).optional()
})

export const storedPlayerSchema: z.ZodType<StoredPlayer> = z.object({
  login: z.string(),
  fetchedAt: z.string(),
  timezone: z.string().optional(),
  facts: playerFactsSchema
})
