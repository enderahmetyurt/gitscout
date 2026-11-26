import { useState } from "react"

import { Bot, Check, Code, Copy, FileText } from "lucide-react"
import { toast } from "sonner"

import { siteConfig } from "@/config/site.config"

import { trackEvent } from "@/lib/analytics"

import { Button } from "@/components/ui/button"
import { playerBadgeSvg, svgDataUri } from "@/features/scout/helpers/player-badge"
import { readmeBadgeMarkdown, readmeBadgeParts } from "@/features/scout/helpers/readme-badge"
import type { Rarity } from "@/features/scout/types/player.types"
import * as m from "@/paraglide/messages.js"

type ReadmeBadgeSectionProps = { login: string; ovr: number; rarity: Rarity }

/** Kopyalandı işaretinin ekranda kalma süresi. */
const COPIED_MS = 2000

/**
 * Profil README'sine rozet eklemek için iki yol: AI ajanına verilecek komut ya da hazır Markdown.
 * Önizleme kartın puan ve nadirliğinden yerelde üretilir; gerçek rozet adresine istek atılmaz.
 * Rozet çeşitleri eklendiğinde seçim bu bölüme gelir.
 */
export function ReadmeBadgeSection({ login, ovr, rarity }: ReadmeBadgeSectionProps) {
  const markdown = readmeBadgeMarkdown(siteConfig.url, login)
  const parts = readmeBadgeParts(siteConfig.url, login)
  const [copied, setCopied] = useState(false)

  const copy = (via: "prompt" | "markdown") => {
    trackEvent({ name: "readme_badge_copied", login, via })
    const text =
      via === "prompt"
        ? m.readme_prompt({ url: `${siteConfig.url}/llms.txt`, username: login })
        : markdown
    navigator.clipboard
      .writeText(text)
      .then(() => {
        if (via === "markdown") {
          setCopied(true)
          setTimeout(() => setCopied(false), COPIED_MS)
        }
        toast.success(via === "prompt" ? m.readme_prompt_copied() : m.readme_markdown_copied())
      })
      .catch(() => toast.error(m.readme_copy_failed()))
  }

  return (
    <section aria-labelledby="readme-heading" className="surface flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-1">
        <h2 id="readme-heading" className="text-sm font-semibold">
          {m.readme_badge()}
        </h2>
        <p className="text-xs text-muted-foreground">{m.readme_badge_hint()}</p>
      </div>

      {/* Rozetin README'de nasıl duracağını gösteren küçük bir dosya görünümü. */}
      <figure className="overflow-hidden rounded-lg border bg-background">
        <figcaption className="flex items-center gap-1.5 border-b bg-muted/50 px-3 py-2 font-mono text-xs text-muted-foreground">
          <FileText aria-hidden className="size-3.5" />
          README.md
        </figcaption>
        <div className="flex items-center justify-center bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[14px_14px] px-4 py-10">
          <img
            src={svgDataUri(playerBadgeSvg({ ovr, rarity }))}
            alt={m.readme_badge_preview({ username: login })}
            height={28}
            className="h-7 w-fit drop-shadow-sm"
          />
        </div>
      </figure>

      <div className="flex flex-col gap-1.5">
        <span id="readme-markdown-label" className="text-xs font-medium text-muted-foreground">
          {m.readme_markdown_label()}
        </span>
        <div className="flex items-start gap-2 rounded-md border bg-background py-1.5 ps-3 pe-1.5">
          <code
            aria-labelledby="readme-markdown-label"
            className="min-w-0 flex-1 py-1 font-mono text-xs leading-relaxed break-all text-muted-foreground"
          >
            [![<span className="text-code-alt">{parts.alt}</span>](
            <span className="text-code-image">{parts.image}</span>)](
            <span className="text-code-link">{parts.link}</span>)
          </code>
          <Button
            size="icon"
            variant="ghost"
            aria-label={m.readme_copy_markdown()}
            onClick={() => copy("markdown")}
            className="size-8 shrink-0"
          >
            {copied ? <Check aria-hidden className="text-success" /> : <Copy aria-hidden />}
          </Button>
        </div>
      </div>

      <ul className="flex list-disc flex-col gap-1 ps-4 text-xs text-muted-foreground">
        <li>{m.readme_how_prompt()}</li>
        <li>{m.readme_how_markdown()}</li>
      </ul>
      <div className="grid gap-2 sm:grid-cols-2">
        <Button onClick={() => copy("prompt")}>
          <Bot aria-hidden />
          {m.readme_copy_prompt()}
        </Button>
        <Button variant="secondary" onClick={() => copy("markdown")}>
          <Code aria-hidden />
          {m.readme_copy_markdown()}
        </Button>
      </div>
    </section>
  )
}
