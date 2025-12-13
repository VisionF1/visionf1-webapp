"use client";

import { useEffect, useRef, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Podium } from "@/components/podium";
import { CldImage } from "next-cloudinary";
import { RacePredictionRow, QualiPredictionRow, Driver } from "@/lib/types";
import { Download, Frown, Info } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { GenericComboBox } from "@/components/ui/combobox";
import { predictAll } from "@/lib/api-requests";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { exportDataAsCSV } from "@/lib/csv-utils";
import { WEATHER_OPTIONS } from "@/lib/prediction-data";

// --- Columns Definitions ---

const raceColumns: ColumnDef<RacePredictionRow>[] = [
  {
    accessorKey: "rank",
    header: "Position",
  },
  {
    accessorKey: "driver",
    header: "Driver",
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden">
            <CldImage
              src={rowData.driverCode}
              width={32}
              height={32}
              alt={rowData.driverFirstName + ' ' + rowData.driverLastName}
              crop="fill"
              className="object-cover"
            />
          </div>
          <div>
            <div className="font-medium">{rowData.driverFirstName + ' ' + rowData.driverLastName}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "teamName",
    header: "Team",
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 flex items-center justify-center rounded-full">
            <CldImage
              src={rowData.teamName.toLowerCase()}
              width={24}
              height={24}
              alt={rowData.teamCode}
              className="object-contain w-full h-full"
            />
          </div>
          <span>{rowData.teamName}</span>
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

const qualiColumns: ColumnDef<QualiPredictionRow>[] = [
  {
    accessorKey: "rank",
    header: "Position",
  },
  {
    accessorKey: "driver",
    header: "Driver",
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden">
            <CldImage
              src={rowData.driverCode}
              width={32}
              height={32}
              alt={rowData.driverFirstName + ' ' + rowData.driverLastName}
              crop="fill"
              className="object-cover"
            />
          </div>
          <div>
            <div className="font-medium">{rowData.driverFirstName + ' ' + rowData.driverLastName}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "teamName",
    header: "Team",
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 flex items-center justify-center rounded-full">
            <CldImage
              src={rowData.teamName.toLowerCase()}
              width={24}
              height={24}
              alt={rowData.teamCode}
              className="object-contain w-full h-full"
            />
          </div>
          <span>{rowData.teamName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "bestQualiLap",
    header: "Best Quali Lap",
  },
  {
    accessorKey: "gapToPole",
    header: "Gap to Pole",
  },
];

// --- Separate Export Functions ---

async function exportRacePredictions(
  nextRace: any,
  selectedWeather: string,
  racePreds: RacePredictionRow[]
) {
  const weatherLabel = WEATHER_OPTIONS.find(w => w.key === selectedWeather)?.label || 'unknown';
  const filename = `race_prediction_${nextRace.season}_${nextRace.race_name}_${weatherLabel}.csv`.replace(/\s+/g, '_');

  const headers = [
    { key: 'rank', label: 'Position' },
    { key: 'driver_name', label: 'Driver' },
    { key: 'teamName', label: 'Team' },
    { key: 'score', label: 'Score' },
    { key: 'confidence', label: 'Confidence (%)' },
  ];
  const transformers = {
    driver_name: (value: any, row: RacePredictionRow) => `${row.driverFirstName} ${row.driverLastName}`,
    score: (value: number) => value?.toFixed(3) || 'N/A',
    confidence: (value: number) => value?.toFixed(1) || 'N/A',
  };
  const dataPrepared = racePreds.map(row => ({ ...row, driver_name: `${row.driverFirstName} ${row.driverLastName}` }));
  await exportDataAsCSV(dataPrepared, filename, headers, transformers, true);
}

async function exportQualiPredictions(
  nextRace: any,
  selectedWeather: string,
  qualiPreds: QualiPredictionRow[]
) {
  const weatherLabel = WEATHER_OPTIONS.find(w => w.key === selectedWeather)?.label || 'unknown';
  const filename = `quali_prediction_${nextRace.season}_${nextRace.race_name}_${weatherLabel}.csv`.replace(/\s+/g, '_');

  const headers = [
    { key: 'rank', label: 'Position' },
    { key: 'driver_name', label: 'Driver' },
    { key: 'teamName', label: 'Team' },
    { key: 'bestQualiLap', label: 'Best Quali Lap' },
    { key: 'gapToPole', label: 'Gap to Pole' },
  ];
  const transformers = {
    driver_name: (value: any, row: QualiPredictionRow) => `${row.driverFirstName} ${row.driverLastName}`,
  };
  const dataPrepared = qualiPreds.map(row => ({ ...row, driver_name: `${row.driverFirstName} ${row.driverLastName}` }));
  await exportDataAsCSV(dataPrepared, filename, headers, transformers, true);
}


interface RaceQualiPredictionsViewProps {
  drivers: Driver[];
  nextRace: { race_name: string; season: number; round?: number } | null;
}

export function RaceQualiPredictionsView({ drivers, nextRace }: RaceQualiPredictionsViewProps) {
  const [racePredictions, setRacePredictions] = useState<RacePredictionRow[]>([]);
  const [qualiPredictions, setQualiPredictions] = useState<QualiPredictionRow[]>([]);
  const [selectedWeather, setSelectedWeather] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Generating predictions...");
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Confetti effect for Race Podium
  useEffect(() => {
    if (!canvasRef.current || racePredictions.length === 0) return;

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
        origin: { x: 0, y: 0.8 },
        colors: colors,
      });
      myConfetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    return () => {
      myConfetti.reset();
    };
  }, [racePredictions]);


  const handlePredict = async () => {
    if (!nextRace || !selectedWeather) return;

    setIsLoading(true);
    setRacePredictions([]);
    setQualiPredictions([]);
    setError(null);

    const messages = [
      "Initializing VisionF1 unified prediction models...",
      "Simulating track evolution & weather impact...",
      "Running Qualifying simulation...",
      "Analyzing Qualifying impact on Race Strategy...",
      "Running Grand Prix simulation...",
    ];

    const predictionPromise = (async () => {
      try {
        console.log("Predicting All for:", nextRace.race_name, "Weather:", selectedWeather);
        const response = await predictAll(nextRace.race_name, selectedWeather);
        return response;
      } catch (error) {
        console.error("Failed to prevent race+quali:", error);
        return null;
      }
    })();

    // Animation loop
    for (const msg of messages) {
      setLoadingMessage(msg);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    const data = await predictionPromise;

    if (data && data.status === "ok") {
      // Map Quali Data
      if (data.quali_full) {
        const qualiMapped: QualiPredictionRow[] = data.quali_full.map((pred: any) => {
          const driver = drivers.find((d: Driver) => String(d.driverCode).toUpperCase() === String(pred.driver).toUpperCase());
          return {
            driverCode: pred.driver,
            driverFirstName: driver?.firstName ?? pred.driver,
            driverLastName: driver?.lastName ?? "",
            teamName: pred.team ?? driver?.team ?? "Unknown Team",
            teamCode: driver?.teamCode ?? "",
            rank: pred.pred_rank,
            bestQualiLap: pred.pred_best_quali_lap,
            gapToPole: pred.gap_to_pole,
          };
        }).sort((a: any, b: any) => a.rank - b.rank);
        setQualiPredictions(qualiMapped);
      }

      // Map Race Data
      if (data.race_predictions_full) {
        const raceMapped: RacePredictionRow[] = data.race_predictions_full.map((pred: any) => {
          const driver = drivers.find((d: Driver) => String(d.driverCode).toUpperCase() === String(pred.driver).toUpperCase());
          return {
            driverCode: pred.driver,
            driverFirstName: driver?.firstName ?? pred.driver,
            driverLastName: driver?.lastName ?? "",
            teamName: pred.team ?? driver?.team ?? "Unknown Team",
            teamCode: driver?.teamCode ?? "",
            predictedPosition: pred.final_position,
            rank: pred.final_position,
            score: pred.score,
            confidence: pred.confidence,
          };
        }).sort((a: any, b: any) => a.rank - b.rank);
        setRacePredictions(raceMapped);
      }

    } else {
      setError("Unable to generate predictions. Please try again later.");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
      {/* Main Card: Input + Podium */}
      <div className="bg-popover min-h-min flex-1 rounded-xl md:min-h-min p-4">
        <div className="w-full overflow-x-auto">
          <h2 className="text-lg font-semibold pb-6">
            Race + Quali Predictions {nextRace && `- ${nextRace.season} ${nextRace.race_name}`}
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
              className="w-full sm:w-auto min-w-[140px] px-4 py-2 bg-brand text-sm text-black rounded-md hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors h-9"
              onClick={handlePredict}
              disabled={!nextRace || !selectedWeather || isLoading}
            >
              Predict Full Weekend
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
                Simulating full weekend session by session...
              </div>
            </div>
          ) : racePredictions.length > 0 ? (
            <div className="w-full overflow-x-auto relative min-h-[500px]">
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-20" />
              <div className="min-w-[700px] relative z-10">
                {/* We pass racePredictions to Podium. Podium naturally uses 'score' if 'bestQualiLap' is missing. 
                       RacePredictionRow does NOT have bestQualiLap, so it works as intended. */}
                <Podium drivers={racePredictions.slice(0, 3)} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center text-center py-12 gap-8">
              <div className="text-lg font-medium">Select weather conditions to generate a full weekend prediction.</div>

              <div className="text-sm text-muted-foreground max-w-lg space-y-4">
                <p>
                  This advanced model simulates the full race weekend sequence. It first predicts the Qualifying results based on track conditions, and then uses those grid positions alongside race-day simulations to predict the final Grand Prix classification.
                </p>
                <p>
                  These predictions are generated by AI using advanced machine learning models trained by the VisionF1 team.
                </p>
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

      {/* Quali Results Card */}
      {qualiPredictions.length > 0 && (
        <div className="bg-popover min-h-min flex-1 rounded-xl md:min-h-min">
          <div className="p-4 flex flex-col">
            <div className="flex justify-between items-center pb-4">
              <h2 className="text-lg font-semibold">Predicted Qualifying Results</h2>
              <button
                onClick={() => exportQualiPredictions(nextRace, selectedWeather, qualiPredictions)}
                className="flex items-center px-4 py-2 bg-brand text-sm text-black rounded-md hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                disabled={!nextRace}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Quali
              </button>
            </div>
            <DataTable columns={qualiColumns} data={qualiPredictions} />
          </div>
        </div>
      )}

      {/* Race Results Card */}
      {racePredictions.length > 0 && (
        <div className="bg-popover min-h-min flex-1 rounded-xl md:min-h-min">
          <div className="p-4 flex flex-col">
            <div className="flex justify-between items-center pb-4">
              <h2 className="text-lg font-semibold">Predicted Race Results</h2>
              <button
                onClick={() => exportRacePredictions(nextRace, selectedWeather, racePredictions)}
                className="flex items-center px-4 py-2 bg-brand text-sm text-black rounded-md hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                disabled={!nextRace}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Race
              </button>
            </div>
            <DataTable columns={raceColumns} data={racePredictions} />
          </div>
        </div>
      )}
    </div>
  );
}

