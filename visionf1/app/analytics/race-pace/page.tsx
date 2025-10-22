"use client"

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";

const racePaceData = [{'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'PIA', 'driver_first_name': 'Oscar', 'driver_last_name': 'Piastri', 'driver_position': 1.0, 'driver_color': '#ff8000', 'avg_laptime': 74.48166, 'std_laptime': 0.98182, 'race_pace_id': '2025_15_PIA', 'race_pace_position': 1}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'NOR', 'driver_first_name': 'Lando', 'driver_last_name': 'Norris', 'driver_position': 18.0, 'driver_color': '#ff8000', 'avg_laptime': 74.665288, 'std_laptime': 0.920907, 'race_pace_id': '2025_15_NOR', 'race_pace_position': 2}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'VER', 'driver_first_name': 'Max', 'driver_last_name': 'Verstappen', 'driver_position': 2.0, 'driver_color': '#0600ef', 'avg_laptime': 75.104875, 'std_laptime': 1.047516, 'race_pace_id': '2025_15_VER', 'race_pace_position': 3}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'HAD', 'driver_first_name': 'Isack', 'driver_last_name': 'Hadjar', 'driver_position': 3.0, 'driver_color': '#fcd700', 'avg_laptime': 75.201928, 'std_laptime': 0.968081, 'race_pace_id': '2025_15_HAD', 'race_pace_position': 4}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'RUS', 'driver_first_name': 'George', 'driver_last_name': 'Russell', 'driver_position': 4.0, 'driver_color': '#27f4d2', 'avg_laptime': 75.55991, 'std_laptime': 0.893123, 'race_pace_id': '2025_15_RUS', 'race_pace_position': 5}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'ANT', 'driver_first_name': 'Kimi', 'driver_last_name': 'Antonelli', 'driver_position': 16.0, 'driver_color': '#27f4d2', 'avg_laptime': 75.635259, 'std_laptime': 1.167985, 'race_pace_id': '2025_15_ANT', 'race_pace_position': 6}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'LEC', 'driver_first_name': 'Charles', 'driver_last_name': 'Leclerc', 'driver_position': 19.0, 'driver_color': '#e80020', 'avg_laptime': 75.645255, 'std_laptime': 0.649396, 'race_pace_id': '2025_15_LEC', 'race_pace_position': 7}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'ALB', 'driver_first_name': 'Alexander', 'driver_last_name': 'Albon', 'driver_position': 5.0, 'driver_color': '#00a0dd', 'avg_laptime': 75.758285, 'std_laptime': 0.992501, 'race_pace_id': '2025_15_ALB', 'race_pace_position': 8}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'SAI', 'driver_first_name': 'Carlos', 'driver_last_name': 'Sainz', 'driver_position': 13.0, 'driver_color': '#00a0dd', 'avg_laptime': 75.917153, 'std_laptime': 0.880626, 'race_pace_id': '2025_15_SAI', 'race_pace_position': 9}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'LAW', 'driver_first_name': 'Liam', 'driver_last_name': 'Lawson', 'driver_position': 12.0, 'driver_color': '#fcd700', 'avg_laptime': 75.94266, 'std_laptime': 0.919475, 'race_pace_id': '2025_15_LAW', 'race_pace_position': 10}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'ALO', 'driver_first_name': 'Fernando', 'driver_last_name': 'Alonso', 'driver_position': 8.0, 'driver_color': '#00665f', 'avg_laptime': 76.107673, 'std_laptime': 0.979049, 'race_pace_id': '2025_15_ALO', 'race_pace_position': 11}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'STR', 'driver_first_name': 'Lance', 'driver_last_name': 'Stroll', 'driver_position': 7.0, 'driver_color': '#00665f', 'avg_laptime': 76.148584, 'std_laptime': 0.838618, 'race_pace_id': '2025_15_STR', 'race_pace_position': 12}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'HAM', 'driver_first_name': 'Lewis', 'driver_last_name': 'Hamilton', 'driver_position': 20.0, 'driver_color': '#e80020', 'avg_laptime': 76.306714, 'std_laptime': 0.30864, 'race_pace_id': '2025_15_HAM', 'race_pace_position': 13}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'TSU', 'driver_first_name': 'Yuki', 'driver_last_name': 'Tsunoda', 'driver_position': 9.0, 'driver_color': '#0600ef', 'avg_laptime': 76.378259, 'std_laptime': 0.70597, 'race_pace_id': '2025_15_TSU', 'race_pace_position': 14}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'BEA', 'driver_first_name': 'Oliver', 'driver_last_name': 'Bearman', 'driver_position': 6.0, 'driver_color': '#b6babd', 'avg_laptime': 76.4475, 'std_laptime': 0.948318, 'race_pace_id': '2025_15_BEA', 'race_pace_position': 15}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'COL', 'driver_first_name': 'Franco', 'driver_last_name': 'Colapinto', 'driver_position': 11.0, 'driver_color': '#ff87bc', 'avg_laptime': 76.469074, 'std_laptime': 0.926462, 'race_pace_id': '2025_15_COL', 'race_pace_position': 16}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'HUL', 'driver_first_name': 'Nico', 'driver_last_name': 'Hulkenberg', 'driver_position': 14.0, 'driver_color': '#00e700', 'avg_laptime': 76.598415, 'std_laptime': 0.871526, 'race_pace_id': '2025_15_HUL', 'race_pace_position': 17}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'OCO', 'driver_first_name': 'Esteban', 'driver_last_name': 'Ocon', 'driver_position': 10.0, 'driver_color': '#b6babd', 'avg_laptime': 76.607327, 'std_laptime': 0.872183, 'race_pace_id': '2025_15_OCO', 'race_pace_position': 18}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'GAS', 'driver_first_name': 'Pierre', 'driver_last_name': 'Gasly', 'driver_position': 17.0, 'driver_color': '#ff87bc', 'avg_laptime': 76.733535, 'std_laptime': 0.658684, 'race_pace_id': '2025_15_GAS', 'race_pace_position': 19}, {'season': 2025, 'round': 15, 'event': 'Dutch Grand Prix', 'driver': 'BOR', 'driver_first_name': 'Gabriel', 'driver_last_name': 'Bortoleto', 'driver_position': 15.0, 'driver_color': '#00e700', 'avg_laptime': 76.759735, 'std_laptime': 0.848896, 'race_pace_id': '2025_15_BOR', 'race_pace_position': 20}];

type RacePaceRow = {
  driver: string;
  driver_first_name: string;
  driver_last_name: string;
  driver_position: number;
  race_pace_position: number;
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
    accessorKey: "race_pace_position",
    header: "Race Pace Position",
  },
  {
    accessorKey: "driver",
    header: "Driver",
    cell: ({ row }) => <span className="font-medium">{row.original.driver_first_name + ' ' + row.original.driver_last_name}</span>,
  },
  {
    accessorKey: "avg_laptime",
    header: "Avg Lap Time",
    cell: ({ row }) => formatLapTime(row.original.avg_laptime),
  },
  {
    accessorKey: "std_laptime",
    header: "Std Dev (s)",
    cell: ({ row }) => row.original.std_laptime.toFixed(3),
  },
  {
    accessorKey: "driver_position",
    header: "Final Race Position",
  },
];

const chartConfig = {
  avg_laptime: {
    label: "Average Lap Time",
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
                <Cell key={entry.driver} fill={entry.driver_color || "#2563eb"} />
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
