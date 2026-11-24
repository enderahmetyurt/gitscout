import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import { STAT_ORDER } from "@/features/scout/constants/scoring.constants"
import type { ScoredPlayer } from "@/features/scout/types/player.types"

/** Bu puanın altındaki stat gerçekten zayıf sayılır; üstündeyse "gelişime açık" demek yanıltıcı olur. */
const WEAK_STAT_THRESHOLD = 70

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
  const sorted = [...data].sort((a, b) => b.value - a.value)
  const strongest = sorted[0]
  const weakest = sorted[sorted.length - 1]

  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>Stat profili</CardTitle>
        <CardDescription>Altı statın 30-99 ölçeğinde dağılımı</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[260px] w-full">
          <RadarChart
            data={data}
            outerRadius="68%"
            margin={{ top: 8, right: 40, bottom: 8, left: 40 }}
          >
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const entry: unknown = payload[0]?.payload
                    return typeof entry === "object" && entry !== null && "label" in entry
                      ? String(entry.label)
                      : ""
                  }}
                />
              }
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
      {strongest && weakest ? (
        <CardFooter className="flex-col gap-1 text-sm">
          <p className="leading-none font-medium">
            En güçlü: {strongest.label} ({strongest.value})
          </p>
          <p className="leading-none text-muted-foreground">
            {weakest.value < WEAK_STAT_THRESHOLD
              ? `Gelişime açık: ${weakest.label} (${weakest.value})`
              : `Dengeli profil: en düşük stat bile ${weakest.value}`}
          </p>
        </CardFooter>
      ) : null}
    </Card>
  )
}
