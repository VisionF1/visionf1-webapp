"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { CldImage } from "next-cloudinary"

const drivers = [
  "LEC", "HAM", "RUS", "TSU", "ALB", "SAI", "STR", "ALO", "HUL", "BOR",
  "HAD", "LAW", "OCO", "ANT", "GAS", "BEA", "COL", "VER", "NOR", "PIA"
];

export function DriverImages() {
  return (
    <Carousel className = "w-full h-full max-w-md mx-auto flex items-center justify-center">
      <CarouselContent>
        {drivers.map((driver) => (
          <CarouselItem key={driver} className="flex flex-col items-center justify-center h-full">
            <CldImage
              src={driver}
              width={200}
              height={200}
              alt={driver}
              crop="fill"
              className="rounded-xl object-contain mx-auto"
            />
            <span className="mt-2 text-lg font-bold text-center text-foreground">{driver}</span>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="mx-8" />
      <CarouselNext className="mx-8" />
    </Carousel >
  )
}