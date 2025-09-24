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
                <div className="relative aspect-square w-full max-w-[140px] @sm:max-w-[160px] @md:max-w-[180px] @lg:max-w-[220px] @xl:max-w-[250px] rounded-full overflow-hidden bg-brand">
                  <CldImage
                    src={driver}
                    fill
                    alt={driver}
                    crop="fill"
                    className="object-contain"
                    sizes="(max-width: 480px) 160px, (max-width: 768px) 200px, (max-width: 1024px) 220px, 250px"
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