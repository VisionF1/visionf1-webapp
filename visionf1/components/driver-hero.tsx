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
    <div className="w-full rounded-xl overflow-hidden bg-gradient-to-br from-muted/50 to-muted/40 relative flex flex-col gap-2 p-6 @md:p-8 @lg:p-6 @container">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
        <div className="text-[200px] @sm:text-[250px] @md:text-[300px] @lg:text-[350px] @xl:text-[400px] font-black text-white leading-none">
          {driver.driverNumber}
        </div>
      </div>

      {/* Top Content - Driver Info */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Team Logo */}
        <div className="mb-6 @md:mb-4 @lg:mb-6 flex items-center gap-3 justify-center">
          <div className="h-10 w-10 @md:h-12 @md:w-12 @lg:h-10 @lg:w-10 rounded bg-white/10 flex items-center justify-center">
            <CldImage
              src={driver.team}
              alt={driver.team}
              width={40}
              height={40}
              className="object-contain w-3/4 h-3/4"
            />
          </div>
          <span className="text-xs @md:text-sm @lg:text-xs text-white/80 font-medium">{driver.team}</span>
        </div>

        {/* Driver Name */}
        <div className="mb-4 @md:mb-2 @lg:mb-4">
          <span className="block text-sm @md:text-lg @lg:text-base font-light text-white italic leading-tight mb-1">
            {driver.firstName}
          </span>
          <span className="block text-5xl @md:text-6xl @lg:text-6xl @xl:text-7xl tracking-wide font-black text-white leading-tight">
            {driver.lastName.toUpperCase()}
          </span>
        </div>

        {/* Driver Details Row */}
        <div className="flex items-center justify-center gap-3 text-xs @md:text-sm @lg:text-xs text-white font-medium mb-10 @md:mb-10 @lg:mb-8">
          {/* Nationality Flag */}
          <div className="h-5 w-5 @md:h-5 @md:w-5 rounded overflow-hidden flex-shrink-0">
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
        <div className="relative z-10 flex items-end justify-center -mt-8 @md:-mt-12 @lg:-mt-8 -mx-6 @md:-mx-8 @lg:-mx-6 -mb-6 @md:-mb-8 @lg:-mb-6">
        <div className="relative w-full h-auto flex items-end justify-center">
          <CldImage
            src={`${driver.driverCode}_full`}
            width={300}
            height={400}
            alt={`${driver.firstName} ${driver.lastName}`}
            className="object-contain h-120 @sm:h-140 @md:h-160 @lg:h-180 @xl:h-200 w-auto max-w-none"
          />
        </div>
      </div>
    </div>
  )
}
