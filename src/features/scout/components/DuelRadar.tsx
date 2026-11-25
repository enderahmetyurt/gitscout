import { cn } from "cn"
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import { RADAR_ORDER } from "@/features/scout/constants/scoring.constants"
import { statLabel } from "@/features/scout/helpers/player-text"
import type { ListPlayer } from "@/features/scout/types/player.types"
import * as m from "@/paraglide/messages.js"

type DuelRadarProps = {
  left: ListPlayer
  right: ListPlayer
}

/** İki oyuncunun altı statı aynı grafikte: hangi yönde kimin üstün olduğu tek bakışta. */
export function DuelRadar({ left, right }: DuelRadarProps) {
  const chartConfig = {
    left: { label: left.name, color: "var(--chart-home)" },
    right: { label: right.name, color: "var(--chart-away)" }
  } satisfies ChartConfig
  const data = RADAR_ORDER.map((key) => ({
    label: statLabel(key),
    left: left.stats[key].value,
    right: right.stats[key].value
  }))

  return (
    <section className="surface flex flex-col px-0 pt-2 pb-3" aria-label={m.duel_radar_label()}>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[300px] w-full"
        aria-label={m.duel_radar_label()}
      >
        <RadarChart
          data={data}
          outerRadius="68%"
          margin={{ top: 8, right: 44, bottom: 8, left: 44 }}
        >
          <ChartTooltip
            cursor={false}
            content={({ active, payload }) => {
              const row: unknown = payload[0]?.payload
              return active && isRow(row) ? (
                <DuelTooltip row={row} left={left.name} right={right.name} />
              ) : null
            }}
          />
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

type Row = { label: string; left: number; right: number }

function isRow(value: unknown): value is Row {
  return (
    typeof value === "object" &&
    value !== null &&
    "label" in value &&
    "left" in value &&
    "right" in value
  )
}

/** İki oyuncunun o stattaki puanı; ad ile puan arasında net boşluk, puanlar hizalı. */
function DuelTooltip({ row, left, right }: { row: Row; left: string; right: string }) {
  const lines = [
    { name: left, value: row.left, color: "bg-chart-home" },
    { name: right, value: row.right, color: "bg-chart-away" }
  ]
  return (
    <div className="flex min-w-48 flex-col gap-2 rounded-lg border bg-popover px-3 py-2.5 text-xs text-popover-foreground shadow-md">
      <span className="font-medium">{row.label}</span>
      <ul className="flex flex-col gap-1.5">
        {lines.map((line) => (
          <li key={line.name} className="flex items-center gap-2">
            <span aria-hidden className={cn("size-2 shrink-0 rounded-sm", line.color)} />
            <span className="min-w-0 flex-1 truncate text-muted-foreground">{line.name}</span>
            <span className="ps-4 font-semibold tabular-nums">{line.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
