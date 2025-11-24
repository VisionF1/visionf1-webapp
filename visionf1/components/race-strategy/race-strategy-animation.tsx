"use client";

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

export function RaceStrategyAnimation() {
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

            <div className="space-y-6">
                {strategies.map((strategy, index) => (
                    <StrategyRow key={index} strategy={strategy} index={index} />
                ))}
            </div>

            <div className="flex gap-4 text-sm text-muted-foreground pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF3B30]" /> Soft
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FFCC00]" /> Medium
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#F2F2F7]" /> Hard
                </div>
            </div>
        </div>
    );
}
