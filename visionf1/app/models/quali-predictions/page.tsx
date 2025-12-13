import { getDrivers, getEvents, getConfigNextRace } from "@/lib/api-requests";
import { QualiPredictionsView } from "@/components/quali-predictions";

export default async function QualiPredictionsPage() {
  const drivers = (await getDrivers()).data;
  const currentYear = new Date().getFullYear();
  const races = (await getEvents(currentYear)).data;
  const nextRaceConfig = await getConfigNextRace();

  // Enrich nextRace with round number
  const nextRace = nextRaceConfig ? {
    ...nextRaceConfig,
    round: races.find((r: any) =>
      r.season === nextRaceConfig.season &&
      r.event_name === nextRaceConfig.race_name
    )?.round
  } : null;

  return (
    <QualiPredictionsView drivers={drivers} nextRace={nextRace} />
  );
}
