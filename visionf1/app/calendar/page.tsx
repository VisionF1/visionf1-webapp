import { RaceCard } from "@/components/race-card";
import { getEvents, getDrivers } from "@/lib/api-requests";
import { Driver, Race } from "@/lib/types";


export default async function RaceCalendar() {
  const currentYear = new Date().getFullYear();
  let races = [];
  const driverCodeToTeamCode: { [key: string]: string } = {};
  let nextUpcomingRaceId: string | null = null;

  try {
    const racesResponse = await getEvents(currentYear);
    races = racesResponse.data || [];
    races.sort((a: Race, b: Race) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());

    const now = new Date();
    for (const race of races) {
      const raceEnd = new Date(new Date(race.event_date).getTime() + 3 * 60 * 60 * 1000);
      if (raceEnd > now) {
        nextUpcomingRaceId = race.event_id;
        break;
      }
    }

    const driversResponse = await getDrivers();
    const drivers = driversResponse.data || [];
    drivers.forEach((driver: Driver) => {
      driverCodeToTeamCode[driver.driverCode] = driver.teamCode;
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
              driverCodeToTeamCode={driverCodeToTeamCode}
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
