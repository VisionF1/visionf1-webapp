import { predictRace } from "@/lib/api-requests";

type RacePrediction = {
  driver: string;
  team: string;
  predicted_position: number;
  rank: number;
}

async function handlePredictRace(drivers: Array<{ driver: string; team: string; race_name: string; year: number; session_air_temp: number; session_track_temp: number; session_humidity: number; session_rainfall: number; circuit_type: string; }>) {
  const response = await predictRace(drivers);
  return response?.predictions as RacePrediction[] || [];
}

const drivers = [
    {
      "driver": "VER",
      "team": "Red Bull Racing",
      "race_name": "Singapore Grand Prix",
      "year": 2025,
      "session_air_temp": 26,
      "session_track_temp": 35,
      "session_humidity": 60,
      "session_rainfall": 0,
      "circuit_type": "street"
    },
    {
      "driver": "HAM",
      "team": "Ferrari",
      "race_name": "Singapore Grand Prix",
      "year": 2025,
      "session_air_temp": 26,
      "session_track_temp": 35,
      "session_humidity": 60,
      "session_rainfall": 0,
      "circuit_type": "street"
    },
    {
      "driver": "NOR",
      "team": "McLaren",
      "race_name": "Singapore Grand Prix",
      "year": 2025,
      "session_air_temp": 26,
      "session_track_temp": 35,
      "session_humidity": 60,
      "session_rainfall": 0,
      "circuit_type": "street"
    }
];

export default async function RacePredictions() {
  const predictions: RacePrediction[] = await handlePredictRace(drivers);
  console.log(predictions);

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
