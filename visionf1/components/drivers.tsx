"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { CldImage } from "next-cloudinary"

const drivers = [
  "LEC", "HAM", "RUS", "TSU", "ALB", "SAI", "STR", "ALO", "HUL", "BOR",
  "HAD", "LAW", "OCO", "ANT", "GAS", "BEA", "COL", "VER", "NOR", "PIA"
];

/*export function DriverImages() {
  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <Carousel className="w-full max-w-xs mx-auto">
        <CarouselContent className="ml-0">
          {drivers.map((driver) => (
            <CarouselItem 
              key={driver} 
              className="flex flex-col items-center justify-center pb-2"
            >
              <div className="flex items-center justify-center">
                <CldImage
                  src={driver}
                  width={200}
                  height={200}
                  alt={driver}
                  crop="fill"
                  className="rounded-xl object-contain"
                />
              </div>
              <span className="text-[0.55rem] bg-primary/20 px-1.5 py-0.5 rounded-full whitespace-nowrap mt-1">
                {driver}
              </span>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-2"/>
        <CarouselNext className="-right-2"/>
      </Carousel>
    </div>
  )
}*/

/*export function DriverImages() {
  return (
    <Carousel className = "w-full h-full max-w-3xs lg:max-w-2xs 3xl:max-w-sm mx-auto flex items-center justify-center">
      <CarouselContent>
        {drivers.map((driver) => (
          <CarouselItem key={driver} className="flex flex-col items-center justify-center h-full">
            <div style={{ width: "clamp(150px, 11vw, 220px)", height: "clamp(150px, 11vw, 220px)" }}>
              <CldImage
                src={driver}
                width={400}
                height={400}
                alt={driver}
                crop="fill"
                className="object-contain w-full h-full"
              />
            </div>
            <span className="mt-2 text-sm lg:text-base 3xl:text-lg font-bold text-center text-foreground bg-primary/20 px-4 py-0.5 rounded-full whitespace-nowrap">{driver}</span>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel >
  )
}*/

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