import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { siteConfig } from "@/config/site.config"

import { ReadmeBadgeSection } from "@/features/scout/components/ReadmeBadgeSection"

function renderSection() {
  const user = userEvent.setup()
  render(<ReadmeBadgeSection login="octocat" ovr={82} rarity="gold" />)
  return user
}

describe("ReadmeBadgeSection", () => {
  it("rozetin önizlemesini ağ isteği olmadan kartın puanından üretir", () => {
    renderSection()

    const src = screen.getByAltText(/octocat/i).getAttribute("src") ?? ""
    expect(src).toMatch(/^data:image\/svg\+xml/)
    expect(decodeURIComponent(src)).toContain("82 rating · gold")
  })

  it("AI ajanı için komutu kopyalar", async () => {
    const user = renderSection()

    await user.click(screen.getByRole("button", { name: /copy ai prompt/i }))

    const text = await navigator.clipboard.readText()
    expect(text).toContain(`${siteConfig.url}/llms.txt`)
    expect(text).toContain("octocat")
  })

  it("README için Markdown'ı kullanıcı adıyla gösterir ve kopyalar", async () => {
    const user = renderSection()
    const markdown = `[![Gitscout](${siteConfig.url}/badge/octocat.svg)](${siteConfig.url}/u/octocat)`

    // Satır renklendirme için parçalara bölünür; okunan metin yine tek parça Markdown'dır.
    expect(screen.getByLabelText("Markdown")).toHaveTextContent(markdown, {
      normalizeWhitespace: false
    })

    // Satırın yanındaki simge düğmesi ve alttaki düğme aynı metni kopyalar.
    const buttons = screen.getAllByRole("button", { name: /copy markdown/i })
    expect(buttons).toHaveLength(2)
    for (const button of buttons) {
      await navigator.clipboard.writeText("")
      await user.click(button)
      expect(await navigator.clipboard.readText()).toBe(markdown)
    }
  })
})
