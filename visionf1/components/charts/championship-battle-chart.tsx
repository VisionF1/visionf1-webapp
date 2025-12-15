"use client"

import { Area, AreaChart, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A stacked area chart for championship battle"

// Cumulative points progression for 24 races (2025 Season)
const chartData = [
  { race: "AUS", lando: 25, max: 18, oscar: 2 },
  { race: "CHN", lando: 44, max: 36, oscar: 34 },
  { race: "JPN", lando: 62, max: 61, oscar: 49 },
  { race: "BHR", lando: 77, max: 69, oscar: 74 },
  { race: "KSA", lando: 99, max: 87, oscar: 89 },
  { race: "MIA", lando: 115, max: 99, oscar: 131 },
  { race: "EMI", lando: 133, max: 124, oscar: 146 },
  { race: "MON", lando: 158, max: 136, oscar: 161 },
  { race: "ESP", lando: 176, max: 137, oscar: 186 },
  { race: "CAN", lando: 176, max: 155, oscar: 198 },
  { race: "AUT", lando: 201, max: 155, oscar: 216 },
  { race: "GBR", lando: 226, max: 165, oscar: 234 },
  { race: "BEL", lando: 250, max: 185, oscar: 266 },
  { race: "HUN", lando: 275, max: 187, oscar: 284 },
  { race: "NED", lando: 275, max: 205, oscar: 309 },
  { race: "ITA", lando: 293, max: 230, oscar: 324 },
  { race: "AZE", lando: 299, max: 255, oscar: 324 },
  { race: "SIN", lando: 314, max: 273, oscar: 336 },
  { race: "USA", lando: 332, max: 306, oscar: 346 },
  { race: "MEX", lando: 357, max: 321, oscar: 356 },
  { race: "BRA", lando: 390, max: 341, oscar: 366 },
  { race: "LVG", lando: 390, max: 366, oscar: 366 },
  { race: "QAT", lando: 408, max: 396, oscar: 392 },
  { race: "ABU", lando: 423, max: 421, oscar: 410 },
]

const chartConfig = {
  lando: {
    label: "Lando Norris",
    color: "#f97316", // Orange-500
  },
  max: {
    label: "Max Verstappen",
    color: "#3b82f6", // Blue-500
  },
  oscar: {
    label: "Oscar Piastri",
    color: "#e5e7eb", // Gray-200
  },
} satisfies ChartConfig

export function ChampionshipBattleChart() {
  return (
    <Card className="border-0 shadow-none bg-transparent w-full h-full">
      <CardContent className="p-0 h-full">
        <ChartContainer config={chartConfig} className="w-full h-full aspect-auto">
          <AreaChart
            data={chartData}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillLando" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-lando)" stopOpacity={0.6} />
                <stop offset="95%" stopColor="var(--color-lando)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMax" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-max)" stopOpacity={0.6} />
                <stop offset="95%" stopColor="var(--color-max)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillOscar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-oscar)" stopOpacity={0.6} />
                <stop offset="95%" stopColor="var(--color-oscar)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="race"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10, fontWeight: 600 }}
              interval={"preserveStartEnd"}
              minTickGap={12}
            />
            <YAxis hide domain={[0, 'dataMax']} padding={{ top: 0, bottom: 0 }} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(value) => value}
                />
              }
            />
            {/* Render Order: Lando (Biggest) -> Max -> Oscar (Smallest) to avoid hiding */}
            <Area
              dataKey="lando"
              type="monotone"
              fill="url(#fillLando)"
              fillOpacity={0.5}
              stroke="var(--color-lando)"
              strokeWidth={3}
            />
            <Area
              dataKey="max"
              type="monotone"
              fill="url(#fillMax)"
              fillOpacity={0.5}
              stroke="var(--color-max)"
              strokeWidth={3}
            />
            <Area
              dataKey="oscar"
              type="monotone"
              fill="url(#fillOscar)"
              fillOpacity={0.5}
              stroke="var(--color-oscar)"
              strokeWidth={3}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
