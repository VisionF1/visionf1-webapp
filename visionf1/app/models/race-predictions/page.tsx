import { predictRace, getDrivers, getEvents } from "@/lib/api-requests";
import { RacePrediction } from "@/lib/types";

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

  console.log("Prediction input:", input);

  const predictions: RacePrediction[] = (await predictRace(input)).predictions;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl">
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl">
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl">
        </div>
      </div>
      <div className="bg-muted/50 aspect-video min-h-min flex-1 rounded-xl md:min-h-min">
        <h3 className="text-lg font-semibold">Predictions</h3>
        <ul>
          {predictions.map((prediction) => (
            <li key={prediction.driver}>
              {prediction.driver} ({prediction.team}): {prediction.predicted_position} (Rank: {prediction.rank})
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-muted/50 aspect-video min-h-min flex-1 rounded-xl md:min-h-min">
      </div>
    </div>
  );
}
