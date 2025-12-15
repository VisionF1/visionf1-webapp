"use client";

import { CldImage } from "next-cloudinary"
import { RacePaceRow } from "@/lib/types"

interface HeadToHeadCardProps {
  winner: RacePaceRow;
  loser: RacePaceRow;
  delta: number;
}

export function HeadToHeadCard({ winner, loser, delta }: HeadToHeadCardProps) {
  // Ensure team color starts with #
  const formatColor = (color: string) => color.startsWith('#') ? color : `#${color}`;
  const bgColor = formatColor(winner.team_color);

  // Format delta to 3 decimal places
  const formattedDelta = delta.toFixed(3);

  return (
    <div
      className="relative overflow-hidden rounded-xl h-48 @container shadow-lg transition-transform hover:scale-[1.02]"
      style={{ backgroundColor: bgColor }}
    >
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

      <div className="relative h-full flex items-center justify-between p-6">
        {/* Left Side: Stats & Info */}
        <div className="flex flex-col justify-center gap-1 z-10 max-w-[60%]">
          {/* Winner Name */}
          <h3 className="text-2xl @xs:text-3xl font-black text-white uppercase tracking-tighter leading-none mb-2">
            {winner.driver_last_name}
          </h3>

          {/* Delta */}
          <div className="flex items-baseline gap-1">
            <span className="text-4xl @xs:text-5xl @sm:text-6xl font-black text-white tracking-tighter italic leading-none">
              {formattedDelta}
            </span>
            <span className="text-xl @xs:text-2xl font-bold text-white/90 italic">
              s
            </span>
          </div>

          {/* Comparison Text */}
          <div className="text-sm @xs:text-base font-medium text-white/80 mt-1">
            faster than <span className="text-white font-bold">{loser.driver_last_name.toUpperCase()}</span>
          </div>
        </div>

        {/* Center/Right: Team Logo */}
        <div className="absolute right-24 top-1/2 -translate-y-1/2 opacity-100 w-16 h-16 pointer-events-none z-10 flex items-center justify-center">
          <CldImage
            src={winner.team_name.toLowerCase()}
            alt={winner.team_name}
            width={100}
            height={100}
            className="object-contain w-full h-full drop-shadow-md"
          />
        </div>

        {/* Right Side: Driver Image */}
        <div className="absolute right-2 bottom-0 h-[95%] w-[40%] z-20 flex items-end justify-end">
          <CldImage
            src={winner.driver}
            alt={winner.driver_last_name}
            width={400}
            height={400}
            crop="fill"
            className="object-contain object-bottom h-full w-auto drop-shadow-xl mask-image-linear-to-b"
          />
        </div>
      </div>
    </div>
  )
}
