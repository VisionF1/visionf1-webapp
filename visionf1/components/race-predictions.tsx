"use client";

import { useEffect, useRef, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Podium } from "@/components/podium";
import { CldImage } from "next-cloudinary";
import { RacePredictionRow, Driver } from "@/lib/types";
import { Download, Frown } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { GenericComboBox } from "@/components/ui/combobox";
import { predictRace } from "@/lib/api-requests";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { exportDataAsCSV } from "@/lib/csv-utils";
import { WEATHER_OPTIONS } from "@/lib/prediction-data";


interface RacePredictionsViewProps {
  drivers: Driver[];
  races: any[];
}

// Exports Race Prediction data as CSV with proper formatting
export function exportPredictionsAsCSV(data: RacePredictionRow[], filename: string): Promise<void> {
  const headers = [
    { key: 'rank', label: 'Position' },
    { key: 'driver_name', label: 'Driver' },
    { key: 'teamName', label: 'Team' },
    { key: 'score', label: 'Score' },
    { key: 'confidence', label: 'Confidence (%)' },
  ];

  const fieldTransformers = {
    driver_name: (value: any, row: RacePredictionRow) =>
      `${row.driverFirstName} ${row.driverLastName}`,
    score: (value: number) => value?.toFixed(3) || 'N/A',
    confidence: (value: number) => value?.toFixed(1) || 'N/A',
  };

  // Add calculated field for driver name
  const dataWithDriverName = data.map(row => ({
    ...row,
    driver_name: `${row.driverFirstName} ${row.driverLastName}`
  }));

  return exportDataAsCSV(dataWithDriverName, filename, headers, fieldTransformers, true);
}

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
    accessorKey: "score",
    header: "Prediction Score",
    cell: ({ row }) => row.original.score?.toFixed(3) || "-",
  },
  {
    accessorKey: "confidence",
    header: "Confidence",
    cell: ({ row }) => row.original.confidence ? `${row.original.confidence.toFixed(1)}%` : "-",
  },
];


interface RacePredictionsViewProps {
  drivers: Driver[];
  races: any[];
  nextRace: { race_name: string; season: number; round?: number } | null;
}

export function RacePredictionsView({ drivers, nextRace }: RacePredictionsViewProps) {
  const [predictions, setPredictions] = useState<RacePredictionRow[]>([]);
  const [selectedWeather, setSelectedWeather] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Generating predictions...");
  const [error, setError] = useState<string | null>(null);

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
    if (!nextRace || !selectedWeather) return;

    setIsLoading(true);
    setPredictions([]);
    setError(null);

    // Loading simulation messages
    const messages = [
      "Initializing VisionF1 race prediction models...",
      "Analyzing historical telemetry data...",
      "Simulating weather impact on tire degradation...",
      "Running race simulations...",
    ];

    // Start the API call in the background
    const predictionPromise = (async () => {
      try {
        console.log("Predicting for:", nextRace.race_name, "Weather:", selectedWeather);
        const response = await predictRace(nextRace.race_name, selectedWeather);
        return response.race_predictions;
      } catch (error) {
        console.error("Failed to predict race:", error);
        return null;
      }
    })();

    // Run the loading simulation loop
    for (const msg of messages) {
      setLoadingMessage(msg);
      await new Promise(resolve => setTimeout(resolve, 800)); // 800ms * 5 = 4000ms
    }

    // Wait for the actual prediction if it's not done yet (it likely is)
    const preds = await predictionPromise;

    if (preds && preds.length > 0) {
      const predictions_enhanced: RacePredictionRow[] = preds.map((pred: any) => {
        const driver = drivers.find((driver: Driver) => String(driver.driverCode).toUpperCase() === String(pred.driver).toUpperCase());
        return {
          driverCode: pred.driver,
          driverFirstName: driver?.firstName ?? pred.driver,
          driverLastName: driver?.lastName ?? "",
          teamName: pred.team ?? driver?.team ?? "Unknown Team",
          teamCode: driver?.teamCode,
          predictedPosition: pred.final_position,
          rank: pred.final_position,
          score: pred.score,
          confidence: pred.confidence,
        };
      }).sort((a: any, b: any) => a.rank - b.rank);

      setPredictions(predictions_enhanced);
    } else {
      setError("Unable to generate race predictions at this time. Our AI models are currently unavailable. Please try again later.");
    }

    setIsLoading(false);
  };

  const handleExportCSV = async () => {
    if (predictions.length === 0 || !nextRace) return;

    const weatherLabel = WEATHER_OPTIONS.find(w => w.key === selectedWeather)?.label || 'unknown';
    const filename = `race_prediction_${nextRace.season}_${nextRace.race_name}_${weatherLabel}.csv`.replace(/\s+/g, '_');
    await exportPredictionsAsCSV(predictions, filename);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
      <div className="bg-popover min-h-min flex-1 rounded-xl md:min-h-min p-4">
        <div className="w-full overflow-x-auto">
          <h2 className="text-lg font-semibold pb-6">
            Race Predictions {nextRace && `- ${nextRace.season} ${nextRace.race_name}`}
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 mb-8 items-end">
            <div className="flex h-9 w-full sm:w-[320px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 items-center text-muted-foreground bg-muted/50 cursor-not-allowed">
              {nextRace ? `R${nextRace.round ?? '?'} • ${nextRace.season} • ${nextRace.race_name}` : "Loading next race..."}
            </div>

            <GenericComboBox
              items={WEATHER_OPTIONS}
              value={selectedWeather}
              onChange={(val) => setSelectedWeather(val || "")}
              getLabel={(item) => item.label}
              getValue={(item) => item.key}
              placeholder="Select Weather"
              search_label="Weather"
              width="w-[320px]"
              className="h-9"
            />

            <Button
              className="w-full sm:w-auto min-w-[140px] px-4 py-2 bg-brand text-sm text-black rounded-md hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors h-10"
              onClick={handlePredict}
              disabled={!nextRace || !selectedWeather || isLoading}
            >
              Predict Race
            </Button>
          </div>

          {error ? (
            <div className="flex flex-col justify-center items-center h-64 gap-4 text-center">
              <Frown className="size-16 text-muted-foreground mt-8" />
              <div className="flex flex-col gap-1">
                <div className="text-red-500/80 text-xl font-semibold mt-2">Prediction Failed</div>
                <div className="text-muted-foreground max-w-md mt-4">{error}</div>
              </div>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
              <div className="flex items-center">
                <Spinner className="size-8 mr-3" />
                <div className="text-xl font-medium animate-pulse">{loadingMessage}</div>
              </div>
              <div className="text-sm text-muted-foreground">
                Please wait while our AI models process the race data...
              </div>
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
              <div className="text-lg">Select weather conditions to generate a race prediction for {nextRace?.race_name || "the next Grand Prix"}.</div>
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
            <div className="flex justify-between items-center pb-4">
              <h2 className="text-lg font-semibold">Predicted Race Classification</h2>
              <button
                onClick={handleExportCSV}
                className="flex items-center px-4 py-2 bg-brand text-sm text-black rounded-md hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </button>
            </div>
            <DataTable columns={columns} data={predictions} />
          </div>
        </div>
      )}
    </div>
  );
}
