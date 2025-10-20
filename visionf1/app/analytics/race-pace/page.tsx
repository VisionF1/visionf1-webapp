"use client"

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";

const racePaceData = [{'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'PIA', 'avg_laptime': 74.48166, 'std_laptime': 0.98182, 'race_pace_id': '2025_15_PIA'}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'NOR', 'avg_laptime': 74.665288, 'std_laptime': 0.920907, 'race_pace_id': '2025_15_NOR'}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'VER', 'avg_laptime': 75.104875, 'std_laptime': 1.047516, 'race_pace_id': '2025_15_VER'}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'HAD', 'avg_laptime': 75.201928, 'std_laptime': 0.968081, 'race_pace_id': '2025_15_HAD'}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'RUS', 'avg_laptime': 75.55991, 'std_laptime': 0.893123, 'race_pace_id': '2025_15_RUS'}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'ANT', 'avg_laptime': 75.635259, 'std_laptime': 1.167985, 'race_pace_id': '2025_15_ANT'}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'LEC', 'avg_laptime': 75.645255, 'std_laptime': 0.649396, 'race_pace_id': '2025_15_LEC'}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'ALB', 'avg_laptime': 75.758285, 'std_laptime': 0.992501, 'race_pace_id': '2025_15_ALB'}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'SAI', 'avg_laptime': 75.917153, 'std_laptime': 0.880626, 'race_pace_id': '2025_15_SAI'}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'LAW', 'avg_laptime': 75.94266, 'std_laptime': 0.919475, 'race_pace_id': '2025_15_LAW'}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'ALO', 'avg_laptime': 76.107673, 'std_laptime': 0.979049, 'race_pace_id': '2025_15_ALO'}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'STR', 'avg_laptime': 76.148584, 'std_laptime': 0.838618, 'race_pace_id': '2025_15_STR'}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'HAM', 'avg_laptime': 76.306714, 'std_laptime': 0.30864, 'race_pace_id': '2025_15_HAM'}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'TSU', 'avg_laptime': 76.378259, 'std_laptime': 0.70597, 'race_pace_id': '2025_15_TSU'}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'BEA', 'avg_laptime': 76.4475, 'std_laptime': 0.948318, 'race_pace_id': '2025_15_BEA'}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'COL', 'avg_laptime': 76.469074, 'std_laptime': 0.926462, 'race_pace_id': '2025_15_COL'}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'HUL', 'avg_laptime': 76.598415, 'std_laptime': 0.871526, 'race_pace_id': '2025_15_HUL'}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'OCO', 'avg_laptime': 76.607327, 'std_laptime': 0.872183, 'race_pace_id': '2025_15_OCO'}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'GAS', 'avg_laptime': 76.733535, 'std_laptime': 0.658684, 'race_pace_id': '2025_15_GAS'}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'BOR', 'avg_laptime': 76.759735, 'std_laptime': 0.848896, 'race_pace_id': '2025_15_BOR'}]

const driverColors: Record<string, string> =  {
  'VER': '#0600ef',
  'TSU': '#0600ef',
  'GAS': '#ff87bc',
  'COL': '#ff87bc',
  'ANT': '#27f4d2',
  'RUS': '#27f4d2',
  'ALO': '#00665f',
  'STR': '#00665f',
  'LEC': '#e80020',
  'HAM': '#e80020',
  'ALB': '#00a0dd',
  'SAI': '#00a0dd',
  'HUL': '#00e700',
  'BOR': '#00e700',
  'LAW': '#fcd700',
  'HAD': '#fcd700',
  'OCO': '#b6babd',
  'BEA': '#b6babd',
  'NOR': '#ff8000',
  'PIA': '#ff8000',
}

type RacePaceRow = {
  driver: string;
  avg_laptime: number;
  std_laptime: number;
  event: string;
  season: number;
  round: number;
};

function formatLapTime(sec: number) {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  const millis = Math.round((sec - minutes * 60 - seconds) * 1000);
  const secStr = seconds.toString().padStart(2, "0");
  const millisStr = millis.toString().padStart(3, "0");
  return `${minutes}:${secStr}.${millisStr}`;
}

const columns: ColumnDef<RacePaceRow>[] = [
  {
    accessorKey: "position",
    header: "Position",
  },
  {
    accessorKey: "driver",
    header: "Driver",
    cell: ({ row }) => <span className="font-medium">{row.original.driver}</span>,
  },
  {
    accessorKey: "avg_laptime",
    header: "Avg Lap Time (s)",
    cell: ({ row }) => formatLapTime(row.original.avg_laptime),
  },
  {
    accessorKey: "std_laptime",
    header: "Std Dev (s)",
    cell: ({ row }) => row.original.std_laptime.toFixed(3),
  },
];

const chartConfig = {
  avg_laptime: {
    label: "Average Lap Time (s)",
    color: "#2563eb",
  },
  race_pace: {
    label: "Race Pace"
  }
} satisfies ChartConfig

export default function RacePace() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
      <div className="bg-muted/50 aspect-video min-h-min flex-1 rounded-xl md:min-h-min p-4">
        <h2 className="text-lg font-semibold pb-4">2025 Dutch Grand Prix - Race Pace by Driver</h2>
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart accessibilityLayer data={racePaceData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="driver"
              tickLine={true}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              domain={['dataMin - 0.2', 'dataMax + 0.2']} 
              tickFormatter={formatLapTime}
            />
            <ChartTooltip content={<ChartTooltipContent labelKey="race_pace" nameKey="avg_laptime" />} />
            <ChartLegend className="pb-10" content={<ChartLegendContent />} />
            <Bar dataKey="avg_laptime" fill="var(--color-avg_laptime)" radius={4}>
              {racePaceData.map((entry, _idx) => (
                <Cell key={entry.driver} fill={driverColors[entry.driver] || "#2563eb"} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
      <div className="bg-muted/50 aspect-video min-h-min flex-1 rounded-xl md:min-h-min">
        <div className="p-4 flex flex-col">
          <h2 className="text-lg font-semibold pb-4">Race Pace Detail</h2>
          <DataTable columns={columns} data={racePaceData} />
        </div>
      </div>
    </div>
    
  )
}
