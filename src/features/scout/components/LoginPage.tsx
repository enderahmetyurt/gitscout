import { SignInPanel } from "@/features/scout/components/SignInPanel"
import * as m from "@/paraglide/messages.js"

type LoginPageProps = {
  /** Geri dönüşte giriş tamamlanamadıysa. */
  failed: boolean
}

/** Giriş isteğe bağlı: neyi sağladığı, neye gerek olmadığı ve neye erişildiği tek sayfada anlatılır. */
export function LoginPage({ failed }: LoginPageProps) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pt-6 pb-20 outline-none sm:px-6"
    >
      <SignInPanel
        headingLevel="h1"
        title={m.login_title()}
        lead={m.login_optional()}
        failed={failed}
      />
    </main>
  )
}
