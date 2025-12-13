"use client";

import Image from "next/image";
import { CldImage } from "next-cloudinary";
import { useEffect, useState, useCallback } from "react";
import { Calendar, MapPin } from "lucide-react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface GPData {
  id: string;
  season: number;
  round: number;
  name: string;
  circuitId: string;
  circuit: string;
  countryCode: string;
  country: string;
  locality: string;
  startDate: string;
  endDate: string;
}

interface UpcomingGPProps {
  gp: GPData;
}

export function UpcomingGP({ gp }: UpcomingGPProps) {
  const calculateTimeLeft = useCallback(() => {
    const now = new Date();
    const start = new Date(gp.startDate);
    const end = new Date(gp.endDate);
    const difference = start.getTime() - now.getTime();

    if (difference <= 0) {
      if (now >= start && now <= end) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      if (now > end) return null;
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }, [gp.startDate, gp.endDate]);

  const checkIfLive = useCallback(() => {
    const now = new Date();
    const start = new Date(gp.startDate);
    const end = new Date(gp.endDate);
    return now >= start && now <= end;
  }, [gp.startDate, gp.endDate]);

  // Initialize as null to avoid hydration mismatch
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof calculateTimeLeft> | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Run once after mounting and then every second
    setTimeLeft(calculateTimeLeft());
    setIsLive(checkIfLive());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
      setIsLive(checkIfLive());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft, checkIfLive]);

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });

  const start = new Date(gp.startDate);
  const end = new Date(gp.endDate);
  const year = start.getFullYear();

  return (
    <div className="@container rounded-xl p-4 h-full flex flex-col">
      <div className="flex justify-between items-start mb-1 @xs:mb-1 @md:mb-3 @lg:mb-4 @xl:mb-5 3xl:mb-3">
        <span className="text-[0.6rem] @xs:text-[0.6rem] @md:text-xs @lg:text-base @xl:text-large uppercase tracking-wide text-muted-foreground">
          Upcoming GP
        </span>
        {isLive && (
          <span className="flex items-center gap-1 bg-red-600 text-white text-[0.6rem] @xs:text-[0.6rem] @md:text-xs @lg:text-base @xl:text-lg px-2 py-1 rounded-md font-semibold">
            <div className="w-2 h-2 bg-red-200 rounded-full animate-pulse" />
            LIVE
          </span>
        )}
      </div>

      <div className="flex gap-4 mb-2 @xs:mb-4 @md:mb-6">
        {/* GP Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1 @xs:mb-3 @md:mb-4">
            <div className="h-9 w-6 @xs:w-9 @xs:h-6 @sm:w-9 @sm:h-6 @md:w-12 @md:h-8 @lg:w-15 @lg:h-10 @xl:w-18 @xl:h-12">
              <Image
                src={`https://flagcdn.com/${gp.countryCode.toLowerCase()}.svg`}
                alt={gp.countryCode}
                width={64}
                height={48}
                className="object-contain"
              />
            </div>
            <div>
              <h3 className="text-xs @xs:text-xs @sm:text-normal @md:text-lg @lg:text-xl @xl:text-2xl font-semibold text-foreground truncate">
                {gp.name}
              </h3>
              <p className="text-[0.6rem] @xs:text-[0.6rem] @sm:text-xs @md:text-sm @lg:text-base @xl:text-lg text-muted-foreground">
                {year} - Round {gp.round}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-foreground">
            <MapPin className="h-3 w-3 @md:h-4 @md:w-4 @lg:h-5 @lg:w-5 @xl:h-6 @xl:w-6 text-muted-foreground mb-1 @xs:mb-3" />
            <p className="text-[0.6rem] @xs:text-[0.6rem] @sm:text-xs @md:text-sm @lg:text-base @xl:text-lg text-foreground mb-1 @xs:mb-3 truncate">
              {gp.circuit}
            </p>
          </div>

          <div className="flex items-center gap-2 text-[0.6rem] @md:text-sm @lg:text-base @xl:text-lg text-foreground">
            <Calendar className="h-3 w-3 @md:h-4 @md:w-4 @lg:h-5 @lg:w-5 @xl:h-6 @xl:w-6 text-muted-foreground" />
            <time dateTime={gp.startDate}>{fmt(start)}</time>
            <span className="text-muted-foreground mx-1">-</span>
            <time dateTime={gp.endDate}>{fmt(end)}</time>
          </div>
        </div>

        {/* Circuit Image */}
        <div className="flex-shrink-0">
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="w-18 h-13 @xs:w-26 @xs:h-18 @sm:w-38 @sm:h-26 @md:w-42 @md:h-28 @lg:w-50 @lg:h-30 @xl:w-56 @xl:h-36 rounded-md"
                aria-label={`Open ${gp.circuit} image`}
              >
                <div className="relative w-full h-full">
                  {/* Light mode */}
                  <CldImage
                    src={`/${gp.circuitId}_black_outline`}
                    alt={gp.circuit}
                    width={320}
                    height={320}
                    className="object-cover w-full h-full dark:hidden"
                    format="svg"
                  />
                  {/* Dark mode */}
                  <CldImage
                    src={`/${gp.circuitId}_white_outline`}
                    alt={gp.circuit}
                    width={320}
                    height={320}
                    className="object-cover w-full h-full hidden dark:block"
                    format="svg"
                  />
                </div>
              </button>
            </DialogTrigger>

            <DialogContent className="max-w-[95vw] lg:max-w-[65vw] p-0">
              <DialogHeader>
                <DialogTitle className="sr-only">{gp.circuit}</DialogTitle>
                <DialogClose className="absolute right-2 top-2 z-50" />
              </DialogHeader>

              <div className="w-full flex items-center justify-center bg-black/80">
                <CldImage
                  src={gp.circuitId}
                  alt={gp.circuit}
                  width={1920}
                  height={1080}
                  className="object-cover w-full h-full"
                  format="webp"
                />
              </div>

              <div className="p-4">
                <p className="text-sm text-muted-foreground">{gp.circuit}</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Countdown / LIVE / Completed */}
      <div className="mt-auto">
        {!mounted ? (
          // Placeholder while waiting for mount
          <>
            <span className="text-[0.6rem] @md:text-sm @lg:text-base @xl:text-lg text-muted-foreground block mb-0.5">
              Race weekend starts in
            </span>
            <div className="grid grid-cols-4 gap-1">
              {["days", "hours", "mins", "secs"].map((label, i) => (
                <div key={i} className="bg-background rounded-md p-1 @md:p-2 @lg:p-3 @xl:p-4 text-center">
                  <span className="text-sm @md:text-lg @lg:text-xl @xl:text-2xl font-bold">--</span>
                  <span className="text-[0.6rem] @md:text-xs text-muted-foreground block">{label}</span>
                </div>
              ))}
            </div>
          </>
        ) : timeLeft && !isLive ? (
          // Countdown
          <>
            <span className="text-[0.6rem] @md:text-sm @lg:text-base @xl:text-lg text-muted-foreground block mb-0.5">
              Race weekend starts in
            </span>
            <div className="grid grid-cols-4 gap-1">
              <div className="bg-background rounded-md p-1 @md:p-2 @lg:p-3 @xl:p-4 text-center">
                <span className="text-sm @md:text-lg @lg:text-xl @xl:text-2xl font-bold">{timeLeft.days}</span>
                <span className="text-[0.6rem] @md:text-xs text-muted-foreground block">days</span>
              </div>
              <div className="bg-background rounded-md p-1 @md:p-2 @lg:p-3 @xl:p-4 text-center">
                <span className="text-sm @md:text-lg @lg:text-xl @xl:text-2xl font-bold">{timeLeft.hours}</span>
                <span className="text-[0.6rem] @md:text-xs text-muted-foreground block">hours</span>
              </div>
              <div className="bg-background rounded-md p-1 @md:p-2 @lg:p-3 @xl:p-4 text-center">
                <span className="text-sm @md:text-lg @lg:text-xl @xl:text-2xl font-bold">{timeLeft.minutes}</span>
                <span className="text-[0.6rem] @md:text-xs text-muted-foreground block">mins</span>
              </div>
              <div className="bg-background rounded-md p-1 @md:p-2 @lg:p-3 @xl:p-4 text-center">
                <span className="text-sm @md:text-lg @lg:text-xl @xl:text-2xl font-bold">{timeLeft.seconds}</span>
                <span className="text-[0.6rem] @md:text-xs text-muted-foreground block">secs</span>
              </div>
            </div>
          </>
        ) : isLive ? (
          // Live Event
          <div className="mt-auto text-center py-1.5 @sm:py-2.2 @md:py-3 bg-red-100 dark:bg-red-950/30 rounded-md">
            <span className="text-xs @xs:text-sm @md:text-lg @lg:text-xl @xl:text-2xl @font-bold text-red-600">LIVE NOW</span>
            <p className="text-[0.5rem] @xs:text-[0.6rem] @md:text-sm @lg:text-base @xl:text-lg text-muted-foreground mt-1">
              Event in progress
            </p>
          </div>
        ) : (
          // Event Completed
          <div className="mt-auto text-center py-2.5 @sm:py-3.5 @md:py-5 @lg:py-6 @xl:py-7 bg-primary/20 rounded-md">
            <span className="text-xs @xs:text-sm @md:text-lg @lg:text-xl @xl:text-2xl">
              Event completed
            </span>
          </div>
        )}
        {/*<div className="mt-3 md:mt-4 md:pt-1 border-t border-border text-center">
          <span className="text-xs @xs:text-[0.6rem] @sm:text-[0.6rem] @md:text-xs text-muted-foreground">
            Round {gp.round} of the Championship
          </span>
        </div>*/}
      </div>
    </div>
  );
}