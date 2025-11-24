"use client";

import { useState } from "react";
import { CldImage } from "next-cloudinary";
import { GenericComboBox } from "@/components/ui/combobox";
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
    return (
        <div className="w-full space-y-8 p-6 bg-card rounded-xl border border-border shadow-sm">
            <div className="space-y-2">
                <h2 className="text-2xl font-display font-bold tracking-tight">
                    Predicted Strategies
                </h2>
                <p className="text-muted-foreground">
                    Estimated race strategies based on tire degradation and pit stop analysis.
                </p>
            </div>

            <div className="mb-4">
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
            </div>

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

            <div className="space-y-6" key={selectedRaceId || "default"}>
                {strategies.map((strategy, index) => (
                    <StrategyRow key={index} strategy={strategy} index={index} />
                ))}
            </div>


        </div>
    );
}
