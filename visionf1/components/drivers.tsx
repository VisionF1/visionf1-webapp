"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { CldImage } from "next-cloudinary"

const drivers = [
  "LEC", "HAM", "RUS", "TSU", "ALB", "SAI", "STR", "ALO", "HUL", "BOR",
  "HAD", "LAW", "OCO", "ANT", "GAS", "BEA", "COL", "VER", "NOR", "PIA"
];

export function DriverImages() {
  return (
    <div className="@container w-full h-full flex items-center justify-center p-2">
      <Carousel className="w-full max-w-[90%] mx-auto">
        <CarouselContent className="ml-0">
          {drivers.map((driver) => (
            <CarouselItem key={driver} className="pl-2">
              <div className="flex flex-col items-center justify-center h-full p-1">
                <div className="relative aspect-square w-full max-w-[150px] @sm:max-w-[170px] @md:max-w-[200px] @lg:max-w-[240px] @xl:max-w-[280px] rounded-full overflow-hidden bg-brand">
                  <CldImage
                    src={driver}
                    fill
                    alt={driver}
                    crop="fill"
                    className="object-contain"
                    sizes="280px"
                  />
                </div>
                <span className="mt-3 text-center font-medium bg-primary/20 px-2 py-1 rounded-full whitespace-nowrap text-xs @sm:text-sm">
                  {driver}
                </span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-3" />
        <CarouselNext className="-right-3" />
      </Carousel>
    </div>
  )
}