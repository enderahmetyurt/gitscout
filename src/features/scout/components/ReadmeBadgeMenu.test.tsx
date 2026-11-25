import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { siteConfig } from "@/config/site.config"

import { ReadmeBadgeMenu } from "@/features/scout/components/ReadmeBadgeMenu"

async function openMenu() {
  const user = userEvent.setup()
  render(<ReadmeBadgeMenu login="octocat" ovr={82} rarity="gold" />)
  await user.click(screen.getByRole("button", { name: /readme badge/i }))
  return user
}

describe("ReadmeBadgeMenu", () => {
  it("rozetin önizlemesini ağ isteği olmadan sayfadaki puandan üretir", async () => {
    await openMenu()

    const src = (await screen.findByAltText(/octocat/i)).getAttribute("src") ?? ""
    expect(src).toMatch(/^data:image\/svg\+xml/)
    expect(decodeURIComponent(src)).toContain("82 rating · gold")
  })

  it("AI ajanı için komutu kopyalar", async () => {
    const user = await openMenu()

    await user.click(await screen.findByRole("menuitem", { name: /copy ai prompt/i }))

    const text = await navigator.clipboard.readText()
    expect(text).toContain(`${siteConfig.url}/llms.txt`)
    expect(text).toContain("octocat")
  })

  it("README için Markdown'ı kullanıcı adıyla kopyalar", async () => {
    const user = await openMenu()

    await user.click(await screen.findByRole("menuitem", { name: /copy markdown/i }))

    expect(await navigator.clipboard.readText()).toBe(
      `[![Gitscout](${siteConfig.url}/badge/octocat.svg)](${siteConfig.url}/u/octocat)`
    )
  })
})
