import { createFileRoute } from "@tanstack/react-router"

import { siteConfig } from "@/config/site.config"

import { createSession, sessionCookie } from "@/lib/session"
import { exchangeGithubCode, supabaseCookieNames } from "@/lib/supabase-auth"

import { syncGithubAccount } from "@/features/scout/api/sync-account.api"

/** GitHub kodları bu uzunluğun altında; daha uzun girdi Supabase'e gönderilmeden reddedilir. */
const MAX_CODE_LENGTH = 512

/**
 * GitHub girişinin geri dönüşü. Kod sunucuda oturuma çevrilir, hesap GitHub'dan doğrulanıp kaydedilir ve
 * uygulamanın kendi httpOnly oturum çerezi yazılır. Supabase'in akış çerezleri her durumda silinir.
 * Yönlendirme hedefi sabit: dışarıdan gelen bir adrese yönlendirilmez.
 */
export const Route = createFileRoute("/auth/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const cookieHeader = request.headers.get("cookie") ?? ""
        const headers = new Headers({ "Cache-Control": "no-store" })
        for (const name of supabaseCookieNames(cookieHeader)) {
          headers.append("Set-Cookie", sessionCookie.serializeRemoval(name))
        }

        const redirect = (path: string) => {
          headers.set("Location", new URL(path, siteConfig.url).toString())
          return new Response(null, { status: 303, headers })
        }

        const code = new URL(request.url).searchParams.get("code")
        if (!code || code.length > MAX_CODE_LENGTH) return redirect("/login?error=failed")

        try {
          const identity = await exchangeGithubCode(cookieHeader, code)
          const account = await syncGithubAccount(identity)
          const token = await createSession(account.githubId)
          headers.append("Set-Cookie", sessionCookie.serialize(token))
          return redirect(`/u/${account.login}`)
        } catch (error) {
          console.error("[auth] GitHub girişi tamamlanamadı", error)
          return redirect("/login?error=failed")
        }
      }
    }
  }
})
