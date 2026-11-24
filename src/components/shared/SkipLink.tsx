import * as m from "@/paraglide/messages.js"

/** Klavye kullanıcıları her sayfada tekrar eden menüyü atlayıp doğrudan içeriğe geçebilsin. */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
    >
      {m.skip_to_content()}
    </a>
  )
}
