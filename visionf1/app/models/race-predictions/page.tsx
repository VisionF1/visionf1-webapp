import { predictRace, getDrivers, getEvents } from "@/lib/api-requests";
import { RacePrediction, RacePredictionRow, Driver } from "@/lib/types";
import { RacePredictionsView } from "@/components/race-predictions";


const session_air_temp = 26;
const session_track_temp = 35;
const session_humidity = 60;
const session_rainfall = 0;
const circuit_type = "street";


export default async function RacePredictions() {
  const drivers = (await getDrivers()).data;

  const currentYear = new Date().getFullYear();
  const races = (await getEvents(currentYear)).data;

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

  const predictions: RacePrediction[] = (await predictRace(input)).predictions;

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
    <RacePredictionsView predictions={predictions_enhanced} />
  );
}
