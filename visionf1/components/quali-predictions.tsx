"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Podium } from "@/components/podium";
import { CldImage } from "next-cloudinary";
import { QualiPredictionRow, Driver } from "@/lib/types";
import { Download, Frown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GenericComboBox } from "@/components/ui/combobox";
import { predictQuali } from "@/lib/api-requests";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { exportDataAsCSV } from "@/lib/csv-utils";
import { WEATHER_OPTIONS } from "@/lib/prediction-data";

// Exports Quali Prediction data as CSV with proper formatting
export function exportQualiPredictionsAsCSV(data: QualiPredictionRow[], filename: string): Promise<void> {
  const headers = [
    { key: 'rank', label: 'Position' },
    { key: 'driver_name', label: 'Driver' },
    { key: 'teamName', label: 'Team' },
    { key: 'bestQualiLap', label: 'Best Quali Lap' },
    { key: 'gapToPole', label: 'Gap to Pole' },
  ];

  const fieldTransformers = {
    driver_name: (value: any, row: QualiPredictionRow) =>
      `${row.driverFirstName} ${row.driverLastName}`,
  };

  // Add calculated field for driver name
  const dataWithDriverName = data.map(row => ({
    ...row,
    driver_name: `${row.driverFirstName} ${row.driverLastName}`
  }));

  return exportDataAsCSV(dataWithDriverName, filename, headers, fieldTransformers, true);
}

const columns: ColumnDef<QualiPredictionRow>[] = [
  {
    accessorKey: "rank",
    header: "Position",
  },
  {
    accessorKey: "driver",
    header: "Driver",
    cell: ({ row }) => {
      const pred_row = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden">
            <CldImage
              src={pred_row.driverCode}
              width={32}
              height={32}
              alt={pred_row.driverFirstName + ' ' + pred_row.driverLastName}
              crop="fill"
              className="object-cover"
            />
          </div>
          <div>
            <div className="font-medium">{pred_row.driverFirstName + ' ' + pred_row.driverLastName}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "teamName",
    header: "Team",
    cell: ({ row }) => {
      const pred_row = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 flex items-center justify-center rounded-full">
            <CldImage
              src={pred_row.teamName.toLowerCase()}
              width={24}
              height={24}
              alt={pred_row.teamCode}
              className="object-contain w-full h-full"
            />
          </div>
          <span>{pred_row.teamName}</span>
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


interface QualiPredictionsViewProps {
  drivers: Driver[];
  nextRace: { race_name: string; season: number; round?: number } | null;
}

export function QualiPredictionsView({ drivers, nextRace }: QualiPredictionsViewProps) {
  const [predictions, setPredictions] = useState<QualiPredictionRow[]>([]);
  const [selectedWeather, setSelectedWeather] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Generating predictions...");
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    if (!nextRace || !selectedWeather) return;

    setIsLoading(true);
    setPredictions([]);
    setError(null);

    // Loading simulation messages
    const messages = [
      "Initializing VisionF1 qualifying prediction models...",
      "Analyzing historical lap times...",
      "Simulating track evolution & weather impact...",
      "Calculating optimal fuel loads...",
    ];

    // Start the API call in the background
    const predictionPromise = (async () => {
      try {
        console.log("Predicting Quali for:", nextRace.race_name, "Weather:", selectedWeather);
        // Note: predictQuali returns { status: "ok", quali_predicts: [...] }
        const response = await predictQuali(nextRace.race_name, selectedWeather);
        return response.quali_predicts;
      } catch (error) {
        console.error("Failed to predict quali:", error);
        return null;
      }
    })();

    // Run the loading simulation loop
    for (const msg of messages) {
      setLoadingMessage(msg);
      await new Promise(resolve => setTimeout(resolve, 800)); // 800ms * 4
    }

    // Wait for the actual prediction if it's not done yet
    const preds = await predictionPromise;

    if (preds && preds.length > 0) {
      const predictions_enhanced: QualiPredictionRow[] = preds.map((pred: any) => {
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

      setPredictions(predictions_enhanced);
    } else {
      setError("Unable to generate qualifying predictions at this time. Our AI models are currently unavailable. Please try again later.");
    }

    setIsLoading(false);
  };

  const handleExportCSV = async () => {
    if (predictions.length === 0 || !nextRace) return;

    const weatherLabel = WEATHER_OPTIONS.find(w => w.key === selectedWeather)?.label || 'unknown';
    const filename = `quali_prediction_${nextRace.season}_${nextRace.race_name}_${weatherLabel}.csv`.replace(/\s+/g, '_');
    await exportQualiPredictionsAsCSV(predictions, filename);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
      <div className="bg-popover min-h-min flex-1 rounded-xl md:min-h-min p-4">
        <div className="w-full overflow-x-auto">
          <h2 className="text-lg font-semibold pb-6">
            Quali Predictions {nextRace && `- ${nextRace.season} ${nextRace.race_name}`}
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
              Predict Quali
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
                Please wait while our AI models process the qualifying data...
              </div>
            </div>
          ) : predictions.length > 0 ? (
            <div className="w-full overflow-x-auto relative">
              <div className="min-w-[700px] relative z-10">
                <Podium drivers={predictions.slice(0, 3)} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center text-center h-80 gap-10">
              <div className="text-lg">Select weather conditions to generate a qualifying prediction for {nextRace?.race_name || "the next Grand Prix"}.</div>
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
              <h2 className="text-lg font-semibold">Predicted Qualifying Classification</h2>
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
