import { useEffect, useState } from "react"

type CountUpOptions = {
  /** İlk artıştan önceki bekleme; kartların girişi bitsin diye. */
  delay?: number
  /** Her adım arasındaki süre. */
  step?: number
}

/**
 * 0'dan hedefe birer birer sayar (0, 1, 2…). Hareketi azaltma tercihinde sonuç doğrudan görünür.
 * Sayaç bir zamanlayıcıyla senkron tutulur; hedef değişirse bileşen `key` ile yeniden kurulmalı.
 */
export function useCountUp(target: number, { delay = 450, step = 200 }: CountUpOptions = {}) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let current = 0
    let timer = 0
    const tick = () => {
      current += 1
      setValue(current)
      if (current < target) timer = window.setTimeout(tick, step)
    }
    timer = window.setTimeout(
      () => {
        if (reduce) setValue(target)
        else if (target > 0) tick()
      },
      reduce ? 0 : delay
    )
    return () => window.clearTimeout(timer)
  }, [target, delay, step])

  return value
}
