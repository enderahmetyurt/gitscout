import { Bot, Code, FileBadge } from "lucide-react"
import { toast } from "sonner"

import { siteConfig } from "@/config/site.config"

import { trackEvent } from "@/lib/analytics"

import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { playerBadgeSvg, svgDataUri } from "@/features/scout/helpers/player-badge"
import { readmeBadgeMarkdown } from "@/features/scout/helpers/readme-badge"
import type { Rarity } from "@/features/scout/types/player.types"
import * as m from "@/paraglide/messages.js"

type ReadmeBadgeMenuProps = { login: string; ovr: number; rarity: Rarity }

/**
 * Profil README'sine rozet eklemek için iki yol: AI ajanına verilecek komut ya da hazır Markdown.
 * Önizleme sayfadaki puan ve nadirlikten yerelde üretilir; gerçek rozet adresine istek atılmaz.
 */
export function ReadmeBadgeMenu({ login, ovr, rarity }: ReadmeBadgeMenuProps) {
  const copy = (via: "prompt" | "markdown") => {
    trackEvent({ name: "readme_badge_copied", login, via })
    const text =
      via === "prompt"
        ? m.readme_prompt({ url: `${siteConfig.url}/llms.txt`, username: login })
        : readmeBadgeMarkdown(siteConfig.url, login)
    navigator.clipboard
      .writeText(text)
      .then(() =>
        toast.success(via === "prompt" ? m.readme_prompt_copied() : m.readme_markdown_copied())
      )
      .catch(() => toast.error(m.readme_copy_failed()))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={buttonVariants({ variant: "outline", size: "sm" })}>
        <FileBadge aria-hidden />
        {m.readme_badge()}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-auto overscroll-contain whitespace-nowrap">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex max-w-64 flex-col items-center gap-2 font-normal whitespace-normal">
            <img
              src={svgDataUri(playerBadgeSvg({ ovr, rarity }))}
              alt={m.readme_badge_preview({ username: login })}
              height={20}
              className="h-5 w-auto"
            />
            <span className="text-center text-xs text-pretty text-muted-foreground">
              {m.readme_badge_hint()}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => copy("prompt")}>
          <Bot aria-hidden />
          {m.readme_copy_prompt()}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => copy("markdown")}>
          <Code aria-hidden />
          {m.readme_copy_markdown()}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
