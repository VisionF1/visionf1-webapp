"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { CldImage } from "next-cloudinary";
import { cn } from "@/lib/utils";
import { RacePredictionRow } from "@/lib/types";

interface PodiumProps {
  drivers: RacePredictionRow[];
}

export function Podium({ drivers }: PodiumProps) {
  const podiumOrder = [drivers[1], drivers[0], drivers[2]];

  useEffect(() => {
    const end = Date.now() + 1000;
    const colors = ["#eab308", "#ef4444", "#3b82f6"];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);


  if (!drivers || drivers.length === 0) return null;

  return (
    <div className="w-full flex flex-col items-center justify-end min-h-[450px] mb-6 relative">
      <div className="absolute top-0 w-full h-full bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none rounded-xl" />
      <div className="flex items-end justify-center gap-4 md:gap-8 w-full max-w-4xl z-10 px-4 mt-6">
        {podiumOrder.map((driver, index) => {
          if (!driver) return null;
          const position = index === 1 ? 1 : index === 0 ? 2 : 3;
          const heightClass = position === 1 ? "h-64 md:h-80" : position === 2 ? "h-48 md:h-60" : "h-32 md:h-44";
          const colorStyles = position === 1
            ? "bg-gradient-to-t from-yellow-600/40 to-yellow-500/10 border-t-4 border-yellow-500 text-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.1)]"
            : position === 2
              ? "bg-gradient-to-t from-gray-500/40 to-gray-400/10 border-t-4 border-gray-400 text-gray-400 shadow-[0_0_30px_rgba(156,163,175,0.1)]"
              : "bg-gradient-to-t from-orange-700/40 to-orange-600/10 border-t-4 border-orange-600 text-orange-600 shadow-[0_0_30px_rgba(234,88,12,0.1)]";
          const delay = position === 1 ? 0.4 : position === 2 ? 0.2 : 0.6;

          return (
            <motion.div
              key={driver.driverCode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: delay }}
              className="flex flex-col items-center w-1/3 max-w-[200px]"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: delay + 0.2, duration: 0.4, type: "spring" }}
                className="relative mb-4 group"
              >
                <div className={cn(
                  "w-20 h-20 md:w-28 md:h-28 rounded-full border-4 overflow-hidden shadow-2xl relative z-10 bg-[#0f172a]",
                  position === 1 ? "border-yellow-500 shadow-yellow-500/30" :
                    position === 2 ? "border-gray-400 shadow-gray-400/30" : "border-orange-600 shadow-orange-600/30"
                )}>
                  <CldImage src={driver.driverCode} width={120} height={120} alt={driver.driverLastName} crop="fill" className="object-cover w-full h-full" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-slate-900 rounded-full p-1.5 border border-slate-700 z-20 shadow-lg">
                  <CldImage src={driver.teamName.toLowerCase()} width={24} height={24} alt={driver.teamCode || "Team"} className="object-contain w-6 h-6" />
                </div>
              </motion.div>
              <div className="text-center mb-3 z-20">
                <p className="font-bold text-sm md:text-lg text-white truncate max-w-[120px] md:max-w-none leading-tight">
                  {driver.driverFirstName} <br className="hidden md:block" /> {driver.driverLastName}
                </p>
              </div>
              <div className={cn("w-full relative flex justify-center items-end rounded-t-lg", heightClass)}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "100%" }}
                  transition={{ duration: 0.8, delay: delay, ease: "easeOut" }}
                  className={cn("w-full absolute bottom-0 rounded-t-lg flex flex-col justify-start items-center pt-4 backdrop-blur-md", colorStyles)}
                >
                  <span className="text-4xl md:text-6xl font-black opacity-40 select-none mix-blend-overlay">{position}</span>
                  <div className="mt-auto mb-4 text-xs font-mono opacity-70 font-semibold bg-black/20 px-2 py-1 rounded">
                    {driver.predictedPosition.toFixed(2)} pts
                  </div>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
