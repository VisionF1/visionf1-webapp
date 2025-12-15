"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  getSeasons,
  getEvents,
  getLapTimeDistributions,
} from "@/lib/api-requests";
import { LapTimeDistributionRow, Race } from "@/lib/types";
import { GenericComboBox } from "@/components/ui/combobox";
import { Spinner } from "@/components/ui/spinner";
import ViolinSwarmPlot from "@/components/charts/violin-swarm-plot";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { CldImage } from 'next-cloudinary';
import { Download } from "lucide-react";
import { useDriverNavigation } from "@/hooks/use-driver-navigation";
import { exportDataAsCSV } from "@/lib/csv-utils";

function formatLapTime(sec: number | null) {
  if (sec === null || sec === undefined) return 'N/A';
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  const millis = Math.round((sec - minutes * 60 - seconds) * 1000);
  const secStr = seconds.toString().padStart(2, "0");
  const millisStr = millis.toString().padStart(3, "0");
  return `${minutes}:${secStr}.${millisStr}`;
}

// Export function for Lap Time Distributions
function exportLapTimeDistributionsAsCSV(data: LapTimeDistributionRow[], filename: string): Promise<void> {
  const headers = [
    { key: 'race_pace_position', label: 'Race Pace Position' },
    { key: 'driver_name', label: 'Driver' },
    { key: 'team_name', label: 'Team' },
    { key: 'avg_laptime', label: 'Avg Lap Time' },
    { key: 'std_laptime', label: 'Std Dev (s)' },
    { key: 'laps_count', label: 'Total Laps' },
    { key: 'fastest_lap', label: 'Fastest Lap' },
    { key: 'slowest_lap', label: 'Slowest Lap' },
    { key: 'driver_position', label: 'Final Race Position' },
  ];

  const fieldTransformers = {
    driver_name: (value: unknown, row: LapTimeDistributionRow) =>
      `${row.driver_first_name} ${row.driver_last_name}`,
    avg_laptime: (value: number | null) => value ? formatLapTime(value) : 'N/A',
    std_laptime: (value: number | null) => value?.toFixed(3) || 'N/A',
    fastest_lap: (value: number | null) => value ? formatLapTime(value) : 'N/A',
    slowest_lap: (value: number | null) => value ? formatLapTime(value) : 'N/A',
  };

  const dataWithCalculatedFields = data.map(row => {
    const lapTimes = row.laps.map(l => l.lap_time);
    return {
      ...row,
      driver_name: `${row.driver_first_name} ${row.driver_last_name}`,
      laps_count: row.laps.length,
      fastest_lap: lapTimes.length > 0 ? Math.min(...lapTimes) : null,
      slowest_lap: lapTimes.length > 0 ? Math.max(...lapTimes) : null,
    };
  });

  return exportDataAsCSV(dataWithCalculatedFields, filename, headers, fieldTransformers, true);
}

// Column definitions for the table
const getColumns = (handleDriverClick: (driverName: string) => void): ColumnDef<LapTimeDistributionRow>[] => [
  {
    accessorKey: "race_pace_position",
    header: "Race Pace Position",
  },
  {
    accessorKey: "driver",
    header: "Driver",
    cell: ({ row }) => {
      const data = row.original;
      const driverName = data.driver_first_name + ' ' + data.driver_last_name;
      return (
        <button
          onClick={() => handleDriverClick(driverName)}
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden">
            <CldImage
              src={data.driver}
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
      const data = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 flex items-center justify-center rounded-full">
            <CldImage
              src={data.team_name?.toLowerCase() || 'unknown'}
              width={24}
              height={24}
              alt={data.team || 'Unknown'}
              className="object-contain w-full h-full"
            />
          </div>
          <span>{data.team_name || 'N/A'}</span>
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
    id: "laps_count",
    header: "Total Laps",
    cell: ({ row }) => row.original.laps.length,
  },
  {
    id: "fastest_lap",
    header: "Fastest Lap",
    cell: ({ row }) => {
      const lapTimes = row.original.laps.map(l => l.lap_time);
      return lapTimes.length > 0 ? formatLapTime(Math.min(...lapTimes)) : 'N/A';
    },
  },
  {
    id: "slowest_lap",
    header: "Slowest Lap",
    cell: ({ row }) => {
      const lapTimes = row.original.laps.map(l => l.lap_time);
      return lapTimes.length > 0 ? formatLapTime(Math.max(...lapTimes)) : 'N/A';
    },
  },
  {
    accessorKey: "driver_position",
    header: "Final Race Position",
  },
];

export default function LapTimeDistributionsPage() {
  const { navigateToDriver } = useDriverNavigation();

  const handleDriverClick = (driverName: string) => {
    navigateToDriver(driverName);
  };

  const columns = getColumns(handleDriverClick);

  const [seasons, setSeasons] = useState<number[]>([]);
  const [events, setEvents] = useState<Race[]>([]);
  const [data, setData] = useState<LapTimeDistributionRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  const [selectedRound, setSelectedRound] = useState<string | null>(null);

  // Fetch Seasons
  useEffect(() => {
    getSeasons().then((res) => {
      setSeasons(res.data);
    });
  }, []);

  // Fetch Events when Season changes
  useEffect(() => {
    if (selectedSeason) {
      getEvents(parseInt(selectedSeason)).then((res) => {
        setEvents(res.data);
        setSelectedRound(null); // Reset round when season changes
      });
    } else {
      setEvents([]);
    }
  }, [selectedSeason]);

  // Fetch Distribution Data
  useEffect(() => {
    if (selectedSeason && selectedRound) {
      setLoading(true);
      getLapTimeDistributions(parseInt(selectedSeason), parseInt(selectedRound))
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setData([]);
    }
  }, [selectedSeason, selectedRound]);

  const yearItems = useMemo(() => seasons.map(s => String(s)).sort((a, b) => Number(b) - Number(a)), [seasons]);

  const currentEvent = events.find(e => e.round.toString() === selectedRound);

  const handleExportCSV = async () => {
    if (data.length === 0) return;
    const filename = `lap_time_distributions_${selectedSeason}_${currentEvent?.round || 'data'}_${currentEvent?.event_name || 'data'}.csv`.replace(/\s+/g, '_');
    await exportLapTimeDistributionsAsCSV(data, filename);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
      <div className="bg-popover min-h-min flex-1 rounded-xl md:min-h-min p-4">
        <div className="w-full overflow-x-auto">
          <h2 className="text-lg font-semibold pb-4">
            {currentEvent ? `Lap Time Distributions - ${currentEvent.season} ${currentEvent.event_name}` : "Lap Time Distributions"}
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 mb-0">
            <GenericComboBox
              items={yearItems}
              value={selectedSeason}
              onChange={setSelectedSeason}
              getLabel={(y) => y}
              getValue={(y) => y}
              placeholder="Select Year"
              search_label="Year"
              width="w-[320px]"
            />

            <GenericComboBox
              items={events}
              value={selectedRound}
              onChange={setSelectedRound}
              getLabel={(e) => `R${e.round} • ${e.event_name}`}
              getValue={(e) => e.round.toString()}
              placeholder="Select Grand Prix"
              search_label="Grand Prix"
              width="w-[320px]"
            />
          </div>

          <div className="mt-4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Spinner className="size-6 mr-2" />
                <div className="text-lg">Loading distribution data...</div>
              </div>
            ) : data.length > 0 ? (
              <ViolinSwarmPlot data={data} />
            ) : (
              <div className="flex flex-col justify-center items-center text-center h-80 gap-10">
                <div className="text-lg">
                  {selectedRound
                    ? "No lap time data available for this event."
                    : "Please select a Grand Prix to view lap time distributions."}
                </div>
                <div className="flex-shrink-0 pb-2 px-2">
                  <div className="h-20 w-20 @2xs:h-24 @2xs:w-24 @xs:h-28 @xs:w-28 @sm:h-36 @sm:w-36 @md:h-42 @md:w-42 @lg:h-46 @lg:w-46 @xl:h-56 @xl:w-56 bg-sidebar-primary border-2 border-brand flex items-center justify-center rounded-full overflow-hidden shadow-lg">
                    <Image
                      src="/visionf1-logo.svg"
                      alt="VisionF1"
                      width={200}
                      height={200}
                      className="object-contain h-full w-full p-1"
                      loading="eager"
                      priority
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {data.length > 0 && (
        <div className="bg-popover min-h-min flex-1 rounded-xl md:min-h-min overflow-hidden">
          <div className="p-4 flex flex-col">
            <div className="flex justify-between items-center pb-4">
              <h2 className="text-lg font-semibold">Lap Time Distributions Detail</h2>
              <button
                onClick={handleExportCSV}
                className="flex items-center px-4 py-2 bg-brand text-sm text-black rounded-md hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </button>
            </div>
            <div className="w-0 min-w-full overflow-x-auto">
              <DataTable columns={columns} data={[...data].sort((a, b) => (a.race_pace_position || 99) - (b.race_pace_position || 99))} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
