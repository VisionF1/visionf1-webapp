import { getDrivers, getEvents, getConfigNextRace } from "@/lib/api-requests";
import { RacePredictionsView } from "@/components/race-predictions";


export default async function RacePredictions() {
  const drivers = (await getDrivers()).data;

  const currentYear = new Date().getFullYear();
  const races = (await getEvents(currentYear)).data;

  let nextRace = null;
  try {
    const nextRaceConfig = await getConfigNextRace();
    if (nextRaceConfig && nextRaceConfig.race_name) {
      // Find the round number from the events list
      const matchingRace = races.find((r: any) =>
        r.event_name === nextRaceConfig.race_name && r.season === nextRaceConfig.season
      );

      nextRace = {
        ...nextRaceConfig,
        round: matchingRace ? matchingRace.round : null
      };
    }
  } catch (e) {
    console.error("Failed to fetch next race config", e);
  }

  return (
    <RacePredictionsView drivers={drivers} races={races} nextRace={nextRace} />
  );
}
