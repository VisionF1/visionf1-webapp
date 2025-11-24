"use client";

import { useEffect, useRef, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Podium } from "@/components/podium";
import { CldImage } from "next-cloudinary";
import { RacePredictionRow, Driver } from "@/lib/types";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { GenericComboBox } from "@/components/ui/combobox";
import { predictRace } from "@/lib/api-requests";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";


interface RacePredictionsViewProps {
  drivers: Driver[];
  races: any[];
}

const CIRCUIT_TYPE_MAP: Record<string, string> = {
  // Street/urban circuits
  "Monaco Grand Prix": "street",
  "Azerbaijan Grand Prix": "street",
  "Singapore Grand Prix": "street",
  "Las Vegas Grand Prix": "street",
  "Miami Grand Prix": "street",
  "Saudi Arabian Grand Prix": "street",
  "Australian Grand Prix": "street",

  // Power tracks
  "Italian Grand Prix": "power",
  "Belgian Grand Prix": "power",
  "British Grand Prix": "power",
  "Canadian Grand Prix": "power",

  // Hybrids (default)
  "Bahrain Grand Prix": "hybrid",
  "Spanish Grand Prix": "hybrid",
  "Hungarian Grand Prix": "hybrid",
  "Austrian Grand Prix": "hybrid",
  "Emilia Romagna Grand Prix": "hybrid",
  "French Grand Prix": "hybrid",
  "Portuguese Grand Prix": "hybrid",
  "Turkish Grand Prix": "hybrid",
  "United States Grand Prix": "hybrid",
  "Mexico City Grand Prix": "hybrid",
  "São Paulo Grand Prix": "hybrid",
  "Japanese Grand Prix": "hybrid",
  "Qatar Grand Prix": "hybrid",
  "Abu Dhabi Grand Prix": "hybrid",
  "Dutch Grand Prix": "hybrid",
};

const WEATHER_SCENARIOS = {
  "dry": {
    label: "Dry (Ideal)",
    session_air_temp: 26.0,
    session_track_temp: 35.0,
    session_humidity: 45.0,
    session_rainfall: 0,
    description: "Dry and ideal conditions"
  },
  "hot": {
    label: "Hot (Thermal Stress)",
    session_air_temp: 35.0,
    session_track_temp: 50.0,
    session_humidity: 70.0,
    session_rainfall: 0,
    description: "Very hot conditions (thermal stress)"
  },
  "wet": {
    label: "Wet (Light Rain)",
    session_air_temp: 18.0,
    session_track_temp: 22.0,
    session_humidity: 85.0,
    session_rainfall: 1,
    description: "Wet conditions (light rain)"
  },
  "storm": {
    label: "Storm (Extreme)",
    session_air_temp: 15.0,
    session_track_temp: 18.0,
    session_humidity: 95.0,
    session_rainfall: 1,
    description: "Extreme conditions (storm)"
  },
  "cold": {
    label: "Cold (Winter)",
    session_air_temp: 12.0,
    session_track_temp: 15.0,
    session_humidity: 60.0,
    session_rainfall: 0,
    description: "Cold conditions (winter)"
  }
};

const columns: ColumnDef<RacePredictionRow>[] = [
  {
    accessorKey: "rank",
    header: "Position",
  },
  {
    accessorKey: "driver",
    header: "Driver",
    cell: ({ row }) => {
      const race_pace_row = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden">
            <CldImage
              src={race_pace_row.driverCode}
              width={32}
              height={32}
              alt={race_pace_row.driverFirstName + ' ' + race_pace_row.driverLastName}
              crop="fill"
              className="object-cover"
            />
          </div>
          <div>
            <div className="font-medium">{race_pace_row.driverFirstName + ' ' + race_pace_row.driverLastName}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "teamName",
    header: "Team",
    cell: ({ row }) => {
      const race_pace_row = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 flex items-center justify-center rounded-full">
            <CldImage
              src={race_pace_row.teamName.toLowerCase()}
              width={24}
              height={24}
              alt={race_pace_row.teamCode}
              className="object-contain w-full h-full"
            />
          </div>
          <span>{race_pace_row.teamName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "predictedPosition",
    header: "Prediction Score",
    cell: ({ row }) => row.original.predictedPosition.toFixed(3),
  },
];

export function RacePredictionsView({ drivers, races }: RacePredictionsViewProps) {
  const [predictions, setPredictions] = useState<RacePredictionRow[]>([]);
  const [selectedRaceId, setSelectedRaceId] = useState<string>("");
  const [selectedWeather, setSelectedWeather] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || predictions.length === 0) return;

    const myConfetti = confetti.create(canvasRef.current, {
      resize: true,
      useWorker: true,
    });

    const end = Date.now() + 1000;
    const colors = ["#eab308", "#ef4444", "#3b82f6"];

    (function frame() {
      myConfetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 }, // Start from bottom left
        colors: colors,
      });
      myConfetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 }, // Start from bottom right
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    return () => {
      myConfetti.reset();
    };
  }, [predictions]);

  const handlePredict = async () => {
    if (!selectedRaceId || !selectedWeather) return;

    setIsLoading(true);
    setPredictions([]);

    try {
      const selectedRace = races.find(r => r.event_id === selectedRaceId);
      const weather = WEATHER_SCENARIOS[selectedWeather as keyof typeof WEATHER_SCENARIOS];
      const circuitType = CIRCUIT_TYPE_MAP[selectedRace?.event_name] || "hybrid";

      const input = drivers
        .filter((d: any) => d.driverCode || d.driver)
        .map((d: any) => ({
          driver: (d.driverCode ?? d.driver ?? "Unknown Driver").toString(),
          team: d.team ?? d.teamCode ?? "Unknown Team",
          race_name: selectedRace?.event_name || "Unknown Race",
          year: selectedRace?.season || new Date().getFullYear(),
          session_air_temp: weather.session_air_temp,
          session_track_temp: weather.session_track_temp,
          session_humidity: weather.session_humidity,
          session_rainfall: weather.session_rainfall,
          circuit_type: circuitType,
        }));

      const response = await predictRace(input);
      const preds = response.predictions;

      const predictions_enhanced: RacePredictionRow[] = preds.map((pred: any) => {
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
      }).sort((a: any, b: any) => a.rank - b.rank);

      setPredictions(predictions_enhanced);
    } catch (error) {
      console.error("Failed to predict race:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedRaceName = selectedRaceId
    ? races.find(r => r.event_id === selectedRaceId)?.event_name
    : "";

  const selectedRaceYear = selectedRaceId
    ? races.find(r => r.event_id === selectedRaceId)?.season
    : "";

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
      <div className="bg-popover min-h-min flex-1 rounded-xl md:min-h-min p-4">
        <div className="w-full overflow-x-auto">
          <h2 className="text-lg font-semibold pb-4">
            Race Predictions {selectedRaceName && `- ${selectedRaceYear} ${selectedRaceName}`}
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 mb-6 items-end">
            <GenericComboBox
              items={races}
              value={selectedRaceId}
              onChange={(val) => setSelectedRaceId(val || "")}
              getLabel={(race) => `R${race.round} • ${race.event_name}`}
              getValue={(race) => race.event_id}
              placeholder="Select Grand Prix"
              search_label="Grand Prix"
              width="w-[320px]"
            />

            <GenericComboBox
              items={Object.entries(WEATHER_SCENARIOS).map(([key, value]) => ({ key, ...value }))}
              value={selectedWeather}
              onChange={(val) => setSelectedWeather(val || "")}
              getLabel={(item) => item.label}
              getValue={(item) => item.key}
              placeholder="Select Weather"
              search_label="Weather"
              width="w-[320px]"
            />

            <Button
              className="w-full sm:w-auto min-w-[140px] px-4 py-2 bg-brand text-sm text-black rounded-md hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              onClick={handlePredict}
              disabled={!selectedRaceId || !selectedWeather || isLoading}
            >
              Predict Race
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner className="size-6 mr-2" />
              <div className="text-lg">Generating predictions...</div>
            </div>
          ) : predictions.length > 0 ? (
            <div className="w-full overflow-x-auto relative">
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-20" />
              <div className="min-w-[700px] relative z-10">
                <Podium drivers={predictions.slice(0, 3)} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center text-center h-80 gap-10">
              <div className="text-lg">Select a Grand Prix and weather conditions to generate a race prediction.</div>
              <div className="text-sm text-muted-foreground max-w-md">
                These predictions are generated by AI using advanced machine learning models trained by the VisionF1 team.
              </div>
              <div className="flex-shrink-0 pb-2 px-2">
                <div className="h-20 w-20 @2xs:h-24 @2xs:w-24 @xs:h-28 @xs:w-28 @sm:h-36 @sm:w-36 @md:h-42 @md:w-42 @lg:h-46 @lg:w-46 @xl:h-56 @xl:w-56 bg-sidebar-primary border-2 border-brand flex items-center justify-center rounded-full overflow-hidden shadow-lg">
                  <Image
                    src="/visionf1-logo.svg"
                    alt="VisionF1"
                    width={200}
                    height={200}
                    className="object-contain h-full w-full p-1"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {predictions.length > 0 && (
        <div className="bg-popover min-h-min flex-1 rounded-xl md:min-h-min">
          <div className="p-4 flex flex-col">
            <h2 className="text-lg font-semibold pb-4">Predicted Race Classification</h2>
            <DataTable columns={columns} data={predictions} />
          </div>
        </div>
      )}
    </div>
  );
}
