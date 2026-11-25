import { cn } from "cn"

import { siteConfig } from "@/config/site.config"

import { buttonVariants } from "@/components/ui/button"
import { Bmc } from "@/components/ui/svgs/bmc"
import * as m from "@/paraglide/messages.js"

type BuyMeACoffeeButtonProps = {
  size?: "sm" | "default"
  className?: string
}

/**
 * Buy Me a Coffee'nin resmî sarısı ve logosu. Marka rengi temanın dışında kalır; açık ve koyu temada aynı
 * görünmesi için renkler sabittir.
 */
export function BuyMeACoffeeButton({ size = "default", className }: BuyMeACoffeeButtonProps) {
  return (
    <a
      href={siteConfig.links.buyMeACoffee}
      target="_blank"
      rel="noreferrer"
      className={cn(
        buttonVariants({ size }),
        "bg-[#ffdd00] text-[#0d0c22] shadow-xs hover:bg-[#ffdd00]/90",
        className
      )}
    >
      <Bmc aria-hidden className="h-4 w-auto" />
      {m.footer_support()}
      <span className="sr-only"> {m.new_tab()}</span>
    </a>
  )
}
