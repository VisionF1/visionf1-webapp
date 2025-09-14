"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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
  countryCode: string;
  name: string;
  circuit: string;
  startDate: string;
  endDate: string;
  round: number;
}

interface UpcomingGPProps {
  gp: GPData;
}

export function UpcomingGP({ gp }: UpcomingGPProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    // run once immediately and then every second
    setTimeLeft(calculateTimeLeft());
    checkIfLive();
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
      checkIfLive();
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function calculateTimeLeft() {
    const now = new Date();
    const start = new Date(gp.startDate);
    const end = new Date(gp.endDate);
    const difference = start.getTime() - now.getTime();
    
    if (difference <= 0) {
      // If started and inside weekend -> return zeros
      if (now >= start && now <= end) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      } else if (now > end) {
        // If already passed, do not show counter
        return null;
      }
    }
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }

  function checkIfLive() {
    const now = new Date();
    const start = new Date(gp.startDate);
    const end = new Date(gp.endDate);
    setIsLive(now >= start && now <= end);
  }

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });

  const start = new Date(gp.startDate);
  const end = new Date(gp.endDate);
  const year = start.getFullYear();

  return (
    <div className="rounded-xl p-4 h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          Upcoming GP
        </span>
        {isLive && (
          <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-md font-semibold">
            LIVE
          </span>
        )}
      </div>

      <div className="flex gap-4 mb-4">
        {/* GP Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <Image
              src={`https://flagcdn.com/${gp.countryCode}.svg`}
              alt={gp.countryCode}
              width={48}
              height={36}
              className="object-contain"
            />
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {gp.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {year}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-foreground">
            <MapPin className="h-4 w-4 text-muted-foreground mb-3" />
            <p className="text-sm text-foreground mb-3">
              {gp.circuit}
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Calendar className="h-4 w-4 text-muted-foreground" />
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
                className="w-50 h-28 rounded-md overflow-hidden border"
                aria-label={`Open ${gp.circuit} image`}
              >
                <Image
                  src={`/${gp.circuit}.avif`}
                  alt={gp.circuit}
                  width={320}
                  height={320}
                  className="object-cover w-full h-full"
                />
              </button>
            </DialogTrigger>

            <DialogContent className="max-w-[50vw] sm:max-w-[45vw] p-0">
              <DialogHeader>
                <DialogTitle className="sr-only">{gp.circuit}</DialogTitle>
                <DialogClose className="absolute right-2 top-2 z-50" />
              </DialogHeader>

              <div className="w-full flex items-center justify-center bg-black/80">
                <Image
                  src={`/${gp.circuit}.avif`}
                  alt={gp.circuit}
                  width={1252}
                  height={704}
                  className="object-contain max-h-[80vh] w-full"
                />
              </div>

              <div className="p-4">
                <p className="text-sm text-muted-foreground">{gp.circuit}</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {timeLeft && !isLive ? (
        <div className="mt-auto">
          <span className="text-xs text-muted-foreground block mb-1">Race weekend starts in</span>
          <div className="grid grid-cols-4 gap-1">
            <div className="bg-background rounded-md p-1 text-center">
              <span className="text-lg font-bold">{timeLeft.days}</span>
              <span className="text-xs text-muted-foreground block">days</span>
            </div>
            <div className="bg-background rounded-md p-1 text-center">
              <span className="text-lg font-bold">{timeLeft.hours}</span>
              <span className="text-xs text-muted-foreground block">hours</span>
            </div>
            <div className="bg-background rounded-md p-1 text-center">
              <span className="text-lg font-bold">{timeLeft.minutes}</span>
              <span className="text-xs text-muted-foreground block">mins</span>
            </div>
            <div className="bg-background rounded-md p-1 text-center">
              <span className="text-lg font-bold">{timeLeft.seconds}</span>
              <span className="text-xs text-muted-foreground block">secs</span>
            </div>
          </div>
        </div>
      ) : isLive ? (
        <div className="mt-auto text-center py-2 bg-red-100 dark:bg-red-950/30 rounded-md">
          <span className="text-lg font-bold text-red-600">LIVE NOW</span>
          <p className="text-xs text-muted-foreground mt-1">
            Event in progress
          </p>
        </div>
      ) : (
        <div className="mt-auto text-center py-3">
          <span className="text-sm text-muted-foreground">
            Event completed
          </span>
        </div>
      )}
      <div className="mt-4 pt-1 border-t border-border text-center">
        <span className="text-xs text-muted-foreground">
          Round {gp.round} of the Championship
        </span>
      </div>
    </div>
  );
}