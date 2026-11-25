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
import { readmeBadgeMarkdown } from "@/features/scout/helpers/readme-badge"
import * as m from "@/paraglide/messages.js"

type ReadmeBadgeMenuProps = { login: string }

/** Profil README'sine rozet eklemek için iki yol: AI ajanına verilecek komut ya da hazır Markdown. */
export function ReadmeBadgeMenu({ login }: ReadmeBadgeMenuProps) {
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
          <DropdownMenuLabel className="flex justify-center">
            <img
              src={`/badge/${login}.svg`}
              alt={m.readme_badge_preview({ username: login })}
              height={20}
              className="h-5 w-auto"
            />
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
