"use client";

import { useState } from "react";
import Image from "next/image";
import { CldImage } from "next-cloudinary";
import { GenericComboBox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { Strategy, StrategyRow } from "./strategy-row";

const strategies: Strategy[] = [
    {
        name: "Two-Stopper (Aggressive)",
        totalLaps: 57,
        stints: [
            { compound: "soft", startLap: 0, endLap: 14 },
            { compound: "hard", startLap: 14, endLap: 40 },
            { compound: "medium", startLap: 40, endLap: 57 },
        ],
    },
    {
        name: "Two-Stopper (Balanced)",
        totalLaps: 57,
        stints: [
            { compound: "medium", startLap: 0, endLap: 18 },
            { compound: "hard", startLap: 18, endLap: 45 },
            { compound: "soft", startLap: 45, endLap: 57 },
        ],
    },
    {
        name: "One-Stopper",
        totalLaps: 57,
        stints: [
            { compound: "medium", startLap: 0, endLap: 24 },
            { compound: "hard", startLap: 24, endLap: 57 },
        ],
    },
];

interface RaceStrategyAnimationProps {
    races: any[];
}

export function RaceStrategyAnimation({ races }: RaceStrategyAnimationProps) {
    const [selectedRaceId, setSelectedRaceId] = useState<string>("");
    const [showStrategies, setShowStrategies] = useState(false);
    const [animationKey, setAnimationKey] = useState(0);

    const handlePredict = () => {
        if (!selectedRaceId) return;
        setShowStrategies(true);
        setAnimationKey(prev => prev + 1);
    };

    const selectedRaceName = selectedRaceId
        ? races.find(r => r.event_id === selectedRaceId)?.event_name
        : "";

    const selectedRaceYear = selectedRaceId
        ? races.find(r => r.event_id === selectedRaceId)?.season
        : "";

    return (
        <div className="w-full space-y-8 p-6 bg-card rounded-xl border border-border shadow-sm">
            <div className="space-y-2">
                <h2 className="text-2xl font-display font-bold tracking-tight">
                    Race Strategy {selectedRaceName && `- ${selectedRaceYear} ${selectedRaceName}`}
                </h2>
                <p className="text-muted-foreground">
                    Estimated race strategies based on tire degradation and pit stop analysis.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-4 items-end">
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
                    disabled={!selectedRaceId}
                >
                    Predict Race Strategy
                </Button>
            </div>

            {showStrategies ? (
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
                                    Red
                                </span>
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
                                    Yellow
                                </span>
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
                                    White
                                </span>
                                <span className="font-display font-bold text-3xl uppercase tracking-wide text-[#F2F2F7]">
                                    Hard
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6" key={animationKey}>
                        {strategies.map((strategy, index) => (
                            <StrategyRow key={index} strategy={strategy} index={index} />
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex flex-col justify-center items-center text-center h-80 gap-10">
                    <div className="text-lg">Select a Grand Prix to generate race strategy predictions.</div>
                    <div className="text-sm text-muted-foreground max-w-md">
                        These strategies are generated by AI using advanced machine learning models trained by the VisionF1 team.
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
    );
}
