"use client";

import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "../data-table"
import { CldImage } from 'next-cloudinary'
import Image from "next/image"
import { DriverStanding } from "@/lib/types"


export function DriverStandings({ data: driverStandings }: { data: DriverStanding[] }) {
  const router = useRouter()

  const getDriverSlug = (driverName: string) => {
    const [firstName, ...lastNameParts] = driverName.split(" ");
    const lastName = lastNameParts.join(" ");
    return `${firstName.toLowerCase().replace(/ü/g, "u")}-${lastName.toLowerCase().replace(/ü/g, "u")}`;
  }

  const handleDriverClick = (driverName: string) => {
    const slug = getDriverSlug(driverName);
    router.push(`/drivers/${slug}`);
  }
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
          <button
            onClick={() => handleDriverClick(driver.driver)}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
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
          </button>
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
              src={`https://flagcdn.com/${driver.nationalityCode.toLowerCase()}.svg`}
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
                src={driver.team.toLowerCase()}
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