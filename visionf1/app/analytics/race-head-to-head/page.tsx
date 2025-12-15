"use client"

import { useMemo, useState, useEffect } from "react"
import Image from "next/image"

import { GenericComboBox } from "@/components/ui/combobox"
import { Spinner } from "@/components/ui/spinner"
import { HeadToHeadCard } from "@/components/head-to-head-card"

import { getSeasons, getSummaryEvents, getRacePace } from "@/lib/api-requests"
import { Season, EventSummary, RacePaceRow } from "@/lib/types"

interface TeamComparison {
  teamName: string;
  winner: RacePaceRow;
  loser?: RacePaceRow;
  delta?: number;
}

export default function RaceHeadToHead() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [racePaceData, setRacePaceData] = useState<RacePaceRow[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedGP, setSelectedGP] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load seasons on component mount
  useEffect(() => {
    const loadSeasons = async () => {
      try {
        const seasonsResponse = await getSeasons();
        setSeasons(seasonsResponse.data);
      } catch (error) {
        console.error("Error loading seasons:", error);
      }
    };

    loadSeasons();
  }, []);

  // Load events when a year is selected
  useEffect(() => {
    const loadEvents = async () => {
      if (!selectedYear) return;

      try {
        const eventsResponse = await getSummaryEvents(Number(selectedYear));
        setEvents(eventsResponse.data);
        setSelectedGP(null); // Reset selected GP
        setRacePaceData([]); // Clear previous data
      } catch (error) {
        console.error("Error loading events:", error);
        setEvents([]);
      }
    };

    loadEvents();
  }, [selectedYear]);

  // Load race pace data when a GP is selected
  useEffect(() => {
    const loadRacePace = async () => {
      if (!selectedGP) return;

      try {
        setLoading(true);
        const [season, round] = selectedGP.split('_').map(Number);
        const racePaceResponse = await getRacePace(season, round);
        setRacePaceData(racePaceResponse.data);
      } catch (error) {
        console.error("Error loading race pace data:", error);
        setRacePaceData([]);
      } finally {
        setLoading(false);
      }
    };

    loadRacePace();
  }, [selectedGP]);

  const years = useMemo(() =>
    seasons.map(season => String(season)).sort((a, b) => Number(b) - Number(a)),
    [seasons]
  );

  const gps = useMemo(() =>
    events.map(event => ({
      id: `${event.season}_${event.round}`,
      label: event.event_name,
      season: event.season,
      round: event.round
    })),
    [events]
  );

  const currentEvent = events.find(event =>
    `${event.season}_${event.round}` === selectedGP
  );

  // Process data for Head to Head
  const teamComparisons: TeamComparison[] = useMemo(() => {
    if (!racePaceData.length) return [];

    const groupedByTeam: Record<string, RacePaceRow[]> = {};

    // Group drivers by team
    racePaceData.forEach(row => {
      if (!groupedByTeam[row.team_name]) {
        groupedByTeam[row.team_name] = [];
      }
      groupedByTeam[row.team_name].push(row);
    });

    const comparisons: TeamComparison[] = [];

    Object.entries(groupedByTeam).forEach(([teamName, drivers]) => {
      const sortedDrivers = [...drivers].sort((a, b) => a.avg_laptime - b.avg_laptime);

      if (sortedDrivers.length >= 2) {
        const winner = sortedDrivers[0];
        const loser = sortedDrivers[1];
        const delta = loser.avg_laptime - winner.avg_laptime;

        comparisons.push({
          teamName,
          winner,
          loser,
          delta
        });
      } else if (sortedDrivers.length === 1) {
        // Single driver case
        comparisons.push({
          teamName,
          winner: sortedDrivers[0]
        });
      }
    });

    return comparisons.sort((a, b) => a.teamName.localeCompare(b.teamName));

  }, [racePaceData]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
      <div className="bg-popover min-h-min flex-1 rounded-xl md:min-h-min p-4">
        <div className="w-full">
          <h2 className="text-lg font-semibold pb-4">
            {currentEvent ? `Race Head to Head - ${currentEvent.season} ${currentEvent.event_name}` : "Race Head to Head"}
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <GenericComboBox
              items={years}
              value={selectedYear}
              onChange={setSelectedYear}
              getLabel={(y) => String(y)}
              getValue={(y) => String(y)}
              placeholder="Select Year"
              search_label="Year"
              width="w-[320px]"
            />

            <GenericComboBox
              items={gps}
              value={selectedGP}
              onChange={setSelectedGP}
              getLabel={(g) => `R${g.round} • ${g.label}`}
              getValue={(g) => g.id}
              placeholder="Select Grand Prix"
              search_label="Grand Prix"
              width="w-[320px]"
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner className="size-6 mr-2" />
              <div className="text-lg">Loading race pace data...</div>
            </div>
          ) : teamComparisons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
              {teamComparisons.map((comparison) => (
                <HeadToHeadCard
                  key={comparison.teamName}
                  winner={comparison.winner}
                  loser={comparison.loser}
                  delta={comparison.delta}
                />
              ))}
            </div>
          ) : selectedGP ? (
            <div className="flex flex-col justify-center items-center text-center h-80 gap-10">
              <div className="text-lg">No comparable race pace data available for this event.</div>
              <div className="flex-shrink-0 pb-2 px-2">
                <div className="h-20 w-20 @2xs:h-24 @2xs:w-24 @xs:h-28 @xs:w-28 @sm:h-36 @sm:w-36 @md:h-42 @md:w-42 @lg:h-46 @lg:w-46 @xl:h-56 @xl:w-56 bg-sidebar-primary border-2 border-brand flex items-center justify-center rounded-full overflow-hidden shadow-lg">
                  <Image
                    src="/visionf1-logo.svg"
                    alt="VisionF1"
                    width={200}
                    height={200}
                    className="object-contain h-full w-full p-1"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center text-center h-80 gap-10">
              <div className="text-lg">Please select a Grand Prix to view Head to Head comparisons.</div>
              <div className="flex-shrink-0 pb-2 px-2">
                <div className="h-20 w-20 @2xs:h-24 @2xs:w-24 @xs:h-28 @xs:w-28 @sm:h-36 @sm:w-36 @md:h-42 @md:w-42 @lg:h-46 @lg:w-46 @xl:h-56 @xl:w-56 bg-sidebar-primary border-2 border-brand flex items-center justify-center rounded-full overflow-hidden shadow-lg">
                  <Image
                    src="/visionf1-logo.svg"
                    alt="VisionF1"
                    width={200}
                    height={200}
                    className="object-contain h-full w-full p-1"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
