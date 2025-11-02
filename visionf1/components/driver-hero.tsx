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
    <div className="w-full rounded-xl overflow-hidden bg-gradient-to-br from-muted/50 to-muted/40 relative flex flex-col gap-2 p-6 md:p-8">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
        <div className="text-[250px] sm:text-[300px] md:text-[350px] lg:text-[120px] xl:text-[300px] 2xl:text-[400px] font-black text-white leading-none">
          {driver.driverNumber}
        </div>
      </div>

      {/* Top Content - Driver Info */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Team Logo */}
        <div className="mb-6 flex items-center gap-3 justify-center">
          <div className="h-10 w-10 md:h-12 md:w-12 rounded bg-white/10 flex items-center justify-center">
            <CldImage
              src={driver.team}
              alt={driver.team}
              width={40}
              height={40}
              className="object-contain w-3/4 h-3/4"
            />
          </div>
          <span className="text-xs md:text-sm text-white/80 font-medium">{driver.team}</span>
        </div>

        {/* Driver Name */}
        <div className="mb-4">
          <span className="block text-sm md:text-lg font-light text-white italic leading-tight mb-1">
            {driver.firstName}
          </span>
          <span className="block text-3xl md:text-7xl tracking-wide font-black text-white leading-tight">
            {driver.lastName.toUpperCase()}
          </span>
        </div>

        {/* Driver Details Row */}
        <div className="flex items-center justify-center gap-3 text-xs md:text-sm text-white font-medium mb-10">
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
        <div className="relative z-10 flex items-end justify-center -mt-8 md:-mt-12 -mx-6 md:-mx-8 -mb-6 md:-mb-8">
        <div className="relative w-full h-auto flex items-end justify-center">
          <CldImage
            src={`${driver.driverCode}_full`}
            width={300}
            height={400}
            alt={`${driver.firstName} ${driver.lastName}`}
            className="object-contain h-150 sm:h-200 md:h-200 lg:h-200 xl:h-200 2xl:h-200 w-auto max-w-none"
          />
        </div>
      </div>
    </div>
  )
}
