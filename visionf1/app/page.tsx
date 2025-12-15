import { DriverImages } from "@/components/driver/drivers"
import { UpcomingGP } from "@/components/upcoming-gp"
import { Welcome } from "@/components/welcome"
import { DriverStandings } from "@/components/driver/driver-standings"
import { TeamStandings } from "@/components/team-standings"
import { HomeCarousel } from "@/components/home-carousel"
import { getDriverStandings, getTeamStandings, getDrivers, getUpcomingGP } from "@/lib/api-requests"

import { ModelsCard, AnalyticsCard } from "@/components/home-navigation-cards"

export default async function Home() {

  const driverStandings = await getDriverStandings();
  const teamStandings = await getTeamStandings();
  const drivers = await getDrivers();
  const upcomingGP = await getUpcomingGP();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 auto-rows-min">
        <div className="bg-muted/50 aspect-video rounded-xl md:order-1 xl:order-none">
          <Welcome />
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl md:order-2 xl:order-none">
          <DriverImages data={drivers.data} />
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl md:order-3 xl:order-none">
          <UpcomingGP gp={upcomingGP.data[0]} />
        </div>
        <div className="rounded-xl aspect-video md:order-5 xl:order-none">
          <ModelsCard />
        </div>
        <div className="bg-muted/50 rounded-xl overflow-hidden aspect-video md:order-4 xl:order-none">
          <HomeCarousel />
        </div>
        <div className="rounded-xl aspect-video md:order-6 xl:order-none">
          <AnalyticsCard />
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