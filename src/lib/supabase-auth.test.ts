import type { UserIdentity } from "@supabase/supabase-js"
import { describe, expect, it } from "vitest"

import { githubIdFromIdentity } from "@/lib/supabase-auth"

function identity(id: string, data: Record<string, unknown>): UserIdentity {
  return {
    id,
    identity_id: "5f1c0a8e-0000-4000-8000-000000000000",
    user_id: "9b2d0a8e-0000-4000-8000-000000000000",
    provider: "github",
    identity_data: data
  }
}

describe("githubIdFromIdentity", () => {
  it("reads the numeric GitHub id when every source agrees", () => {
    expect(githubIdFromIdentity(identity("170270", { provider_id: "170270", sub: "170270" }))).toBe(
      170270
    )
  })

  it("rejects an identity whose sources disagree", () => {
    expect(githubIdFromIdentity(identity("170270", { provider_id: "1", sub: "170270" }))).toBeNull()
  })

  it("rejects an identity without a numeric id", () => {
    expect(
      githubIdFromIdentity(identity("5f1c0a8e-0000-4000-8000-000000000000", { sub: "octocat" }))
    ).toBeNull()
  })
})
