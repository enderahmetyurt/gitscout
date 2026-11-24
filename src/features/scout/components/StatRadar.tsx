import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts"

import { Card, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import { STAT_ORDER } from "@/features/scout/constants/scoring.constants"
import type { ScoredPlayer, Stat } from "@/features/scout/types/player.types"

const chartConfig = {
  value: {
    label: "Puan",
    color: "var(--chart-1)"
  }
} satisfies ChartConfig

type StatRadarProps = {
  stats: ScoredPlayer["stats"]
}

/** Altı statın şekli: oyuncunun hangi yönde güçlü olduğunu tek bakışta gösterir. */
export function StatRadar({ stats }: StatRadarProps) {
  const data = STAT_ORDER.map((key) => ({
    label: stats[key].label,
    value: stats[key].value
  }))

  return (
    <Card className="h-full justify-center py-4">
      <CardContent className="px-2">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[220px] w-full"
          aria-label="Stat profili grafiği"
        >
          <RadarChart
            data={data}
            outerRadius="70%"
            margin={{ top: 4, right: 36, bottom: 4, left: 36 }}
          >
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                const label: unknown = payload[0]?.payload?.label
                const stat = STAT_ORDER.map((key) => stats[key]).find(
                  (item) => item.label === label
                )
                return active && stat ? <StatTooltip stat={stat} /> : null
              }}
            />
            <PolarAngleAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            <PolarGrid />
            <Radar
              dataKey="value"
              isAnimationActive={false}
              fill="var(--color-value)"
              stroke="var(--color-value)"
              strokeWidth={2}
              fillOpacity={0.35}
              dot={{ r: 4, fillOpacity: 1 }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

/** Puanın nereden geldiği: tek cümlelik özet ve her parçanın katkısı. */
function StatTooltip({ stat }: { stat: Stat }) {
  return (
    <div className="flex w-64 flex-col gap-2 rounded-lg border bg-popover px-3 py-2.5 text-xs text-popover-foreground shadow-md">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-medium">{stat.label}</span>
        <span className="text-base font-semibold">{stat.value}</span>
      </div>
      <p className="text-pretty text-muted-foreground">{stat.summary}</p>
      <ul className="flex flex-col gap-1.5">
        {stat.parts.map((part) => (
          <li key={part.label} className="flex flex-col gap-1">
            <span className="flex justify-between gap-2">
              <span>{part.label}</span>
              <span className="text-muted-foreground">
                {Math.round(part.points)}/{part.max}
              </span>
            </span>
            <span aria-hidden className="h-1 overflow-hidden rounded-full bg-muted">
              <span
                className="block h-full rounded-full bg-chart-1"
                style={{ width: `${part.max === 0 ? 0 : (part.points / part.max) * 100}%` }}
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
