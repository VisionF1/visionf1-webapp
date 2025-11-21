"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { CldImage } from "next-cloudinary";
import { RacePredictionRow } from "@/lib/types";

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
            <CldImage src={race_pace_row.driverCode} width={32} height={32} alt={race_pace_row.driverLastName} crop="fill" className="object-cover" />
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
            <CldImage src={race_pace_row.teamName.toLowerCase()} width={24} height={24} alt={race_pace_row.teamCode || "Team"} className="object-contain w-full h-full" />
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

export function PredictionsTable({ data }: { data: RacePredictionRow[] }) {
  return (
     <div className="bg-popover min-h-min flex-1 rounded-xl md:min-h-min p-4">
        <div className="w-full overflow-x-auto">
            <h2 className="text-lg font-semibold pb-4">Race Predictions</h2>
            <DataTable columns={columns} data={data} />
        </div>
      </div>
  );
}
