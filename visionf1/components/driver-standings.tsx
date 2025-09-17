"use client";

import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "./data-table"
import { CldImage } from 'next-cloudinary'
import Image from "next/image"

type DriverStanding = {
  position: number
  driver: string
  driverCode: string
  nationality: string
  nationalityCode: string
  team: string
  teamCode: string
  points: number
}

export function DriverStandings({ data: driverStandings }: { data: DriverStanding[] }) {
  const columns: ColumnDef<DriverStanding>[] = [
    {
      accessorKey: "position",
      header: "Position",
    },
    {
      accessorKey: "driver",
      header: "Driver",
      cell: ({ row }) => {
        const driver = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <CldImage
                src={driver.driverCode}
                width={32}
                height={32}
                alt={driver.driver}
                crop="fill"
                className="object-cover"
              />
            </div>
            <div>
              <div className="font-medium">{driver.driver}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "nationality",
      header: "Nationality",
      cell: ({ row }) => {
        const driver = row.original;
        return (
          <div className="flex items-center gap-2">
            <Image
              src={`https://flagcdn.com/${driver.nationalityCode}.svg`}
              alt={driver.nationality}
              width={24}
              height={18}
              className="object-contain"
            />
            <span>{driver.nationality}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "team",
      header: "Team",
      cell: ({ row }) => {
        const driver = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 flex items-center justify-center rounded-full">
              <CldImage
                src={driver.team}
                width={24}
                height={24}
                alt={driver.teamCode}
                className="object-contain w-full h-full"
              />
            </div>
            <span>{driver.team}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "points",
      header: "Points",
      cell: ({ row }) => {
        const points = row.getValue("points") as number;
        return <div className="font-bold">{points}</div>;
      },
    },
  ];

  return (
    <div className="p-4 flex flex-col">
      <h2 className="text-lg font-semibold pb-4">Driver Standings</h2>
      <DataTable columns={columns} data={driverStandings} />
    </div>
  );
}