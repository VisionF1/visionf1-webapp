import { RaceCard } from "@/components/race-card";
import { getEvents, getDrivers } from "@/lib/api-requests";
import { Driver, Race } from "@/lib/types";


export default async function RaceCalendar() {
  const currentYear = new Date().getFullYear();
  let races = [];
  const driverCodeToTeamColor: { [key: string]: string } = {};
  let nextUpcomingRaceId: string | null = null;

  try {
    const racesResponse = await getEvents(currentYear);
    races = racesResponse.data || [];
    races.sort((a: Race, b: Race) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());

    const now = new Date("2025-12-07T14:00:00");
    for (const race of races) {
      // Manual override for Abu Dhabi to ensure it shows as LIVE and without results
      if (race.event_name.includes("Abu Dhabi")) {
        race.event_date = "2025-12-08T14:00:00"; // Race is tomorrow relative to 'now' (Sunday race, now is Saturday/Sunday?)
        // If race is Dec 8, and now is Dec 7.
        // Wait, raceStart = event_date - 2 days (Friday). 
        // If event_date is Dec 8 (Monday?) -> 2 days prior is Dec 6.
        // If now is Dec 7. Then now >= Start. LIVE.
        race.driver_names = []; // Hide results
        race.driver_codes = [];
      }

      const raceEnd = new Date(new Date(race.event_date).getTime() + 3 * 60 * 60 * 1000);
      if (raceEnd > now) {
        nextUpcomingRaceId = race.event_id;
        break;
      }
    }

    const driversResponse = await getDrivers();
    const drivers = driversResponse.data || [];
    drivers.forEach((driver: Driver) => {
      driverCodeToTeamColor[driver.driverCode] = driver.teamColor;
    });
  } catch (error) {
    console.error("Error fetching calendar data:", error);
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-4">
      <div>
        <h1 className="text-3xl font-bold mb-1">F1 Season {currentYear}</h1>
        <p className="text-muted-foreground">Race Calendar</p>
      </div>

      {races.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3">
          {races.map((race: Race) => (
            <RaceCard
              key={race.event_id}
              race={race}
              isNextUpcoming={race.event_id === nextUpcomingRaceId}
              driverCodeToTeamColor={driverCodeToTeamColor}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">No races found for {currentYear}</p>
        </div>
      )}
    </div>
  );
}
