import { notFound } from "next/navigation"
import { DriverHero } from "@/components/driver-hero"
import { DriverRaces } from "@/components/driver-races"
import { DriverStandingsCard } from "@/components/driver-standings-card"
import { TeamCarCard } from "@/components/team-car-card"
import { getDrivers } from "@/lib/api-requests"

type Props = {
  params: Promise<{
    driver: string
  }>
}

export default async function DriverDetail({ params }: Props) {
  const { driver } = await params

  if (!driver) {
    notFound()
  }

  // Fetch all drivers and find the one matching the slug
  let driverData
  try {
    const driversResponse = await getDrivers()
    driverData = driversResponse.data.find((d: any) => 
      `${d.firstName.toLowerCase()}-${d.lastName.toLowerCase()}` === driver
    )

    if (!driverData) {
      notFound()
    }
  } catch (error) {
    notFound()
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
      <div className="flex flex-col sm:flex-row gap-4 h-full items-stretch">
        {/* Left column - Hero and Standings (30%) */}
        <div className="w-full sm:w-[30%] grid grid-cols-1 gap-4">
          <div className="rounded-xl">
            <DriverHero driver={driverData} />
          </div>
          <div className="rounded-xl">
            <DriverStandingsCard driverCode={driverData.driverCode} teamName={driverData.team} />
          </div>
        </div>

        {/* Right side - Races and Team Car (70%) */}
        <div className="w-full sm:w-[70%] flex flex-col gap-4">
          <div className="bg-muted/50 aspect-video rounded-xl flex-1 min-h-0 sm:aspect-video min-h-92 sm:min-h-0">
            <DriverRaces driverCode={driverData.driverCode} />
          </div>
          {/* Team Car Card */}
          <div className="bg-muted/50 aspect-video rounded-xl flex-1 min-h-0 p-4 flex flex-col">
            <TeamCarCard team={driverData.team} teamName={driverData.team} />
          </div>
        </div>
      </div>
    </div>
  )
}
