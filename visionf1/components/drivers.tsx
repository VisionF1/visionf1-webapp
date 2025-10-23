"use client";

import { useRouter } from "next/navigation"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { CldImage } from "next-cloudinary"

type Driver = {
  firstName: string
  lastName: string
  driverCode: string
  driverNumber: string
  nationalityCode2: string
  nationalityCode3: string
  team: string
  teamCode: string
}

export function DriverImages({ data: drivers }: { data: Driver[] }) {
  const router = useRouter()

  const handleDriverClick = (driver: Driver) => {
    const driverPath = `/drivers/${driver.firstName.toLowerCase()}-${driver.lastName.toLowerCase()}`
    router.push(driverPath)
  }

  return (
    <div className="w-full h-full @container">
      <Carousel className="w-full h-full rounded-xl [&>div]:h-full relative">
        <CarouselContent className="ml-0 h-full">
          {drivers.map((driver) => (
            <CarouselItem key={driver.driverCode} className="basis-full h-full flex items-center justify-between px-4 pl-0 relative">
              {/* Driver Info */}
              <div className="flex flex-col justify-center h-full flex-1 pr-4 pl-4 pr-48">            
                {/* Driver Name */}
                <div className="flex flex-col cursor-pointer" onClick={() => handleDriverClick(driver)}>
                  <span className="text-base @sm:text-lg @md:text-xl text-muted-foreground">
                    {driver.firstName}
                  </span>
                  <span className="text-lg @xs:text-xl @sm:text-2xl @md:text-3xl @lg:text-4xl @[500px]:text-5xl @xl:text-6xl font-black text-primary leading-tight hover:opacity-80 transition-opacity">
                    {driver.lastName.toUpperCase()}
                  </span>
                </div>

                {/* Driver Number */}
                <div className="text-xl @xs:text-xl @sm:text-2xl @md:text-3xl @lg:text-4xl @[1152px]:text-5xl @xl:text-6xl font-black text-primary/50 mb-2">
                  {driver.driverNumber}
                </div>
                
                {/* Team and Flag */}
                <div className="flex items-center gap-2 mt-3">
                  {/* Team Logo */}
                  <div className="h-8 w-8 @sm:h-10 @sm:w-10 rounded">
                    <CldImage
                      src={driver.team}
                      alt={driver.team}
                      width={48}
                      height={48}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  
                  {/* Team Name */}
                  <span className="text-base @sm:text-lg @md:text-xl text-muted-foreground">
                    {driver.team}
                  </span>
                </div>
                
                {/* Nationality */}
                <div className="flex items-center gap-2 mt-2">
                  <img
                    src={`https://flagcdn.com/w40/${driver.nationalityCode2?.toLowerCase()}.png`}
                    alt={driver.nationalityCode3}
                    width="40"
                    height="20"
                    className="rounded"
                  />
                </div>
              </div>

              {/* Driver Image */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 aspect-square h-16 w-16 @2xs:h-20 @2xs:w-20 @xs:h-30 @xs:w-30 @sm:h-32 @sm:w-32 @md:h-36 @md:w-36 @lg:h-40 @lg:w-40 @[1152px]:h-48 @[1152px]:w-48 @xl:h-55 @xl:w-55 rounded-full overflow-hidden bg-brand">
                <CldImage
                  src={driver.driverCode}
                  fill
                  alt={driver.firstName + " " + driver.lastName}
                  crop="fill"
                  className="object-contain"
                  sizes="(max-width: 640px) 100px, (max-width: 1024px) 200px, 300px"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-1/2 -translate-x-10 top-auto -bottom-0" />
        <CarouselNext className="left-1/2 translate-x-2 top-auto -bottom-0" />
      </Carousel>
    </div>
  )
}