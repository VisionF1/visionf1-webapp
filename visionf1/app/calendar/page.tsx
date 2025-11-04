"use client";

import { getEvents, getDrivers } from "@/lib/api-requests";
import Image from "next/image";
import { CldImage } from "next-cloudinary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Map country names to country codes for flags
const countryCodeMap: { [key: string]: string } = {
  "Australia": "au",
  "Bahrain": "bh",
  "Saudi Arabia": "sa",
  "China": "cn",
  "Japan": "jp",
  "Monaco": "mc",
  "Canada": "ca",
  "Spain": "es",
  "Austria": "at",
  "United Kingdom": "gb",
  "Hungary": "hu",
  "Belgium": "be",
  "Netherlands": "nl",
  "Italy": "it",
  "Germany": "de",
  "France": "fr",
  "Singapore": "sg",
  "United States": "us",
  "Mexico": "mx",
  "Brazil": "br",
  "Abu Dhabi": "ae",
  "UAE": "ae",
};

function getCountryCode(countryName: string): string {
  return countryCodeMap[countryName] || countryName.substring(0, 2).toLowerCase();
}

interface Race {
  event_id: string;
  season: number;
  round: number;
  event_name: string;
  country: string;
  location: string;
  circuit_name: string;
  circuit_id: string;
  event_date: string;
  event_status: string;
  driver_codes?: string[];
  driver_names?: string[];
  team_colors?: string[];
}

export default async function RaceCalendar() {
  const currentYear = new Date().getFullYear();
  let races: Race[] = [];
  let driverCodeToTeamCode: { [key: string]: string } = {};
  let nextUpcomingRaceId: string | null = null;

  try {
    // Fetch races
    const racesResponse = await getEvents(currentYear);
    races = racesResponse.data || [];
    races.sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());

    // Find the next upcoming race
    const now = new Date();
    for (const race of races) {
      const raceStart = new Date(race.event_date);
      if (raceStart > now) {
        nextUpcomingRaceId = race.event_id;
        break;
      }
    }

    // Fetch drivers to map driver codes to team codes
    const driversResponse = await getDrivers();
    const drivers = driversResponse.data || [];

    // Create a map of driver code to team code
    drivers.forEach((driver: any) => {
      driverCodeToTeamCode[driver.driverCode] = driver.teamCode;
    });
  } catch (error) {
    console.error("Error fetching calendar data:", error);
  }

  // Helper function to get team color for a driver from a race
  const getDriverTeamColor = (race: Race, driverCode: string): string | undefined => {
    if (!race.driver_names || !race.driver_codes || !race.team_colors) {
      return undefined;
    }

    // Find the team of this driver
    const driverTeamCode = driverCodeToTeamCode[driverCode];
    if (!driverTeamCode) return undefined;

    // Track unique teams and their color indices
    const seenTeams = new Set<string>();
    let colorIndex = 0;

    // Iterate through driver standings to find the color for this team
    for (let i = 0; i < race.driver_codes.length; i++) {
      const driverAtPositionCode = race.driver_codes[i];
      const teamOfDriverAtPosition = driverCodeToTeamCode[driverAtPositionCode];

      // If we haven't seen this team yet, it gets the next color
      if (teamOfDriverAtPosition && !seenTeams.has(teamOfDriverAtPosition)) {
        seenTeams.add(teamOfDriverAtPosition);

        // If this is the team we're looking for, return the color
        if (teamOfDriverAtPosition === driverTeamCode) {
          return race.team_colors[colorIndex];
        }

        colorIndex++;
      }
    }

    return undefined;
  };

  const RaceCard = ({ race, isNextUpcoming }: { race: Race; isNextUpcoming: boolean }) => {
    const topThreeDrivers = (race.driver_names || []).slice(0, 3);
    const topThreeDriverCodes = (race.driver_codes || []).slice(0, 3);
    const raceDate = new Date(race.event_date);
    const countryCode = getCountryCode(race.country);
    
    // Determine race status
    const now = new Date();
    const raceStart = new Date(race.event_date);
    const raceEnd = new Date(raceStart.getTime() + 3 * 24 * 60 * 60 * 1000); // Assume 3-day weekend
    const isLive = now >= raceStart && now <= raceEnd;
    const isUpcoming = isNextUpcoming;
    
    // Format date range (race date is Sunday, weekend starts Friday)
    const weekendStart = new Date(raceDate.getTime() - 2 * 24 * 60 * 60 * 1000); // Friday (2 days before)
    const startDate = weekendStart.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" });
    const endDate = raceDate.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" });

    // Determine border and background styling based on status
    let borderClass = "border-slate-800";
    let bgClass = "bg-slate-900/50";
    
    if (isLive) {
      borderClass = "border-red-500 border-2";
      bgClass = "bg-red-900/20";
    } else if (isUpcoming) {
      borderClass = "border-blue-500/50";
      bgClass = "bg-blue-900/20";
    }

    return (
      <div className={`${bgClass} border ${borderClass} rounded-xl p-4 space-y-4 transition-all`}>
        {/* Header with Round and Date */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wide">
              ROUND {race.round}
            </div>
            {isLive && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-red-500 rounded-full">
                <div className="w-2 h-2 bg-red-200 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-white uppercase">LIVE</span>
              </div>
            )}
            {isUpcoming && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-500 rounded-full">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                </svg>
                <span className="text-xs font-bold text-white uppercase">Upcoming</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {startDate} - {endDate}
          </div>
        </div>

        {/* Country and Race Name */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Image
              src={`https://flagcdn.com/${countryCode}.svg`}
              alt={race.country}
              width={24}
              height={16}
              className="object-contain flex-shrink-0"
            />
            <h3 className="text-2xl font-bold text-white">{race.country}</h3>
          </div>
          <p className="text-xs text-slate-400 uppercase tracking-widest">
            FORMULA 1 {race.event_name.toUpperCase()} {raceDate.getFullYear()}
          </p>
        </div>

        {/* Top 3 Drivers */}
        <div className="grid grid-cols-3 gap-2">
          {topThreeDrivers.map((driverName, index) => {
            const teamColor = getDriverTeamColor(race, topThreeDriverCodes[index]);
            return (
            <div key={index} className="bg-slate-800/80 rounded-lg p-2 flex items-center justify-center gap-1">
              {/* Driver Position */}
              <div className="text-base font-bold text-white mr-2">{index + 1}</div>
              
              {/* Driver Avatar Image */}
              <div
                className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
                style={{ backgroundColor: teamColor ? `#${teamColor}` : undefined }}
              >
                <CldImage
                  src={topThreeDriverCodes[index]}
                  alt={driverName}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                  format="webp"
                />
              </div>
              
              {/* Driver Code */}
              <p className="text-xs font-bold text-white uppercase leading-tight flex-shrink-0">{topThreeDriverCodes[index]}</p>
            </div>
            );
          })}
        </div>

        {/* Circuit Image */}
        {race.circuit_id && (
          <div className="mt-4 rounded-lg overflow-hidden h-100">
            <CldImage
              src={race.circuit_id}
              alt={race.circuit_name}
              width={450}
              height={220}
              className="w-full h-full object-cover"
              format="webp"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-1">F1 Season {currentYear}</h1>
        <p className="text-muted-foreground">Race Calendar</p>
      </div>

      {/* Races Grid */}
      {races.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3">
          {races.map((race) => (
            <RaceCard key={race.event_id} race={race} isNextUpcoming={race.event_id === nextUpcomingRaceId} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">No races found for {currentYear}</p>
        </div>
      )}
    </div>
  );
}
