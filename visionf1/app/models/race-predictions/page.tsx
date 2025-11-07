"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { CldImage } from "next-cloudinary";
import Image from "next/image";

import { predictRace, getDrivers, getEvents } from "@/lib/api-requests";
import { RacePrediction, RacePredictionRow, Driver } from "@/lib/types";


const session_air_temp = 26;
const session_track_temp = 35;
const session_humidity = 60;
const session_rainfall = 0;
const circuit_type = "street";

const columns: ColumnDef<RacePredictionRow>[] = [
  {
    accessorKey: "rank",
    header: "Position",
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
              src={race_pace_row.driverCode}
              width={32}
              height={32}
              alt={race_pace_row.driverFirstName + ' ' + race_pace_row.driverLastName}
              crop="fill"
              className="object-cover"
            />
          </div>
          <div>
            <div className="font-medium">{race_pace_row.driverFirstName + ' ' + race_pace_row.driverLastName}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "teamName",
    header: "Team",
    cell: ({ row }) => {
      const race_pace_row = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 flex items-center justify-center rounded-full">
            <CldImage
              src={race_pace_row.teamName.toLowerCase()}
              width={24}
              height={24}
              alt={race_pace_row.teamCode}
              className="object-contain w-full h-full"
            />
          </div>
          <span>{race_pace_row.teamName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "predictedPosition",
    header: "Prediction Score",
  },
];


export default async function RacePredictions() {
  const drivers = (await getDrivers()).data;
  
  const currentYear = new Date().getFullYear();
  const races = (await getEvents(currentYear)).data;

  const selectedRace = races && races.length > 0 ? races[20] : null;
  const raceName = selectedRace?.event_name ?? "Unknown Race";
  const raceYear = selectedRace?.season ?? currentYear;

  const input = (drivers || [])
    .filter((d: any) => d.driverCode || d.driver)
    .map((d: any) => ({
      driver: (d.driverCode ?? d.driver ?? "Unknown Driver").toString(),
      team: d.team ?? d.teamCode ?? "Unknown Team",
      race_name: raceName,
      year: raceYear,
      session_air_temp,
      session_track_temp,
      session_humidity,
      session_rainfall,
      circuit_type,
    }));

  const predictions: RacePrediction[] = (await predictRace(input)).predictions;

  const predictions_enhanced: RacePredictionRow[] = predictions.map(pred => {
          const driver = drivers.find((driver: Driver) => String(driver.driverCode).toUpperCase() === String(pred.driver).toUpperCase());
          return {
            driverCode: pred.driver,
            driverFirstName: driver?.firstName ?? pred.driver,
            driverLastName: driver?.lastName ?? "",
            teamName: pred.team ?? driver?.team ?? "Unknown Team",
            teamCode: driver?.teamCode,
            predictedPosition: pred.predicted_position,
            rank: pred.rank,
          };
        }).sort((a, b) => a.rank - b.rank);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
      <div className="bg-popover min-h-min flex-1 rounded-xl md:min-h-min p-4">
        <div className="w-full overflow-x-auto">
            <h2 className="text-lg font-semibold pb-4">
              Race Predictions
            </h2>
            <DataTable columns={columns} data={predictions_enhanced} />
        </div>
      </div>
    </div>
  );
}
