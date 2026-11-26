import { describe, expect, it } from "vitest"

import { profileDetailsSchema } from "@/features/scout/schemas/profile.schema"

describe("profileDetailsSchema", () => {
  it("şehri tek boşluklu ve kırpılmış saklar; boş şehir null olur", () => {
    expect(profileDetailsSchema.parse({ city: "  Saint-Étienne  " }).city).toBe("Saint-Étienne")
    expect(profileDetailsSchema.parse({ city: "Rio   de Janeiro" }).city).toBe("Rio de Janeiro")
    expect(profileDetailsSchema.parse({ city: "" }).city).toBeNull()
  })

  it("rakam ya da işaret içeren ve tek harflik şehri reddeder", () => {
    for (const city of ["İzmir 35", "Ankara!", "A", "-Bursa"]) {
      expect(profileDetailsSchema.safeParse({ city }).success).toBe(false)
    }
  })

  it("rüya takımında en fazla beş farklı kişiye izin verir", () => {
    expect(profileDetailsSchema.parse({ dreamTeam: ["Octocat"] }).dreamTeam).toEqual(["octocat"])
    expect(
      profileDetailsSchema.safeParse({ dreamTeam: ["a", "b", "c", "d", "e", "f"] }).success
    ).toBe(false)
    expect(profileDetailsSchema.safeParse({ dreamTeam: ["a", "A"] }).success).toBe(false)
  })

  it("yalnızca tanınan cinsiyetleri kabul eder", () => {
    expect(profileDetailsSchema.safeParse({ gender: "female" }).success).toBe(true)
    expect(profileDetailsSchema.safeParse({ gender: null }).success).toBe(true)
    expect(profileDetailsSchema.safeParse({ gender: "other" }).success).toBe(false)
  })
})
