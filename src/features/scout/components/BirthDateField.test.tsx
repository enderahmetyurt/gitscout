import { useState } from "react"

import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { BirthDateField } from "@/features/scout/components/BirthDateField"
import { renderWithProviders } from "@/test/render"

function Harness({ initial, onChange }: { initial: string; onChange: (value: string) => void }) {
  const [value, setValue] = useState(initial)
  return (
    <>
      <span id="birth-label">Birth date</span>
      <BirthDateField
        value={value}
        onChange={(next) => {
          setValue(next)
          onChange(next)
        }}
        disabled={false}
        describedBy="birth-rule"
      />
    </>
  )
}

describe("BirthDateField", () => {
  it("takvimden seçilen günü YYYY-AA-GG olarak verir ve düğmede gösterir", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderWithProviders(<Harness initial="1995-05-10" onChange={onChange} />)

    const trigger = screen.getByRole("button", { name: /Birth date/ })
    expect(trigger).toHaveTextContent("May 10, 1995")

    await user.click(trigger)
    await user.click(await screen.findByRole("button", { name: /May 19th, 1995/ }))

    expect(onChange).toHaveBeenCalledWith("1995-05-19")
    expect(trigger).toHaveTextContent("May 19, 1995")
  })

  it("boşken yer tutucu metni gösterir", () => {
    renderWithProviders(<Harness initial="" onChange={vi.fn()} />)

    expect(screen.getByRole("button", { name: /Birth date/ })).toHaveTextContent("Pick a date")
  })
})
