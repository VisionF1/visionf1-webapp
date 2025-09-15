import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "./data-table"

type DriverStanding = {
  position: number
  driver: string
  nationality: string
  team: string
  points: number
}

const driverStandings: DriverStanding[] = [
  { position: 1, driver: "Oscar Piastri", nationality: "AUS", team: "McLaren", points: 324 },
  { position: 2, driver: "Lando Norris", nationality: "GBR", team: "McLaren", points: 293 },
  { position: 3, driver: "Max Verstappen", nationality: "NED", team: "Red Bull Racing", points: 230 },
  { position: 4, driver: "George Russell", nationality: "GBR", team: "Mercedes", points: 194 },
  { position: 5, driver: "Charles Leclerc", nationality: "MON", team: "Ferrari", points: 163 },
  { position: 6, driver: "Lewis Hamilton", nationality: "GBR", team: "Ferrari", points: 117 },
  { position: 7, driver: "Alexander Albon", nationality: "THA", team: "Williams", points: 70 },
  { position: 8, driver: "Kimi Antonelli", nationality: "ITA", team: "Mercedes", points: 66 },
  { position: 9, driver: "Isack Hadjar", nationality: "FRA", team: "Racing Bulls", points: 38 },
  { position: 10, driver: "Nico Hulkenberg", nationality: "GER", team: "Kick Sauber", points: 37 },
  { position: 11, driver: "Lance Stroll", nationality: "CAN", team: "Aston Martin", points: 32 },
  { position: 12, driver: "Fernando Alonso", nationality: "ESP", team: "Aston Martin", points: 30 },
  { position: 13, driver: "Esteban Ocon", nationality: "FRA", team: "Haas", points: 28 },
  { position: 14, driver: "Pierre Gasly", nationality: "FRA", team: "Alpine", points: 20 },
  { position: 15, driver: "Liam Lawson", nationality: "NZL", team: "Racing Bulls", points: 20 },
  { position: 16, driver: "Gabriel Bortoletto", nationality: "BRA", team: "Kick Sauber", points: 18 },
  { position: 17, driver: "Oliver Bearman", nationality: "GBR", team: "Haas", points: 16 },
  { position: 18, driver: "Carlos Sainz", nationality: "ESP", team: "Williams", points: 16 },
  { position: 19, driver: "Yuki Tsunoda", nationality: "JPN", team: "Red Bull Racing", points: 12 },
  { position: 20, driver: "Franco Colapinto", nationality: "ARG", team: "Alpine", points: 0 },
  { position: 21, driver: "Jack Doohan", nationality: "AUS", team: "Alpine", points: 0 },
];

const columns: ColumnDef<DriverStanding>[] = [
  {
    accessorKey: "position",
    header: "Position",
  },
  {
    accessorKey: "driver",
    header: "Driver",
  },
  {
    accessorKey: "nationality",
    header: "Nationality",
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

export function DriverStandings() {
  return (
    <div className="aspect-video p-4 flex flex-col">
      <h2 className="text-lg font-semibold">Driver Standings</h2>
      <DataTable columns={columns} data={driverStandings} />
    </div>
  );
}