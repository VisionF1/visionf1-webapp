"use client";

import { useRouter } from "next/navigation"
import Image from "next/image"
import { CldImage } from "next-cloudinary"
import { Driver } from "@/lib/types"


export function DriverCard({ driver }: { driver: Driver }) {
  const router = useRouter()

  const handleDriverClick = () => {
    const firstName = driver.firstName.toLowerCase().replace(/ü/g, 'u')
    const lastName = driver.lastName.toLowerCase().replace(/ü/g, 'u')
    const driverPath = `/drivers/${firstName}-${lastName}`
    router.push(driverPath)
  }

  return (
    <div className="@container flex flex-col justify-center h-full flex-1 pr-4 pl-4">
      {/* Driver Name */}
      <div className="flex flex-col cursor-pointer" onClick={handleDriverClick}>
        <span className="text-sm @xs:text-base @sm:text-lg @md:text-xl @lg:text-2xl @xl:text-3xl @2xl:text-4xl @4xl:text-5xl text-muted-foreground">
          {driver.firstName}
        </span>
        <span className="text-lg @xs:text-2xl @sm:text-3xl @md:text-4xl @lg:text-4xl @xl:text-5xl @2xl:text-6xl @4xl:text-7xl font-black text-primary leading-tight hover:opacity-80 transition-opacity">
          {driver.lastName.toUpperCase()}
        </span>
      </div>

      {/* Driver Number */}
      <div className="text-lg @xs:text-xl @sm:text-2xl @md:text-3xl @lg:text-4xl @xl:text-5xl @2xl:text-6xl @4xl:text-7xl font-black text-primary/50 mb-0 @xs:mb-1 @sm:mb-2 @md:mb-4">
        {driver.driverNumber}
      </div>
      
      {/* Nationality */}
      <div className="flex items-center gap-2 mt-3">
        <div className="h-8 w-8 @xs:h-9 @xs:w-9 @sm:h-10 @sm:w-10 @md:h-11 @md:w-11 @lg:h-12 @lg:w-12 @xl:h-14 @xl:w-14 @2xl:h-16 @2xl:w-16 @4xl:h-20 @4xl:w-20 rounded">
          <Image
            src={`https://flagcdn.com/${driver.nationalityCode2?.toLowerCase()}.svg`}
            alt={driver.nationalityCode3}
            width={100}
            height={100}
            className="object-contain w-full h-full"
          />
        </div>
        
        {/* Nationality Name */}
        <span className="text-xs @xs:text-xs @sm:text-base @md:text-lg @lg:text-xl @xl:text-2xl @2xl:text-3xl text-muted-foreground">
          {driver.driverNationality}
        </span>
      </div>
      
      {/* Team and Logo */}
      <div className="flex items-center gap-2 mt-2">
        {/* Team Logo */}
        <div className="h-8 w-8 @xs:h-9 @xs:w-9 @sm:h-10 @sm:w-10 @md:h-11 @md:w-11 @lg:h-12 @lg:w-12 @xl:h-14 @xl:w-14 @2xl:h-16 @2xl:w-16 @4xl:h-20 @4xl:w-20 rounded">
          <CldImage
            src={driver.team}
            alt={driver.team}
            width={100}
            height={100}
            className="object-contain w-full h-full"
          />
        </div>
        
        {/* Team Name */}
        <span className="text-sm @xs:text-base @sm:text-lg @md:text-xl @lg:text-2xl @xl:text-3xl @2xl:text-4xl @4xl:text-5xl text-sidebar-primary">
          {driver.team}
        </span>
      </div>
    </div>
  )
}

export function DriverImage({ driver, useTeamColor = false }: { driver: Driver; useTeamColor?: boolean }) {
  const router = useRouter()

  const handleDriverClick = () => {
    const firstName = driver.firstName.toLowerCase().replace(/ü/g, 'u')
    const lastName = driver.lastName.toLowerCase().replace(/ü/g, 'u')
    const driverPath = `/drivers/${firstName}-${lastName}`
    router.push(driverPath)
  }

  const bgColor = useTeamColor && driver.teamColor 
    ? (driver.teamColor.startsWith('#') ? driver.teamColor : `#${driver.teamColor}`)
    : undefined

  return (
    <div 
      className={`absolute right-4 top-1/2 -translate-y-1/2 aspect-square h-20 w-20 @2xs:h-24 @2xs:w-24 @xs:h-28 @xs:w-28 @sm:h-36 @sm:w-36 @md:h-42 @md:w-42 @lg:h-46 @lg:w-46 @xl:h-56 @xl:w-56 @4xl:h-80 @4xl:w-80 rounded-full overflow-hidden border-2 border-sidebar-primary cursor-pointer hover:opacity-80 transition-opacity ${!useTeamColor ? 'bg-brand' : ''}`}
      style={bgColor ? { backgroundColor: bgColor } : undefined}
      onClick={handleDriverClick}
    >
      <CldImage
        src={driver.driverCode}
        fill
        alt={driver.firstName + " " + driver.lastName}
        crop="fill"
        className="object-contain"
        sizes="(max-width: 640px) 200px, (max-width: 1024px) 200px, 300px"
      />
    </div>
  )
}
