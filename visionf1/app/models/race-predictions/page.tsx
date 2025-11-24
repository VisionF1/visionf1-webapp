import { getDrivers, getEvents } from "@/lib/api-requests";
import { RacePredictionsView } from "@/components/race-predictions";


export default async function RacePredictions() {
  const drivers = (await getDrivers()).data;

  const currentYear = new Date().getFullYear();
  const races = (await getEvents(currentYear)).data;

  return (
    <RacePredictionsView drivers={drivers} races={races} />
  );
}
