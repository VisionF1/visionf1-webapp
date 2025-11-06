"use client";

import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "./data-table"
import { CldImage } from 'next-cloudinary'
import Image from "next/image"
import { TeamStanding } from "@/lib/types"


export function TeamStandings({ data: teamStandings }: { data: TeamStanding[] }) {
  const columns: ColumnDef<TeamStanding>[] = [
    {
      accessorKey: "position",
      header: "Position",
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
                src={driver.team.toLowerCase()}
                width={24}
                height={24}
                alt={driver.team}
                className="object-contain w-full h-full"
              />
            </div>
            <span>{driver.team}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "nationality",
      header: "Nationality",
      cell: ({ row }) => {
        const team = row.original;
        return (
          <div className="flex items-center gap-2">
            <Image
              src={`https://flagcdn.com/${team.nationalityCode.toLowerCase()}.svg`}
              alt={team.nationality}
              width={24}
              height={18}
              className="object-contain"
            />
            <span>{team.nationality}</span>
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
      <h2 className="text-lg font-semibold pb-4">Team Standings</h2>
      <DataTable columns={columns} data={teamStandings} />
    </div>
  );
}