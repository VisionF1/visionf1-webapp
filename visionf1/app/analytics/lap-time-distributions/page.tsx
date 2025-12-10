"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  getSeasons,
  getEvents,
  getLapTimeDistributions,
} from "@/lib/api-requests";
import { LapTimeDistributionRow, Race } from "@/lib/types";
import { GenericComboBox } from "@/components/ui/combobox";
import { Spinner } from "@/components/ui/spinner";
import ViolinSwarmPlot from "@/components/charts/violin-swarm-plot";

export default function LapTimeDistributionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [seasons, setSeasons] = useState<number[]>([]);
  const [events, setEvents] = useState<Race[]>([]);
  const [data, setData] = useState<LapTimeDistributionRow[]>([]);
  const [loading, setLoading] = useState(false);

  const seasonParam = searchParams.get("season");
  const roundParam = searchParams.get("round");

  const [selectedSeason, setSelectedSeason] = useState<string | null>(seasonParam || null);
  const [selectedRound, setSelectedRound] = useState<string | null>(roundParam || null);

  // Fetch Seasons
  useEffect(() => {
    getSeasons().then((res) => {
      setSeasons(res.data);
      if (!seasonParam && res.data.length > 0) {
      }
    });
  }, []);

  // Fetch Events when Season changes
  useEffect(() => {
    if (selectedSeason) {
      getEvents(parseInt(selectedSeason)).then((res) => {
        setEvents(res.data);
      });
    } else {
      setEvents([]);
    }
  }, [selectedSeason]);

  // Fetch Distribution Data
  useEffect(() => {
    if (selectedSeason && selectedRound) {
      setLoading(true);
      getLapTimeDistributions(parseInt(selectedSeason), parseInt(selectedRound))
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setData([]);
    }
  }, [selectedSeason, selectedRound]);

  const handleSeasonChange = (value: string | null) => {
    if (value) {
      setSelectedSeason(value);
      setSelectedRound(null); // Reset round
      router.push(`?season=${value}`);
    } else {
      setSelectedSeason(null);
      setSelectedRound(null);
      router.push(`?`);
    }
  };

  const handleEventChange = (value: string | null) => {
    if (value) {
      setSelectedRound(value);
      router.push(`?season=${selectedSeason}&round=${value}`);
    } else {
      setSelectedRound(null);
    }
  };

  const yearItems = useMemo(() => seasons.map(s => String(s)).sort((a, b) => Number(b) - Number(a)), [seasons]);

  const currentEvent = events.find(e => e.round.toString() === selectedRound);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
      <div className="bg-popover min-h-min flex-1 rounded-xl md:min-h-min p-4">
        <div className="w-full overflow-x-auto">
          <h2 className="text-lg font-semibold pb-4">
            {currentEvent ? `Lap Time Distributions - ${currentEvent.season} ${currentEvent.event_name}` : "Lap Time Distributions"}
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 mb-0">
            <GenericComboBox
              items={yearItems}
              value={selectedSeason}
              onChange={handleSeasonChange}
              getLabel={(y) => y}
              getValue={(y) => y}
              placeholder="Select Year"
              search_label="Year"
              width="w-[320px]"
            />

            <GenericComboBox
              items={events}
              value={selectedRound}
              onChange={handleEventChange}
              getLabel={(e) => `R${e.round} • ${e.event_name}`}
              getValue={(e) => e.round.toString()}
              placeholder="Select Grand Prix"
              search_label="Grand Prix"
              width="w-[320px]"
            />
          </div>

          <div className="mt-4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Spinner className="size-6 mr-2" />
                <div className="text-lg">Loading distribution data...</div>
              </div>
            ) : data.length > 0 ? (
              <ViolinSwarmPlot data={data} />
            ) : (
              <div className="flex flex-col justify-center items-center text-center h-80 gap-10">
                <div className="text-lg">
                  {selectedRound
                    ? "No lap time data available for this event."
                    : "Please select a Grand Prix to view lap time distributions."}
                </div>
                <div className="flex-shrink-0 pb-2 px-2">
                  <div className="h-20 w-20 @2xs:h-24 @2xs:w-24 @xs:h-28 @xs:w-28 @sm:h-36 @sm:w-36 @md:h-42 @md:w-42 @lg:h-46 @lg:w-46 @xl:h-56 @xl:w-56 bg-sidebar-primary border-2 border-brand flex items-center justify-center rounded-full overflow-hidden shadow-lg">
                    <Image
                      src="/visionf1-logo.svg"
                      alt="VisionF1"
                      width={200}
                      height={200}
                      className="object-contain h-full w-full p-1"
                      loading="eager"
                      priority
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
