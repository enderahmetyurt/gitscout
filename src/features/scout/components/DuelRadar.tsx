import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import { STAT_ORDER } from "@/features/scout/constants/scoring.constants"
import { statLabel } from "@/features/scout/helpers/player-text"
import type { ScoredPlayer } from "@/features/scout/types/player.types"
import * as m from "@/paraglide/messages.js"

type DuelRadarProps = {
  left: ScoredPlayer
  right: ScoredPlayer
}

/** İki oyuncunun altı statı aynı grafikte: hangi yönde kimin üstün olduğu tek bakışta. */
export function DuelRadar({ left, right }: DuelRadarProps) {
  const chartConfig = {
    left: { label: left.name, color: "var(--chart-home)" },
    right: { label: right.name, color: "var(--chart-away)" }
  } satisfies ChartConfig
  const data = STAT_ORDER.map((key) => ({
    label: statLabel(key),
    left: left.stats[key].value,
    right: right.stats[key].value
  }))

  return (
    <section className="surface flex flex-col px-2 pt-2 pb-3" aria-label={m.duel_radar_label()}>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[300px] w-full"
        aria-label={m.duel_radar_label()}
      >
        <RadarChart
          data={data}
          outerRadius="68%"
          margin={{ top: 4, right: 40, bottom: 4, left: 40 }}
        >
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
          <PolarAngleAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
          />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <PolarGrid />
          <Radar
            dataKey="left"
            isAnimationActive={false}
            fill="var(--color-left)"
            stroke="var(--color-left)"
            strokeWidth={2}
            fillOpacity={0.22}
            dot={{ r: 3, fillOpacity: 1 }}
          />
          <Radar
            dataKey="right"
            isAnimationActive={false}
            fill="var(--color-right)"
            stroke="var(--color-right)"
            strokeWidth={2}
            fillOpacity={0.22}
            dot={{ r: 3, fillOpacity: 1 }}
          />
          <ChartLegend content={<ChartLegendContent />} />
        </RadarChart>
      </ChartContainer>
    </section>
  )
}
