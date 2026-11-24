import { AddPlayerForm } from "@/features/scout/components/AddPlayerForm"
import * as m from "@/paraglide/messages.js"

/** Paylaşılan kart ya da kapışma linkiyle gelen ziyaretçiye kendi kartını çıkarma çağrısı. */
export function GetYourCard() {
  return (
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
      <AddPlayerForm />
    </section>
  )
}
