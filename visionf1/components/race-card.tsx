"use client";

import Image from "next/image";
import { CldImage } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Race } from "@/lib/types";
import { useDriverNavigation } from "@/hooks/use-driver-navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";


export function RaceCard({
  race,
  isNextUpcoming,
  driverCodeToTeamColor,
}: {
  race: Race;
  isNextUpcoming: boolean;
  driverCodeToTeamColor: Record<string, string>;
}) {
  const router = useRouter();
  const { navigateToDriver } = useDriverNavigation();
  const topThreeDrivers = race.driver_names.slice(0, 3);
  const topThreeDriverCodes = race.driver_codes.slice(0, 3);
  const raceDate = new Date(race.event_date);
  // const now = new Date();
  const now = new Date("2025-12-07T14:00:00");
  const raceStart = new Date(raceDate.getTime() - 2 * 24 * 60 * 60 * 1000);
  raceStart.setHours(0, 0, 0, 0);
  const raceEnd = new Date(raceDate.getTime() + 3 * 60 * 60 * 1000);
  const isLive = now >= raceStart && now <= raceEnd;
  const isUpcoming = !isLive && isNextUpcoming;

  function handleDriverClick(driverName: string) {
    navigateToDriver(driverName);
  }

  function renderDriverRow(driverName: string, actualIndex: number) {
    const driverCode = race.driver_codes[actualIndex];
    const teamColor = driverCodeToTeamColor[driverCode];
    const bgColor = teamColor ? (teamColor.startsWith('#') ? teamColor : `#${teamColor}`) : undefined;
    return (
      <button
        key={actualIndex}
        onClick={() => handleDriverClick(driverName)}
        className="bg-accent/50 rounded-md p-2 flex items-center gap-2 cursor-pointer hover:bg-accent transition-colors text-left w-full"
      >
        <div className="text-sm font-bold text-muted-foreground w-6 text-right">{actualIndex + 1}</div>
        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0" style={{ backgroundColor: bgColor }}>
          <CldImage src={driverCode} width={24} height={24} alt={driverName} crop="fill" className="object-cover" />
        </div>
        <p className="text-xs font-bold text-foreground truncate">{driverName}</p>
      </button>
    );
  }

  const weekendStart = new Date(raceDate.getTime() - 2 * 24 * 60 * 60 * 1000);
  const startDate = weekendStart.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" });
  const endDate = raceDate.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" });

  let borderClass = "border";
  let bgClass = "bg-popover";
  if (isLive) { borderClass = "border-red-500 border-2"; bgClass = "bg-red-900/20"; }
  else if (isUpcoming) { borderClass = "border-blue-500/50"; bgClass = "bg-blue-900/20"; }

  return (
    <div className={`${bgClass} border ${borderClass} rounded-xl p-4 space-y-4 transition-all @container`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide">ROUND {race.round}</div>
          {isLive && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-red-500 rounded-full">
              <div className="w-2 h-2 bg-red-200 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-white uppercase">LIVE</span>
            </div>
          )}
          {isUpcoming && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-500 rounded-full">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
              <span className="text-xs font-bold text-foreground uppercase">Upcoming</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {startDate} - {endDate}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="relative w-6 h-4 flex-shrink-0">
            <Image
              src={`https://flagcdn.com/${race.country_code.toLocaleLowerCase()}.svg`}
              alt={race.country}
              fill
              className="object-contain"
              sizes="24px"
            />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-foreground">{race.event_name}</h3>
        </div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest">
          {race.circuit_name.toUpperCase()}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {topThreeDrivers.map((driverName, index) => {
          const teamColor = driverCodeToTeamColor[topThreeDriverCodes[index]];
          const bgColor = teamColor ? (teamColor.startsWith('#') ? teamColor : `#${teamColor}`) : undefined;
          return (
            <button
              key={index}
              onClick={() => handleDriverClick(driverName)}
              className="bg-accent rounded-lg p-2 flex items-center justify-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="text-base font-bold text-foreground mr-2">{index + 1}</div>
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0" style={{ backgroundColor: bgColor }}>
                <CldImage src={topThreeDriverCodes[index]} width={32} height={32} alt={driverName} crop="fill" className="object-cover" />
              </div>
              <p className="text-xs font-bold text-foreground uppercase leading-tight flex-shrink-0">{topThreeDriverCodes[index]}</p>
            </button>
          );
        })}
      </div>

      {race.driver_names.length > 3 && (
        <Collapsible className="space-y-2">
          <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-accent/50 rounded-lg transition-colors">
            <span>View full standings</span>
            <ChevronDown className="w-4 h-4 transition-transform duration-200" />
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-1">
            <div className="grid grid-cols-2 gap-2 pt-2">
              {/* Left column - positions 1-10 */}
              <div className="space-y-1">
                {race.driver_names.slice(0, 10).map((driverName, index) =>
                  renderDriverRow(driverName, index)
                )}
              </div>

              {/* Right column - positions 11+ */}
              <div className="space-y-1">
                {race.driver_names.slice(10).map((driverName, index) =>
                  renderDriverRow(driverName, index + 10)
                )}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {race.circuit_id && (
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="mt-4 rounded-lg overflow-hidden flex justify-center w-full cursor-pointer hover:opacity-90 transition-opacity"
              aria-label={`Open ${race.circuit_name} image`}
            >
              <div className="w-80 h-45 @sm:w-100 @sm:h-56 @md:w-115 @md:h-65 @lg:w-130 @lg:h-73 @xl:w-142 @xl:h-80 @2xl:w-170 @2xl:h-95 @4xl:w-195 @4xl:h-110">
                <CldImage src={race.circuit_id} alt={race.circuit_name} width={450} height={254} className="w-full h-full object-cover" format="webp" />
              </div>
            </button>
          </DialogTrigger>

          <DialogContent className="max-w-[95vw] lg:max-w-[65vw] p-0">
            <DialogHeader>
              <DialogTitle className="sr-only">{race.circuit_name}</DialogTitle>
              <DialogClose className="absolute right-2 top-2 z-50" />
            </DialogHeader>

            <div className="w-full flex items-center justify-center bg-black/80">
              <CldImage
                src={race.circuit_id}
                alt={race.circuit_name}
                width={1920}
                height={1080}
                className="object-cover w-full h-full"
                format="webp"
              />
            </div>

            <div className="p-4">
              <p className="text-sm text-muted-foreground">{race.circuit_name}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}