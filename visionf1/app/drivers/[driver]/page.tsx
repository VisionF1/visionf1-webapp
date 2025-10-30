import { notFound } from "next/navigation"
import { DriverDetailCard } from "@/components/driver-detail-card"
import { DriverRaces } from "@/components/driver-races"
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
      <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        <div className="aspect-video rounded-xl">
          <DriverDetailCard driver={driverData} />
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl">
          <DriverRaces driverCode={driverData.driverCode} />
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl">
        </div>
      </div>
      <div className="bg-muted/50 aspect-video min-h-min flex-1 rounded-xl md:min-h-min">
      </div>
      <div className="bg-muted/50 aspect-video min-h-min flex-1 rounded-xl md:min-h-min">
      </div>
    </div>
  )
}
