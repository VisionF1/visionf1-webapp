"use client";

import { useState } from "react";
import Image from "next/image";
import { CldImage } from "next-cloudinary";
import { GenericComboBox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { Strategy, StrategyRow } from "./strategy-row";
import { predictStrategy } from "@/lib/api-requests";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle } from "lucide-react";

interface RaceStrategyAnimationProps {
    races: any[];
}

export function RaceStrategyAnimation({ races }: RaceStrategyAnimationProps) {
    const [selectedRaceId, setSelectedRaceId] = useState<string>("");
    const [showStrategies, setShowStrategies] = useState(false);
    const [animationKey, setAnimationKey] = useState(0);
    const [strategies, setStrategies] = useState<Strategy[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Generating strategies...");
    const [error, setError] = useState<string | null>(null);

    const handlePredict = async () => {
        if (!selectedRaceId) return;

        setIsLoading(true);
        setError(null);
        setShowStrategies(false);

        // Loading simulation messages
        const messages = [
            "Initializing strategy models...",
            "Analyzing tire degradation data...",
            "Simulating pit stop scenarios...",
            "Optimizing race pace..."
        ];

        // Start the API call in the background
        const predictionPromise = (async () => {
            try {
                const race = races.find(r => r.event_id === selectedRaceId);
                const circuit = race?.location;

                // Hardcoded parameters for now as requested/implied, could be made dynamic later
                const track_temp = 50.0;
                const air_temp = 27.0;
                const compounds = ["SOFT", "MEDIUM", "HARD"];
                const max_stops = 3;
                const fia_rule = true;
                const top_k = 3;

                return await predictStrategy(
                    circuit,
                    track_temp,
                    air_temp,
                    compounds,
                    max_stops,
                    fia_rule,
                    top_k
                );
            } catch (err) {
                console.error("Failed to predict strategy:", err);
                return null;
            }
        })();

        // Run the loading simulation loop
        for (const msg of messages) {
            setLoadingMessage(msg);
            await new Promise(resolve => setTimeout(resolve, 800));
        }

        try {
            const response = await predictionPromise;

            if (response && response.predictions) {
                const mappedStrategies: Strategy[] = response.predictions.map((pred: any, index: number) => {
                    // Calculate total laps from the last stint of the prediction
                    const totalLaps = pred.stints[pred.stints.length - 1].end_lap - 1;

                    // Generate a descriptive name based on stop count and compounds
                    // e.g., "1 Stop (Hard - Medium)" or "Fastest Strategy"
                    // Using index 0 as "Optimal"
                    let name = `Option ${index + 1}`;

                    const startCompound = pred.stints[0].compound.toUpperCase();
                    const stops = pred.stints.length - 1;

                    const strategyNames: Record<string, Record<number, string>> = {
                        HARD: { 1: "Conservative", 2: "Inverted", 3: "Late-Push" },
                        MEDIUM: { 1: "Standard", 2: "Balanced", 3: "Push" },
                        SOFT: { 1: "Stretch", 2: "Aggressive", 3: "Sprint" }
                    };

                    const descriptiveName = strategyNames[startCompound]?.[stops] || `Alternative ${index}`;

                    if (index === 0) name = "Optimal Strategy";
                    else name = descriptiveName;

                    const prob = (pred.probability * 100).toFixed(0);
                    name += ` (${prob}% probability)`;

                    return {
                        name: name,
                        totalLaps: totalLaps,
                        stints: pred.stints.map((stint: any, i: number) => ({
                            compound: stint.compound.toLowerCase(),
                            startLap: stint.start_lap - 1,
                            endLap: i === pred.stints.length - 1 ? stint.end_lap - 1 : stint.end_lap
                        }))
                    };
                });

                setStrategies(mappedStrategies);
                setShowStrategies(true);
                setAnimationKey(prev => prev + 1);
            } else {
                throw new Error("Invalid response format");
            }

        } catch (err) {
            setError("Failed to generate strategy predictions. Please try again.");
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
        <div className="flex flex-1 flex-col gap-4 p-0 pt-0">
            <div className="bg-popover min-h-min flex-1 rounded-xl md:min-h-min p-4">
                <div className="w-full overflow-x-auto">
                    <h2 className="text-lg font-semibold pb-6">
                        Race Strategy {selectedRaceName && `- ${selectedRaceYear} ${selectedRaceName}`}
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-4 mb-8 items-end">
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

                        <Button
                            className="w-full sm:w-auto min-w-[140px] px-4 py-2 bg-brand text-sm text-black rounded-md hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            onClick={handlePredict}
                            disabled={!selectedRaceId || isLoading}
                        >
                            {isLoading ? (
                                "Predicting..."
                            ) : (
                                "Predict Race Strategy"
                            )}
                        </Button>
                    </div>

                    {error ? (
                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            <p>{error}</p>
                        </div>
                    ) : isLoading ? (
                        <div className="flex flex-col justify-center items-center h-64 gap-4">
                            <div className="flex items-center">
                                <Spinner className="size-8 mr-3" />
                                <div className="text-xl font-medium animate-pulse">{loadingMessage}</div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Please wait while our AI models analyze the strategy...
                            </div>
                        </div>
                    ) : showStrategies && strategies.length > 0 ? (
                        <>
                            <div className="flex flex-wrap gap-12 py-6">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-20 h-20">
                                        <CldImage
                                            src="soft"
                                            alt="Soft Tire"
                                            width={120}
                                            height={120}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="flex flex-col leading-none">
                                        <span className="font-display font-bold text-3xl uppercase tracking-wide text-[#FF3B30]">
                                            Soft
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="relative w-20 h-20">
                                        <CldImage
                                            src="medium"
                                            alt="Medium Tire"
                                            width={120}
                                            height={120}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="flex flex-col leading-none">
                                        <span className="font-display font-bold text-3xl uppercase tracking-wide text-[#FFCC00]">
                                            Medium
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="relative w-20 h-20">
                                        <CldImage
                                            src="hard"
                                            alt="Hard Tire"
                                            width={120}
                                            height={120}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="flex flex-col leading-none">
                                        <span className="font-display font-bold text-3xl uppercase tracking-wide text-[#F2F2F7]">
                                            Hard
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 mx-auto" key={animationKey}>
                                {strategies.map((strategy, index) => (
                                    <StrategyRow key={index} strategy={strategy} index={index} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col justify-center items-center text-center h-80 gap-10">
                            <div className="text-lg">Select a Grand Prix to generate race strategy predictions.</div>
                            <div className="text-sm text-muted-foreground max-w-md">
                                These predictions are generated by AI using advanced machine learning models trained by the VisionF1 team. Based on tire degradation and pit stop analysis.
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
        </div>
    );
}
