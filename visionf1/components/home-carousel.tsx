"use client"

import * as React from "react"
import { CldImage } from "next-cloudinary"
import Autoplay from "embla-carousel-autoplay"
import { Trophy, Crown } from "lucide-react"
import { ChampionshipBattleChart } from "@/components/charts/championship-battle-chart"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"


export function HomeCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 7000, stopOnInteraction: true })
  )
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1)
    }
    api.on("select", handleSelect)
    return () => {
      api.off("select", handleSelect)
    }
  }, [api])

  return (
    <div className="group relative w-full h-full rounded-xl overflow-hidden">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full h-full [&>div]:h-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="h-full ml-0">

          {/* Slide 1: Championship Battle Area Chart */}
          <CarouselItem className="pl-0 h-full">
            <div className="h-full w-full @container relative overflow-hidden flex flex-col pt-0 px-0">

              {/* Header matching ModelsCard */}
              <div className="px-4 py-3 pb-0 z-20">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground/90">
                  <div className="p-1 rounded-md bg-orange-500/10 text-orange-500">
                    <Trophy className="h-4 w-4" />
                  </div>
                  Championship Battle
                </div>
              </div>

              {/* Chart Container */}
              <div className="flex-1 w-full min-h-0 flex items-center justify-center">
                <div className="w-full h-full pb-0 px-6">
                  <ChampionshipBattleChart />
                </div>
              </div>

            </div>
          </CarouselItem>

          {/* Slide 2: Lando Norris Champion Card */}
          <CarouselItem className="pl-0 h-full">
            <div className="h-full w-full @container relative overflow-hidden flex flex-col pt-4 px-6">

              {/* Background Decorations */}
              <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 pointer-events-none">
                <Trophy className="w-48 h-48 text-yellow-500" />
              </div>

              {/* Title Section (Full Width, Centered) */}
              <div className="z-10 w-full flex items-center justify-center gap-3 mb-1 shrink-0">
                <Crown className="w-4 h-4 text-yellow-500 fill-yellow-500 animate-pulse" />
                <span className="text-yellow-500 font-bold tracking-[0.2em] uppercase text-xs @sm:text-sm shadow-black drop-shadow-sm text-center">2025 World Drivers' Champion</span>
                <Crown className="w-4 h-4 text-yellow-500 fill-yellow-500 animate-pulse" />
              </div>

              {/* Content Split: Left (Centered Text) vs Right (Bottom Image) */}
              <div className="flex-1 w-full flex justify-between z-10 min-h-0">

                {/* Left: Name & Team (Vertically Centered) */}
                <div className="flex flex-col justify-center gap-2">
                  <div className="flex flex-col leading-none">
                    <span className="text-muted-foreground text-lg @md:text-xl font-light tracking-wide uppercase">Lando</span>
                    <span className="text-foreground text-3xl @md:text-4xl @lg:text-5xl font-black italic uppercase tracking-tighter">Norris</span>
                  </div>

                  <div className="flex items-center gap-2 mt-2 opacity-100">
                    <div className="h-8 w-8 relative transition-all">
                      <CldImage
                        src="McLaren"
                        alt="McLaren"
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground">McLaren</span>
                  </div>
                </div>

                {/* Right: Image (Bottom Aligned) */}
                <div className="h-full flex items-end justify-end">
                  <div className="relative h-40 w-40 @md:h-52 @md:w-52 filter drop-shadow-[0_0_15px_rgba(255,165,0,0.3)]">
                    <CldImage
                      src="NOR"
                      alt="Lando Norris"
                      fill
                      className="object-contain object-bottom"
                    />
                  </div>
                </div>

              </div>

            </div>
          </CarouselItem>

          {/* Slide 3: McLaren Constructors Champion Card */}
          <CarouselItem className="pl-0 h-full">
            <div className="h-full w-full @container relative overflow-hidden flex flex-col pt-4 px-6">

              {/* Background Decorations */}
              <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 pointer-events-none">
                <Trophy className="w-48 h-48 text-yellow-500" />
              </div>

              {/* Title Section (Full Width, Centered) */}
              <div className="z-10 w-full flex items-center justify-center gap-3 mb-1 shrink-0">
                <Crown className="w-4 h-4 text-yellow-500 fill-yellow-500 animate-pulse" />
                <span className="text-yellow-500 font-bold tracking-[0.2em] uppercase text-xs @sm:text-sm shadow-black drop-shadow-sm text-center">2025 World Constructors' Champion</span>
                <Crown className="w-4 h-4 text-yellow-500 fill-yellow-500 animate-pulse" />
              </div>

              {/* Content Split: Left (Centered Text) vs Right (Stack: Logo + Car) */}
              <div className="flex-1 w-full flex justify-between z-10 min-h-0">

                {/* Left: Team Name & Drivers */}
                <div className="flex flex-col justify-center gap-4">
                  <div className="flex flex-col leading-none">
                    <span className="text-foreground text-3xl @md:text-4xl @lg:text-5xl font-black italic tracking-tighter">McLaren</span>
                  </div>

                  {/* Drivers */}
                  <div className="flex flex-col gap-1 opacity-90">
                    <span className="text-sm @md:text-base font-medium text-muted-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Lando Norris
                    </span>
                    <span className="text-sm @md:text-base font-medium text-muted-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Oscar Piastri
                    </span>
                  </div>
                </div>

                {/* Right: Stack (Hero Logo + Car) */}
                <div className="h-full flex flex-col items-end justify-end mb-10 mr-2 @md:mr-12 gap-4 z-10">
                  {/* Big McLaren Logo (Hero) */}
                  <div className="relative h-32 w-32 @md:h-48 @md:w-48 filter drop-shadow-[0_0_25px_rgba(255,165,0,0.2)]">
                    <CldImage
                      src="McLaren"
                      alt="McLaren Logo"
                      fill
                      className="object-contain object-bottom"
                    />
                  </div>

                  {/* Car Image */}
                  <div className="relative h-14 w-36 @md:h-20 @md:w-56 opacity-100 transition-all hover:scale-105 origin-right duration-300">
                    <CldImage
                      src="mclaren car"
                      alt="McLaren MCL38"
                      fill
                      className="object-contain object-right"
                    />
                  </div>
                </div>

              </div>
            </div>
          </CarouselItem>

        </CarouselContent>
      </Carousel>

      {/* Dots Indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              current === index + 1
                ? "bg-foreground w-6"
                : "bg-foreground/20 hover:bg-foreground/40 w-1.5"
            )}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
