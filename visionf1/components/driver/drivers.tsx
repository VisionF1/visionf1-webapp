"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import SpotlightCard from "@/components/ui/spot-light"
import { DriverCard, DriverImage } from "@/components/driver/driver-card"
import { Driver } from "@/lib/types"


export function DriverImages({ data: drivers }: { data: Driver[] }) {
  return (
    <SpotlightCard className="w-full h-full bg-transparent border-none" spotlightColor="rgba(255, 255, 255, 0.1)">
      <div className="w-full h-full @container">
        <Carousel className="w-full h-full rounded-xl [&>div]:h-full relative">
          <CarouselContent className="ml-0 h-full">
            {drivers.map((driver) => (
              <CarouselItem key={driver.driverCode} className="basis-full h-full flex items-center justify-between px-4 pl-0 relative">
                <DriverCard driver={driver} />
                <DriverImage driver={driver} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-1/2 -translate-x-10 top-auto -bottom-0" />
          <CarouselNext className="left-1/2 translate-x-2 top-auto -bottom-0" />
        </Carousel>
      </div>
    </SpotlightCard>
  )
}