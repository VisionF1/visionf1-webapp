import { getEvents } from "@/lib/api-requests"

type Race = {
  event_id: string
  season: number
  round: number
  event_name: string
  circuit_name: string
  country: string
  location: string
  event_date: string
  event_status?: string
  driver_codes?: string[]
  driver_names?: string[]
}

export async function DriverRaces({ driverCode }: { driverCode: string }) {
  const currentYear = new Date().getFullYear()
  let lastThreeRaces: (Race & { driverPosition?: number })[] = []

  try {
    // Fetch current year events
    const currentYearEvents = await getEvents(currentYear)
    const endedRaces = currentYearEvents.data
      .filter((event: any) => event.event_status === "ended")
      .map((race: any) => {
        const driverIndex = (race.driver_codes || []).indexOf(driverCode)
        return {
          ...race,
          driverPosition: driverIndex >= 0 ? driverIndex + 1 : undefined, // Index + 1 because arrays are 0-indexed
        }
      })
      .filter((race: any) => race.driverPosition !== undefined)
      .sort((a: any, b: any) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())

    lastThreeRaces = endedRaces.slice(0, 3)

    // If we have less than 3 races, fetch previous year
    if (lastThreeRaces.length < 3) {
      const previousYearEvents = await getEvents(currentYear - 1)
      const previousYearEndedRaces = previousYearEvents.data
        .filter((event: any) => event.event_status === "ended")
        .map((race: any) => {
          const driverIndex = (race.driver_codes || []).indexOf(driverCode)
          return {
            ...race,
            driverPosition: driverIndex >= 0 ? driverIndex + 1 : undefined,
          }
        })
        .filter((race: any) => race.driverPosition !== undefined)
        .sort((a: any, b: any) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())

      // Add races from previous year to fill up to 3 total
      const racesNeeded = 3 - lastThreeRaces.length
      lastThreeRaces = [...lastThreeRaces, ...previousYearEndedRaces.slice(0, racesNeeded)]
    }
  } catch (error) {
    console.error("Error fetching driver races:", error)
    return (
      <div className="p-4 flex flex-col">
        <h2 className="text-lg font-semibold pb-4">Last Races</h2>
        <p className="text-muted-foreground">Error loading races</p>
      </div>
    )
  }

  return (
    <div className="p-4 flex flex-col h-full">
      <h2 className="text-lg font-semibold pb-4">Last Races</h2>
      <div className="flex flex-col gap-3 flex-1">
        {lastThreeRaces.length > 0 ? (
          lastThreeRaces.map((race, index) => (
            <div key={`${race.season}-${race.round}`} className="border border-border rounded-lg p-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Race {race.round}</div>
                  <div className="font-semibold text-sm">{race.event_name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{race.circuit_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(race.event_date).toLocaleDateString()}
                  </div>
                </div>
                {race.driverPosition && (
                  <div className="text-right">
                    <div className="font-bold text-lg">P{race.driverPosition}</div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-sm">No races found</p>
        )}
      </div>
    </div>
  )
}
