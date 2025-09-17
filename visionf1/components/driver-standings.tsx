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

const driverStandings: DriverStanding[] = [
  { position: 1, driver: "Oscar Piastri", driverCode: "PIA", nationality: "AUS", nationalityCode: "au", team: "McLaren", teamCode: "MCL", points: 324 },
  { position: 2, driver: "Lando Norris", driverCode: "NOR", nationality: "GBR", nationalityCode: "gb", team: "McLaren", teamCode: "MCL", points: 293 },
  { position: 3, driver: "Max Verstappen", driverCode: "VER", nationality: "NED", nationalityCode: "nl", team: "Red Bull Racing", teamCode: "RB", points: 230 },
  { position: 4, driver: "George Russell", driverCode: "RUS", nationality: "GBR", nationalityCode: "gb", team: "Mercedes", teamCode: "MER", points: 194 },
  { position: 5, driver: "Charles Leclerc", driverCode: "LEC", nationality: "MON", nationalityCode: "mc", team: "Ferrari", teamCode: "FER", points: 163 },
  { position: 6, driver: "Lewis Hamilton", driverCode: "HAM", nationality: "GBR", nationalityCode: "gb", team: "Ferrari", teamCode: "FER", points: 117 },
  { position: 7, driver: "Alexander Albon", driverCode: "ALB", nationality: "THA", nationalityCode: "th", team: "Williams", teamCode: "WIL", points: 70 },
  { position: 8, driver: "Kimi Antonelli", driverCode: "ANT", nationality: "ITA", nationalityCode: "it", team: "Mercedes", teamCode: "MER", points: 66 },
  { position: 9, driver: "Isack Hadjar", driverCode: "HAD", nationality: "FRA", nationalityCode: "fr", team: "Racing Bulls", teamCode: "RBU", points: 38 },
  { position: 10, driver: "Nico Hulkenberg", driverCode: "HUL", nationality: "GER", nationalityCode: "de", team: "Kick Sauber", teamCode: "SAU", points: 37 },
  { position: 11, driver: "Lance Stroll", driverCode: "STR", nationality: "CAN", nationalityCode: "ca", team: "Aston Martin", teamCode: "AM", points: 32 },
  { position: 12, driver: "Fernando Alonso", driverCode: "ALO", nationality: "ESP", nationalityCode: "es", team: "Aston Martin", teamCode: "AM", points: 30 },
  { position: 13, driver: "Esteban Ocon", driverCode: "OCO", nationality: "FRA", nationalityCode: "fr", team: "Haas", teamCode: "HAA", points: 28 },
  { position: 14, driver: "Pierre Gasly", driverCode: "GAS", nationality: "FRA", nationalityCode: "fr", team: "Alpine", teamCode: "ALP", points: 20 },
  { position: 15, driver: "Liam Lawson", driverCode: "LAW", nationality: "NZL", nationalityCode: "nz", team: "Racing Bulls", teamCode: "RBU", points: 20 },
  { position: 16, driver: "Gabriel Bortoletto", driverCode: "BOR", nationality: "BRA", nationalityCode: "br", team: "Kick Sauber", teamCode: "SAU", points: 18 },
  { position: 17, driver: "Oliver Bearman", driverCode: "BEA", nationality: "GBR", nationalityCode: "gb", team: "Haas", teamCode: "HAA", points: 16 },
  { position: 18, driver: "Carlos Sainz", driverCode: "SAI", nationality: "ESP", nationalityCode: "es", team: "Williams", teamCode: "WIL", points: 16 },
  { position: 19, driver: "Yuki Tsunoda", driverCode: "TSU", nationality: "JPN", nationalityCode: "jp", team: "Red Bull Racing", teamCode: "RB", points: 12 },
  { position: 20, driver: "Franco Colapinto", driverCode: "COL", nationality: "ARG", nationalityCode: "ar", team: "Alpine", teamCode: "ALP", points: 0 },
  { position: 21, driver: "Jack Doohan", driverCode: "DOO", nationality: "AUS", nationalityCode: "au", team: "Alpine", teamCode: "ALP", points: 0 },
];

export function DriverStandings() {
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