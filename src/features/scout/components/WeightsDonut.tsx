import { Label, Pie, PieChart } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import { STAT_ORDER, STAT_WEIGHTS } from "@/features/scout/constants/scoring.constants"
import { percent, statLabel } from "@/features/scout/helpers/player-text"
import type { StatKey } from "@/features/scout/types/player.types"
import * as m from "@/paraglide/messages.js"

/** Her istatistiğin kendi tonu; koyu zeminde birbirinden ayrılacak kadar farklı. */
const STAT_COLORS: Record<StatKey, string> = {
  act: "#3f8fd8",
  imp: "#e0a43a",
  com: "#4caf7a",
  rep: "#e0607e",
  con: "#2fb3a8",
  exp: "#8b7fd6"
}

/** Genel puanın bileşimi: altı istatistiğin payı halka grafikte, yanında renkli açıklama. */
export function WeightsDonut() {
  // Etiketler render sırasında kurulur ki geçerli dilde olsun.
  const config = Object.fromEntries(
    STAT_ORDER.map((key) => [key, { label: statLabel(key), color: STAT_COLORS[key] }])
  ) satisfies ChartConfig
  const data = STAT_ORDER.map((key) => ({
    key,
    share: STAT_WEIGHTS[key] * 100,
    fill: `var(--color-${key})`
  }))

  return (
    <div className="surface grid items-center gap-4 p-4 sm:grid-cols-[12rem_1fr]">
      <ChartContainer config={config} className="mx-auto aspect-square w-48">
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="key" />} />
          <Pie
            data={data}
            dataKey="share"
            nameKey="key"
            innerRadius={56}
            outerRadius={88}
            strokeWidth={3}
            stroke="var(--card)"
            isAnimationActive={false}
          >
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-sm font-semibold"
                    >
                      {m.about_weights_center()}
                    </tspan>
                  </text>
                )
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>

      <ul className="flex w-full max-w-64 flex-col gap-2 text-sm sm:justify-self-start">
        {STAT_ORDER.map((key) => (
          <li key={key} className="flex items-center gap-2">
            <span
              aria-hidden
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: STAT_COLORS[key] }}
            />
            <span className="text-muted-foreground">{statLabel(key)}</span>
            <span className="ms-auto font-semibold tabular-nums">
              {percent(STAT_WEIGHTS[key] * 100)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
