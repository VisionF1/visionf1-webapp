"use client";

import { CldImage } from "next-cloudinary"
import Image from "next/image"

type Driver = {
  firstName: string
  lastName: string
  driverCode: string
  driverNumber: string
  driverNationality: string
  nationalityCode2: string
  nationalityCode3: string
  team: string
  teamCode: string
}

export function DriverHero({ driver }: { driver: Driver }) {
  return (
    <div className="w-full rounded-xl overflow-hidden bg-gradient-to-br from-muted/50 to-muted/40 relative flex flex-col gap-2 p-6 md:p-8 xl:p-5">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
        <div className="text-[250px] sm:text-[300px] md:text-[400px] lg:text-[400px] xl:text-[400px] 2xl:text-[400px] font-black text-white leading-none">
          {driver.driverNumber}
        </div>
      </div>

      {/* Top Content - Driver Info */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Team Logo */}
        <div className="mb-6 xl:mb-4 flex items-center gap-3 justify-center">
          <div className="h-10 w-10 md:h-12 md:w-12 xl:h-10 xl:w-10 rounded bg-white/10 flex items-center justify-center">
            <CldImage
              src={driver.team}
              alt={driver.team}
              width={40}
              height={40}
              className="object-contain w-3/4 h-3/4"
            />
          </div>
          <span className="text-xs md:text-sm xl:text-xs text-white/80 font-medium">{driver.team}</span>
        </div>

        {/* Driver Name */}
        <div className="mb-4 xl:mb-2">
          <span className="block text-sm md:text-lg xl:text-base font-light text-white italic leading-tight mb-1">
            {driver.firstName}
          </span>
          <span className="block text-5xl md:text-7xl xl:text-7xl tracking-wide font-black text-white leading-tight">
            {driver.lastName.toUpperCase()}
          </span>
        </div>

        {/* Driver Details Row */}
        <div className="flex items-center justify-center gap-3 text-xs md:text-sm xl:text-xs text-white font-medium mb-10 xl:mb-6">
          {/* Nationality Flag */}
          <div className="h-5 w-5 rounded overflow-hidden flex-shrink-0">
            <Image
              src={`https://flagcdn.com/${driver.nationalityCode2?.toLowerCase()}.svg`}
              alt={driver.nationalityCode3}
              width={24}
              height={24}
              className="object-contain w-full h-full"
            />
          </div>
          <span>{driver.driverNationality}</span>
          <span className="text-white/50">|</span>
          <span>#{driver.driverNumber}</span>
        </div>
      </div>

      {/* Bottom - Driver Photo (takes up remaining space) */}
        <div className="relative z-10 flex items-end justify-center -mt-8 md:-mt-12 xl:-mt-6 -mx-6 md:-mx-8 xl:-mx-5 -mb-6 md:-mb-8 xl:-mb-5">
        <div className="relative w-full h-auto flex items-end justify-center">
          <CldImage
            src={`${driver.driverCode}_full`}
            width={300}
            height={400}
            alt={`${driver.firstName} ${driver.lastName}`}
            className="object-contain h-150 sm:h-200 md:h-200 lg:h-200 xl:h-150 2xl:h-200 w-auto max-w-none"
          />
        </div>
      </div>
    </div>
  )
}
