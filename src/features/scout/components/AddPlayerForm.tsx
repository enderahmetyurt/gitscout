import { useNavigate } from "@tanstack/react-router"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { getLangParam } from "@/helpers/localized-url"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { errorText } from "@/features/scout/helpers/error-text"
import { useAddPlayer } from "@/features/scout/hooks/use-add-player"
import { addPlayerSchema } from "@/features/scout/schemas/player.schema"
import type { AddPlayerInput } from "@/features/scout/schemas/player.schema"
import * as m from "@/paraglide/messages.js"

type AddPlayerFormProps = {
  /** Bulunamayan bir profil sayfasında kullanıcı adı hazır gelir. */
  defaultUsername?: string
}

export function AddPlayerForm({ defaultUsername = "" }: AddPlayerFormProps) {
  const navigate = useNavigate()
  const addPlayer = useAddPlayer()
  const form = useForm<AddPlayerInput>({
    resolver: zodResolver(addPlayerSchema),
    defaultValues: { username: defaultUsername }
  })

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const player = await addPlayer.mutateAsync({ username: values.username })
      form.reset()
      await navigate({
        to: "/{-$lang}/u/$username",
        params: { lang: getLangParam(), username: player.login }
      })
    } catch (error) {
      form.setError("root.server", { message: errorText(error) })
    }
  })

  const isSubmitting = form.formState.isSubmitting

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-2">
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
                className="h-10"
                aria-invalid={fieldState.invalid}
                aria-describedby={fieldState.invalid ? `${field.name}-error` : undefined}
              />
              {fieldState.invalid ? (
                <FieldError id={`${field.name}-error`} errors={[fieldState.error]} />
              ) : null}
            </Field>
          )}
        />
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? m.add_submitting() : m.add_submit()}
        </Button>
      </div>
      <p role="alert" className="text-sm text-destructive empty:hidden">
        {form.formState.errors.root?.server?.message}
      </p>
    </form>
  )
}
