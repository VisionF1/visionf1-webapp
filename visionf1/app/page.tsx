import { DriverImages } from "@/components/drivers"
import { UpcomingGP } from "@/components/upcoming-gp"
import { Welcome } from "@/components/welcome"
import { DriverStandings } from "@/components/driver-standings"
import { TeamStandings } from "@/components/team-standings"
import { PlaceholderBrand } from "@/components/placeholder-brand"
import { getDriverStandings, getTeamStandings, getDrivers, getUpcomingGP } from "@/lib/api-requests"

export default async function Home() {

  const driverStandings = await getDriverStandings();
  const teamStandings = await getTeamStandings();
  const drivers = await getDrivers();
  const upcomingGP = await getUpcomingGP();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl">
          <Welcome />
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl">
          <DriverImages data={drivers.data}/>
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl">
          <UpcomingGP gp={upcomingGP.data[0]} />
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl hidden md:block lg:block xl:hidden">
          <PlaceholderBrand />
        </div>
      </div>
      <div className="bg-muted/50 min-h-min flex-1 rounded-xl md:min-h-min">
        <DriverStandings data={driverStandings.data} />
      </div>
      <div className="bg-muted/50 min-h-min flex-1 rounded-xl md:min-h-min">
        <TeamStandings data={teamStandings.data} />
      </div>
    </div>
  )
}