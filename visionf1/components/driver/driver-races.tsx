import Image from "next/image"
import { getEvents } from "@/lib/api-requests"
import { Race } from "@/lib/types"


export async function DriverRaces({ driverCode }: { driverCode: string }) {
  const currentYear = new Date().getFullYear()
  let allCurrentYearRaces: (Race & { driverPosition?: number })[] = []

  try {
    // Fetch current year events
    const currentYearEvents = await getEvents(currentYear)
    const endedRaces = currentYearEvents.data
      .filter((event: Race) => event.event_status === "ended")
      .map((race: Race) => {
        const driverIndex = (race.driver_codes || []).indexOf(driverCode)
        return {
          ...race,
          driverPosition: driverIndex >= 0 ? driverIndex + 1 : undefined, // Index + 1 because arrays are 0-indexed
        }
      })
      .filter((race: Race & { driverPosition?: number }) => race.driverPosition !== undefined)
      .sort((a: Race & { driverPosition?: number }, b: Race & { driverPosition?: number }) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())

    allCurrentYearRaces = endedRaces
  } catch {
    console.error("Error fetching driver races")
    return (
      <div className="p-4 flex flex-col">
        <h2 className="text-lg font-semibold pb-4">Season Races</h2>
        <p className="text-muted-foreground">Error loading races</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full @container">
      <div className="rounded-xl h-full flex flex-col p-4">
        <h2 className="text-lg font-semibold pb-4">Season Races</h2>
        {allCurrentYearRaces.length === 0 ? (
          <div className="flex items-center justify-center flex-1">
            <p className="text-muted-foreground text-sm">The season hasn&apos;t started yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 flex-1 overflow-y-auto">
            {allCurrentYearRaces.map((race) => (
              <div key={`${race.season}-${race.round}`} className="border border-border rounded-lg p-2 flex flex-col">
                <div className="text-xs @sm:text-sm text-muted-foreground">Race {race.round}</div>
                <div className="flex items-center gap-1 mt-1">
                  <div className="relative w-5 h-4 flex-shrink-0">
                    <Image
                      src={`https://flagcdn.com/${race.country_code.toLocaleLowerCase()}.svg`}
                      alt={race.country}
                      fill
                      className="object-contain"
                      sizes="20px"
                    />
                  </div>
                  <div className="font-semibold text-xs @sm:text-sm truncate">{race.event_name}</div>
                </div>
                <div className="text-xs text-muted-foreground mt-1 truncate">{race.circuit_name}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(race.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                {race.driverPosition && (
                  <div className="mt-2 pt-2 border-t border-border">
                    <div className="font-bold text-base text-center">P{race.driverPosition}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
