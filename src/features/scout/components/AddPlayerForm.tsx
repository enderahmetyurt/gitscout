import { useEffect, useState } from "react"

import { useNavigate } from "@tanstack/react-router"
import { LoaderCircle } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "cn"
import { Controller, useForm } from "react-hook-form"

import { trackEvent } from "@/lib/analytics"
import { getLangParam } from "@/helpers/localized-url"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { errorText } from "@/features/scout/helpers/error-text"
import { useAddPlayer } from "@/features/scout/hooks/use-add-player"
import { addPlayerSchema } from "@/features/scout/schemas/player.schema"
import type { AddPlayerInput } from "@/features/scout/schemas/player.schema"
import * as m from "@/paraglide/messages.js"

/** GitHub'dan çekme 10-40 saniye sürebiliyor; adımlar beklemenin sürdüğünü gösterir. Son adımda durur. */
const SCOUTING_STEPS = [
  m.add_step_profile,
  m.add_step_repos,
  m.add_step_activity,
  m.add_step_score
] as const
const STEP_MS = 4000

/** Butonun bekleme yazısı: adımlar sırayla değişir, son adımda kalır. */
function ScoutingLabel() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((current) => Math.min(current + 1, SCOUTING_STEPS.length - 1))
    }, STEP_MS)
    return () => clearInterval(timer)
  }, [])

  const message = SCOUTING_STEPS[step] ?? SCOUTING_STEPS[0]
  return <span aria-live="polite">{message()}</span>
}

type AddPlayerFormProps = {
  /** Bulunamayan bir profil sayfasında kullanıcı adı hazır gelir. */
  defaultUsername?: string
  /** Dar kutularda: kısa buton, beklerken adımlar yerine tek bir yazı. */
  compact?: boolean
}

export function AddPlayerForm({ defaultUsername = "", compact = false }: AddPlayerFormProps) {
  const navigate = useNavigate()
  const addPlayer = useAddPlayer()
  const form = useForm<AddPlayerInput>({
    resolver: zodResolver(addPlayerSchema),
    defaultValues: { username: defaultUsername }
  })

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const player = await addPlayer.mutateAsync(values.username)
      trackEvent({ name: "card_requested", login: player.login })
      form.reset()
      await navigate({
        to: "/{-$lang}/u/$username",
        params: { lang: getLangParam(), username: player.login }
      })
    } catch (error) {
      // Yalnızca hata kodu gider (ör. github:not-found); yazılan metin gönderilmez.
      trackEvent({
        name: "card_request_failed",
        reason: error instanceof Error ? error.message.slice(0, 40) : "unknown"
      })
      form.setError("root.server", { message: errorText(error) })
    }
  })

  const isSubmitting = form.formState.isSubmitting

  return (
    <form onSubmit={onSubmit} noValidate className="flex w-full max-w-2xl flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="flex-1 gap-1.5">
              <FieldLabel htmlFor={field.name} className="sr-only">
                {m.add_label()}
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder={m.add_placeholder()}
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                className="h-11"
                aria-invalid={fieldState.invalid}
                aria-describedby={fieldState.invalid ? `${field.name}-error` : undefined}
              />
              {fieldState.invalid ? (
                <FieldError id={`${field.name}-error`} errors={[fieldState.error]} />
              ) : null}
            </Field>
          )}
        />
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          // Bekleme yazıları değişirken buton genişliği oynamasın.
          className={cn("h-11 px-5", compact ? "sm:w-44" : "sm:w-64")}
        >
          {isSubmitting ? (
            <>
              <LoaderCircle aria-hidden className="animate-spin motion-reduce:animate-none" />
              {compact ? m.add_preparing() : <ScoutingLabel />}
            </>
          ) : (
            m.add_submit()
          )}
        </Button>
      </div>
      <p role="alert" className="text-sm text-destructive empty:hidden">
        {form.formState.errors.root?.server?.message}
      </p>
    </form>
  )
}
