import { getDrivers, getEvents, predictRace } from "@/lib/api-requests";
import { Driver, RacePrediction, RacePredictionRow } from "@/lib/types";
import { Podium } from "@/components/podium";
import { PredictionsTable } from "@/components/predictions-table";

const session_air_temp = 26;
const session_track_temp = 35;
const session_humidity = 60;
const session_rainfall = 0;
const circuit_type = "street";

export default async function RacePredictions() {
  const driversResponse = await getDrivers();
  const drivers = driversResponse.data;
  
  const currentYear = new Date().getFullYear();
  const racesResponse = await getEvents(currentYear);
  const races = racesResponse.data;

  const selectedRace = races && races.length > 0 ? races[20] : null;
  const raceName = selectedRace?.event_name ?? "Unknown Race";
  const raceYear = selectedRace?.season ?? currentYear;

  const input = (drivers || [])
    .filter((d: any) => d.driverCode || d.driver)
    .map((d: any) => ({
      driver: (d.driverCode ?? d.driver ?? "Unknown Driver").toString(),
      team: d.team ?? d.teamCode ?? "Unknown Team",
      race_name: raceName,
      year: raceYear,
      session_air_temp,
      session_track_temp,
      session_humidity,
      session_rainfall,
      circuit_type,
    }));

  const response = await predictRace(input);
  const predictions: RacePrediction[] = response.predictions;

  const predictions_enhanced: RacePredictionRow[] = predictions.map(pred => {
          const driver = drivers.find((driver: Driver) => String(driver.driverCode).toUpperCase() === String(pred.driver).toUpperCase());
          return {
            driverCode: pred.driver,
            driverFirstName: driver?.firstName ?? pred.driver,
            driverLastName: driver?.lastName ?? "",
            teamName: pred.team ?? driver?.team ?? "Unknown Team",
            teamCode: driver?.teamCode,
            predictedPosition: pred.predicted_position,
            rank: pred.rank,
          };
        }).sort((a, b) => a.rank - b.rank);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
      <Podium drivers={predictions_enhanced.slice(0, 3)} />
      <PredictionsTable data={predictions_enhanced} />
    </div>
  );
}
