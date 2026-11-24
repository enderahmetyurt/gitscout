import { useNavigate } from "@tanstack/react-router"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAddPlayer } from "@/features/scout/hooks/use-add-player"
import { addPlayerSchema } from "@/features/scout/schemas/player.schema"
import type { AddPlayerInput } from "@/features/scout/schemas/player.schema"

export function AddPlayerForm() {
  const navigate = useNavigate()
  const addPlayer = useAddPlayer()
  const form = useForm<AddPlayerInput>({
    resolver: zodResolver(addPlayerSchema),
    defaultValues: { username: "" }
  })

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const player = await addPlayer.mutateAsync({ username: values.username })
      form.reset()
      await navigate({ to: "/u/$username", params: { username: player.login } })
    } catch (error) {
      form.setError("root.server", {
        message: error instanceof Error ? error.message : "Oyuncu eklenemedi"
      })
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
                GitHub kullanıcı adı
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="GitHub kullanıcı adı, örn. addyosmani"
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
          {isSubmitting ? "Scout ediliyor…" : "Kartını çıkar"}
        </Button>
      </div>
      <p role="alert" className="text-sm text-destructive empty:hidden">
        {form.formState.errors.root?.server?.message}
      </p>
    </form>
  )
}
