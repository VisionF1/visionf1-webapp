"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { CldImage } from "next-cloudinary"

type Driver = {
  firstName: string
  lastName: string
  driverCode: string
  nationalityCode2: string
  nationalityCode3: string
  team: string
  teamCode: string
}

export function DriverImages({ data: drivers }: { data: Driver[] }) {
  return (
    <div className="@container w-full h-full flex items-center justify-center p-2">
  <Carousel className="w-full mx-auto relative">
        <CarouselContent className="ml-0">
          {drivers.map((driver) => (
            <CarouselItem key={driver.driverCode} className="w-full h-[340px] flex flex-col justify-center items-center overflow-hidden">
              <div className="flex flex-row items-center justify-center w-full">
                <div className="flex flex-col justify-center flex-1">
                  <span className="text-lg font-medium">{driver.firstName}</span>
                  <span className="text-2xl font-bold uppercase">{driver.lastName}</span>
                  <span className="text-sm text-muted-foreground">{driver.team}</span>
                </div>
                <div className="relative aspect-square h-20 w-20 @2xs:h-24 @2xs:w-24 @xs:h-28 @xs:w-28 @sm:h-36 @sm:w-36 @md:h-42 @md:w-42 @lg:h-46 @lg:w-46 @xl:h-56 @xl:w-56 rounded-full overflow-hidden bg-brand">
                  <CldImage
                    src={driver.driverCode}
                    fill
                    alt={driver.firstName + " " + driver.lastName}
                    crop="fill"
                    className="object-contain"
                    sizes="224px"
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
  <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
  <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
      </Carousel>
    </div>
  )
}