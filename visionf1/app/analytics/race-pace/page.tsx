"use client"

import * as React from "react"
import { useMemo, useState, useEffect } from "react";
import { GenericComboBox } from "@/components/ui/combobox";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis, TooltipProps } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartLegend, ChartLegendContent } from "@/components/ui/chart"

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { CldImage } from 'next-cloudinary'

import { getSeasons, getSummaryEvents, getRacePace } from "@/lib/api-requests";

type RacePaceRow = {
  driver: string;
  driver_first_name: string;
  driver_last_name: string;
  driver_position: number;
  driver_color: string;
  team: string;
  team_name: string;
  team_color: string;
  race_pace_id: string;
  race_pace_position: number;
  avg_laptime: number;
  std_laptime: number;
  event: string;
  season: number;
  round: number;
};

type Season = number;

type EventSummary = {
  event_id: string;
  season: number;
  round: number;
  event_name: string;
  event_date: string;
  event_status: string;
};

function formatLapTime(sec: number) {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  const millis = Math.round((sec - minutes * 60 - seconds) * 1000);
  const secStr = seconds.toString().padStart(2, "0");
  const millisStr = millis.toString().padStart(3, "0");
  return `${minutes}:${secStr}.${millisStr}`;
}

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;
  const entry = payload[0];
  const data = entry.payload as RacePaceRow;
  const driverName = `${data.driver_first_name} ${data.driver_last_name}`;
  const teamName = data.team_name;
  const lapTime = formatLapTime(data.avg_laptime);
  const color = data.driver_color;

  return (
    <div className="rounded-md border bg-popover px-3 py-2 text-popover-foreground shadow-sm text-xs">
      <div className="font-semibold mb-1">{driverName}</div>
      <div className="mb-1">{teamName}</div>
      <div className="flex items-center gap-2">
        <span className="block w-2 h-2 rounded-full" style={{ background: color }} />
        <span className="text-muted-foreground">Average Lap Time:</span>
        <span className="font-mono">{lapTime}</span>
      </div>
    </div>
  );
}

const columns: ColumnDef<RacePaceRow>[] = [
  {
    accessorKey: "race_pace_position",
    header: "Race Pace Position",
  },
  {
    accessorKey: "driver",
    header: "Driver",
    cell: ({ row }) => {
      const race_pace_row = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden">
            <CldImage
              src={race_pace_row.driver}
              width={32}
              height={32}
              alt={race_pace_row.driver_first_name + ' ' + race_pace_row.driver_last_name}
              crop="fill"
              className="object-cover"
            />
          </div>
          <div>
            <div className="font-medium">{race_pace_row.driver_first_name + ' ' + race_pace_row.driver_last_name}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "team_name",
    header: "Team",
    cell: ({ row }) => {
      const race_pace_row = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 flex items-center justify-center rounded-full">
            <CldImage
              src={race_pace_row.team_name.toLowerCase()}
              width={24}
              height={24}
              alt={race_pace_row.team}
              className="object-contain w-full h-full"
            />
          </div>
          <span>{race_pace_row.team_name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "avg_laptime",
    header: "Avg Lap Time",
    cell: ({ row }) => formatLapTime(row.original.avg_laptime),
  },
  {
    accessorKey: "std_laptime",
    header: "Std Dev (s)",
    cell: ({ row }) => row.original.std_laptime?.toFixed(3) || 'N/A',
  },
  {
    accessorKey: "driver_position",
    header: "Final Race Position",
  },
];

const chartConfig = {
  avg_laptime: {
    label: "Average Lap Time",
  },
  race_pace: {
    label: "Race Pace"
  }
} satisfies ChartConfig

export default function RacePace() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [racePaceData, setRacePaceData] = useState<RacePaceRow[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedGP, setSelectedGP] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load seasons on component mount
  useEffect(() => {
    const loadSeasons = async () => {
      try {
        const seasonsResponse = await getSeasons();
        setSeasons(seasonsResponse.data);
      } catch (error) {
        console.error("Error loading seasons:", error);
      }
    };

    loadSeasons();
  }, []);

  // Load events when a year is selected
  useEffect(() => {
    const loadEvents = async () => {
      if (!selectedYear) return;
      
      try {
        const eventsResponse = await getSummaryEvents(Number(selectedYear));
        setEvents(eventsResponse.data);
        setSelectedGP(null); // Reset selected GP
        setRacePaceData([]); // Clear previous data
      } catch (error) {
        console.error("Error loading events:", error);
        setEvents([]);
      }
    };

    loadEvents();
  }, [selectedYear]);

  // Load race pace data when a GP is selected
  useEffect(() => {
    const loadRacePace = async () => {
      if (!selectedGP) return;
      
      try {
        setLoading(true);
        const [season, round] = selectedGP.split('_').map(Number);
        const racePaceResponse = await getRacePace(season, round);
        setRacePaceData(racePaceResponse.data.sort((a: RacePaceRow, b: RacePaceRow) => a.avg_laptime - b.avg_laptime));
      } catch (error) {
        console.error("Error loading race pace data:", error);
        setRacePaceData([]);
      } finally {
        setLoading(false);
      }
    };

    loadRacePace();
  }, [selectedGP]);

  const years = useMemo(() => 
    seasons.map(season => String(season)).sort((a, b) => Number(b) - Number(a)), 
    [seasons]
  );

  const gps = useMemo(() => 
    events.map(event => ({
      id: `${event.season}_${event.round}`,
      label: event.event_name,
      season: event.season,
      round: event.round
    })), 
    [events]
  );

  const currentEvent = events.find(event => 
    `${event.season}_${event.round}` === selectedGP
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
      <div className="bg-muted/50 min-h-min flex-1 rounded-xl md:min-h-min p-4">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[700px]">
            <h2 className="text-lg font-semibold pb-4">
              {currentEvent ? `Race Pace by Driver - ${currentEvent.season} ${currentEvent.event_name}` : "Race Pace by Driver"}
            </h2>
            
            <div className="flex gap-4 mb-0">
              <GenericComboBox
                items={years}
                value={selectedYear}
                onChange={setSelectedYear}
                getLabel={(y) => String(y)}
                getValue={(y) => String(y)}
                placeholder="Select Year"
                search_label="Year"
                width="w-[160px]"
              />
              
              <GenericComboBox
                items={gps}
                value={selectedGP}
                onChange={setSelectedGP}
                getLabel={(g) => `R${g.round} • ${g.label}`}
                getValue={(g) => g.id}
                placeholder="Select Grand Prix"
                search_label="Grand Prix"
                width="w-[340px]"
              />
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-lg">Loading race pace data...</div>
              </div>
            ) : racePaceData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-full w-full max-h-[76vh] pt-4">
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
                    domain={['dataMin - 0.1', 'dataMax + 0.1']} 
                    tickFormatter={formatLapTime}
                  />
                  <ChartTooltip content={<CustomTooltip />} />
                  <ChartLegend className="pb-0" content={<ChartLegendContent />} />
                  <Bar dataKey="avg_laptime" fill="var(--color-avg_laptime)" radius={4}>
                    {racePaceData.map((entry) => (
                      <Cell key={entry.driver} fill={entry.driver_color || "#2563eb"} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : selectedGP ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-lg">No race pace data available for this event.</div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-64">
                <div className="text-lg">Please select a Grand Prix to view race pace data.</div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {racePaceData.length > 0 && (
        <div className="bg-muted/50 min-h-min flex-1 rounded-xl md:min-h-min">
          <div className="p-4 flex flex-col">
            <h2 className="text-lg font-semibold pb-4">Race Pace Detail</h2>
            <DataTable columns={columns} data={racePaceData} />
          </div>
        </div>
      )}
    </div>
  )
}
