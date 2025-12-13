"use client"

import { useMemo, useState, useEffect } from "react"
import { useDriverNavigation } from "@/hooks/use-driver-navigation"
import { GenericComboBox } from "@/components/ui/combobox"
import { Spinner } from "@/components/ui/spinner"

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis, TooltipProps } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartLegend, ChartLegendContent } from "@/components/ui/chart"

import { Download } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { CldImage } from 'next-cloudinary'
import Image from "next/image"

import { getSeasons, getSummaryEvents, getCleanAirRacePace } from "@/lib/api-requests"
import { Season, EventSummary, CleanAirRacePaceRow } from "@/lib/types"
import { exportDataAsCSV } from "@/lib/csv-utils"

function formatLapTime(sec: number) {
  if (!sec) return "N/A";
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
  const data = entry.payload as CleanAirRacePaceRow;
  const driverName = `${data.driver_first_name} ${data.driver_last_name}`;
  const teamName = data.team_name;
  const lapTime = formatLapTime(data.avg_laptime_clean_air);
  const color = data.driver_color;

  return (
    <div className="rounded-md border bg-popover px-3 py-2 text-popover-foreground shadow-sm text-xs">
      <div className="font-semibold mb-1">{driverName}</div>
      <div className="mb-1">{teamName}</div>
      <div className="flex items-center gap-2">
        <span className="block w-2 h-2 rounded-full" style={{ background: color }} />
        <span className="text-muted-foreground">Avg Lap Time (Clean Air):</span>
        <span className="font-mono">{lapTime}</span>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-muted-foreground">Laps:</span>
        <span className="font-mono">{data.clean_air_laps_count}</span>
      </div>
    </div>
  );
}

// Exports Clean Air Race Pace data as CSV with proper formatting
export function exportCleanAirRacePaceAsCSV(data: CleanAirRacePaceRow[], filename: string): Promise<void> {
  const headers = [
    { key: 'clean_air_race_pace_position', label: 'Position' },
    { key: 'driver_name', label: 'Driver' },
    { key: 'team_name', label: 'Team' },
    { key: 'avg_laptime_clean_air', label: 'Avg Lap Time (Clean Air)' },
    { key: 'std_laptime_clean_air', label: 'Std Dev (s)' },
    { key: 'clean_air_laps_count', label: 'Laps Count' },
    { key: 'driver_position', label: 'Final Race Position' },
  ];

  const fieldTransformers = {
    driver_name: (value: any, row: CleanAirRacePaceRow) =>
      `${row.driver_first_name} ${row.driver_last_name}`,
    avg_laptime_clean_air: (value: number) => formatLapTime(value),
    std_laptime_clean_air: (value: number) => value?.toFixed(3) || 'N/A',
  };

  // Add calculated field for driver name
  const dataWithDriverName = data.map(row => ({
    ...row,
    driver_name: `${row.driver_first_name} ${row.driver_last_name}`
  }));

  return exportDataAsCSV(dataWithDriverName, filename, headers, fieldTransformers, true);
}

const getColumns = (handleDriverClick: (driverName: string) => void): ColumnDef<CleanAirRacePaceRow>[] => [
  {
    accessorKey: "clean_air_race_pace_position",
    header: "Pos",
  },
  {
    accessorKey: "driver",
    header: "Driver",
    cell: ({ row }) => {
      const race_pace_row = row.original;
      const driverName = race_pace_row.driver_first_name + ' ' + race_pace_row.driver_last_name;
      return (
        <button
          onClick={() => handleDriverClick(driverName)}
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden">
            <CldImage
              src={race_pace_row.driver}
              width={32}
              height={32}
              alt={driverName}
              crop="fill"
              className="object-cover"
            />
          </div>
          <div>
            <div className="font-medium">{driverName}</div>
          </div>
        </button>
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
    accessorKey: "avg_laptime_clean_air",
    header: "Avg Lap Time (Clean Air)",
    cell: ({ row }) => formatLapTime(row.original.avg_laptime_clean_air),
  },
  {
    accessorKey: "clean_air_laps_count",
    header: "Laps",
    cell: ({ row }) => row.original.clean_air_laps_count,
  },
  {
    accessorKey: "std_laptime_clean_air",
    header: "Std Dev (s)",
    cell: ({ row }) => row.original.std_laptime_clean_air?.toFixed(3) || 'N/A',
  },
  {
    accessorKey: "driver_position",
    header: "Final Pos",
  },
];

const chartConfig = {
  avg_laptime_clean_air: {
    label: "Average Lap Time (Clean Air)",
  },
} satisfies ChartConfig

export default function CleanAirRacePace() {

  const { navigateToDriver } = useDriverNavigation()

  const handleDriverClick = (driverName: string) => {
    navigateToDriver(driverName);
  }

  const columns = getColumns(handleDriverClick);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [racePaceData, setRacePaceData] = useState<CleanAirRacePaceRow[]>([]);
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
        const racePaceResponse = await getCleanAirRacePace(season, round);
        const validData = racePaceResponse.data.filter((d: CleanAirRacePaceRow) => d.avg_laptime_clean_air != null && d.avg_laptime_clean_air > 0);
        setRacePaceData(validData.sort((a: CleanAirRacePaceRow, b: CleanAirRacePaceRow) => a.avg_laptime_clean_air - b.avg_laptime_clean_air));
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

  const handleExportCSV = async () => {
    if (racePaceData.length === 0) return;

    const filename = `clean_air_race_pace_${selectedYear}_${currentEvent?.round || 'data'}_${currentEvent?.event_name || 'data'}.csv`.replace(/\s+/g, '_');
    await exportCleanAirRacePaceAsCSV(racePaceData, filename);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
      <div className="bg-popover min-h-min flex-1 rounded-xl md:min-h-min p-4">
        <div className="w-full overflow-x-auto">
          <h2 className="text-lg font-semibold pb-4">
            {currentEvent ? `Clean Air Race Pace - ${currentEvent.season} ${currentEvent.event_name}` : "Clean Air Race Pace by Driver"}
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 mb-0">
            <GenericComboBox
              items={years}
              value={selectedYear}
              onChange={setSelectedYear}
              getLabel={(y) => String(y)}
              getValue={(y) => String(y)}
              placeholder="Select Year"
              search_label="Year"
              width="w-[320px]"
            />

            <GenericComboBox
              items={gps}
              value={selectedGP}
              onChange={setSelectedGP}
              getLabel={(g) => `R${g.round} • ${g.label}`}
              getValue={(g) => g.id}
              placeholder="Select Grand Prix"
              search_label="Grand Prix"
              width="w-[320px]"
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner className="size-6 mr-2" />
              <div className="text-lg">Loading clean air race pace data...</div>
            </div>
          ) : racePaceData.length > 0 ? (
            <div className="w-full overflow-x-auto">
              <div className="min-w-[700px]">
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
                    <Bar dataKey="avg_laptime_clean_air" fill="var(--color-avg_laptime_clean_air)" radius={4}>
                      {racePaceData.map((entry) => (
                        <Cell key={entry.driver} fill={entry.driver_color || "#2563eb"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </div>
            </div>
          ) : selectedGP ? (
            <div className="flex flex-col justify-center items-center text-center h-80 gap-10">
              <div className="text-lg">No clean air race pace data available for this event.</div>
              <div className="flex-shrink-0 pb-2 px-2">
                <div className="h-20 w-20 @2xs:h-24 @2xs:w-24 @xs:h-28 @xs:w-28 @sm:h-36 @sm:w-36 @md:h-42 @md:w-42 @lg:h-46 @lg:w-46 @xl:h-56 @xl:w-56 bg-sidebar-primary border-2 border-brand flex items-center justify-center rounded-full overflow-hidden shadow-lg">
                  <Image
                    src="/visionf1-logo.svg"
                    alt="VisionF1"
                    width={200}
                    height={200}
                    className="object-contain h-full w-full p-1"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center text-center h-80 gap-10">
              <div className="text-lg">Please select a Grand Prix to view clean air race pace data.</div>
              <div className="flex-shrink-0 pb-2 px-2">
                <div className="h-20 w-20 @2xs:h-24 @2xs:w-24 @xs:h-28 @xs:w-28 @sm:h-36 @sm:w-36 @md:h-42 @md:w-42 @lg:h-46 @lg:w-46 @xl:h-56 @xl:w-56 bg-sidebar-primary border-2 border-brand flex items-center justify-center rounded-full overflow-hidden shadow-lg">
                  <Image
                    src="/visionf1-logo.svg"
                    alt="VisionF1"
                    width={200}
                    height={200}
                    className="object-contain h-full w-full p-1"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {racePaceData.length > 0 && (
        <div className="bg-popover min-h-min flex-1 rounded-xl md:min-h-min">
          <div className="p-4 flex flex-col">
            <div className="flex justify-between items-center pb-4">
              <h2 className="text-lg font-semibold">Race Pace Detail</h2>
              <button
                onClick={handleExportCSV}
                className="flex items-center px-4 py-2 bg-brand text-sm text-black rounded-md hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </button>
            </div>
            <DataTable columns={columns} data={racePaceData} />
          </div>
        </div>
      )}
    </div>
  )
}
