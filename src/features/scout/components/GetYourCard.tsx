import { Link } from "@tanstack/react-router"

import { getLangParam } from "@/helpers/localized-url"

import { AddPlayerForm } from "@/features/scout/components/AddPlayerForm"
import * as m from "@/paraglide/messages.js"

/**
 * Paylaşılan kart ya da kapışma linkiyle gelen ziyaretçiye kendi kartını çıkarma çağrısı.
 * Altında, listede olmak istemeyenler için Hakkında sayfasındaki kaldırma maddesine giden bağlantı var.
 */
export function GetYourCard() {
  return (
    <div className="flex flex-col items-center gap-3">
      <section
        aria-labelledby="get-your-card-heading"
        className="surface mx-auto flex w-full max-w-xl flex-col gap-3 px-5 py-5"
      >
        <div className="flex flex-col gap-1">
          <h2 id="get-your-card-heading" className="text-lg font-semibold">
            {m.cta_title()}
          </h2>
          <p className="text-sm text-pretty text-muted-foreground">{m.cta_lead()}</p>
        </div>
        <AddPlayerForm compact />
      </section>
      <Link
        to="/{-$lang}/about"
        params={{ lang: getLangParam() }}
        hash="remove-card"
        className="rounded-sm text-sm text-destructive underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        {m.remove_card_link()}
      </Link>
    </div>
  )
}
