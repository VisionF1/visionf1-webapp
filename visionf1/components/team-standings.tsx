import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "./data-table"

type TeamStanding = {
  position: number
  team: string
  points: number
}

const teamStandings: TeamStanding[] = [
  { position: 1, team: "McLaren", points: 617 },
  { position: 2, team: "Ferrari", points: 280 },
  { position: 3, team: "Mercedes", points: 260 },
  { position: 4, team: "Red Bull Racing", points: 239 },
  { position: 5, team: "Williams", points: 86 },
  { position: 6, team: "Aston Martin", points: 62 },
  { position: 7, team: "Racing Bulls", points: 61 },
  { position: 8, team: "Kick Sauber", points: 55 },
  { position: 9, team: "Haas", points: 44 },
  { position: 10, team: "Alpine", points: 20 },
];

const columns: ColumnDef<TeamStanding>[] = [
  {
    accessorKey: "position",
    header: "Position",
  },
  {
    accessorKey: "team",
    header: "Team",
  },
  {
    accessorKey: "points",
    header: "Points",
  },
]

export function TeamStandings() {
  return (
    <div className="p-4 flex flex-col">
      <h2 className="text-lg font-semibold pb-4">Team Standings</h2>
      <DataTable columns={columns} data={teamStandings} />
    </div>
  );
}