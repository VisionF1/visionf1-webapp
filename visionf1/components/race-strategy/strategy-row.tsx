"use client";

import { motion } from "framer-motion";
import { Tire } from "./tire";
import { cn } from "@/lib/utils";

export interface Stint {
    compound: "soft" | "medium" | "hard";
    startLap: number;
    endLap: number;
}

export interface Strategy {
    name: string;
    stints: Stint[];
    totalLaps: number;
}

interface StrategyRowProps {
    strategy: Strategy;
    index: number;
}

export function StrategyRow({ strategy, index }: StrategyRowProps) {
    const colors = {
        soft: "bg-[#FF3B30]",
        medium: "bg-[#FFCC00]",
        hard: "bg-[#F2F2F7]",
    };

    return (
        <div className="flex flex-col gap-2 py-4 pl-2 pr-8">
            <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold uppercase tracking-wider text-foreground">
                    {strategy.name.split(" (")[0]}
                    {strategy.name.includes(" (") && (
                        <span className="text-muted-foreground font-normal text-base normal-case tracking-normal ml-2">
                            ({strategy.name.split(" (")[1]}
                        </span>
                    )}
                </h3>
                <span className="text-sm text-muted-foreground">
                    {strategy.stints.length - 1} Stops
                </span>
            </div>

            <div className="relative h-16 w-full rounded-xl bg-muted/20">
                {/* Track Line */}
                <div className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 bg-muted-foreground/20" />

                <div className="relative h-full w-full flex items-center">
                    {strategy.stints.map((stint, i) => {
                        const duration = (stint.endLap - stint.startLap) * 0.05; // Adjust speed
                        const widthPercent =
                            ((stint.endLap - stint.startLap) / strategy.totalLaps) * 100;

                        // Calculate delay based on previous stints
                        const delay = strategy.stints
                            .slice(0, i)
                            .reduce((acc, s) => acc + (s.endLap - s.startLap) * 0.05, 0);

                        return (
                            <div
                                key={i}
                                className="relative h-full flex items-center"
                                style={{ width: `${widthPercent}%` }}
                            >
                                {/* Trail */}
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration, delay, ease: "linear" }}
                                    className={cn("h-2 rounded-full", colors[stint.compound])}
                                    style={{
                                        maskImage: i === 0
                                            ? "linear-gradient(to right, black 0px, black calc(100% - 48px), transparent 100%)"
                                            : "linear-gradient(to right, transparent 0px, black 48px, black calc(100% - 48px), transparent 100%)",
                                        WebkitMaskImage: i === 0
                                            ? "linear-gradient(to right, black 0px, black calc(100% - 48px), transparent 100%)"
                                            : "linear-gradient(to right, transparent 0px, black 48px, black calc(100% - 48px), transparent 100%)"
                                    }}
                                />

                                {/* Tire - Only show if it's the active stint being drawn? 
                    Or maybe just one tire that moves across the whole thing?
                    Let's try one tire per stint that appears and disappears, 
                    or a single tire that translates. 
                    
                    Simpler approach for "one tire rolling":
                    We need a separate absolute positioned tire that moves across the whole parent.
                */}
                            </div>
                        );
                    })}

                    {/* The Rolling Tire */}
                    {/* We need to animate this tire across the entire timeline, changing color. */}
                    {/* Actually, let's put the tire inside the map above? No, it needs to be continuous. */}

                    <TireRunner strategy={strategy} />
                </div>
            </div>

            {/* Legend/Labels */}
            <div className="relative w-full h-6 text-xs text-muted-foreground mt-1">
                {strategy.stints.map((stint, i) => {

                    const segmentDuration = (stint.endLap - stint.startLap) * 0.05;
                    const startTime = strategy.stints
                        .slice(0, i)
                        .reduce((acc, s) => acc + (s.endLap - s.startLap) * 0.05, 0);
                    const totalDelay = startTime + segmentDuration;

                    return (
                        <motion.span
                            key={i}
                            className="absolute -translate-x-1/2 whitespace-nowrap"
                            style={{ left: `${(stint.endLap / strategy.totalLaps) * 100}%` }}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: totalDelay, duration: 0.3 }}
                        >
                            Lap {stint.endLap}
                        </motion.span>
                    );
                })}
            </div>
        </div>
    );
}

function TireRunner({ strategy }: { strategy: Strategy }) {
    // We need to sequence the tire's movement and color changes.
    // This is a bit tricky with pure CSS/Framer Motion props without complex state.
    // Alternative: Render a tire for each stint, but only show it when that stint is animating.

    return (
        <>
            {strategy.stints.map((stint, i) => {
                const segmentDuration = (stint.endLap - stint.startLap) * 0.05;
                const startTime = strategy.stints
                    .slice(0, i)
                    .reduce((acc, s) => acc + (s.endLap - s.startLap) * 0.05, 0);

                // We want the tire to move from startLap% to endLap%
                const startPct = (stint.startLap / strategy.totalLaps) * 100;
                const endPct = (stint.endLap / strategy.totalLaps) * 100;

                return (
                    <motion.div
                        key={i}
                        className="absolute top-1/2 -translate-y-1/2 z-10 will-change-transform"
                        initial={{ left: `${startPct}%`, opacity: 0 }}
                        animate={{
                            left: `${endPct}%`,
                            opacity: 1
                        }}
                        transition={{
                            left: { duration: segmentDuration, delay: startTime, ease: "linear" },
                            opacity: { duration: 0, delay: startTime } // Appear instantly at start
                        }}
                    >
                        <Tire
                            compound={stint.compound}
                            className="w-10 h-10 -ml-5"
                            duration={segmentDuration}
                            delay={startTime}
                        />
                    </motion.div>
                );
            })}
        </>
    )
}
