"use client";

import { getDriverStandings, getTeamStandings } from "@/lib/api-requests"
import Image from "next/image"
import { CldImage } from "next-cloudinary"
import { useEffect, useState } from "react"

type DriverStanding = {
  position: number
  driver: string
  driverCode: string
  nationality: string
  nationalityCode: string
  team: string
  teamCode: string
  points: number
}

type TeamStanding = {
  position: number
  team: string
  teamCode: string
  nationality: string
  nationalityCode: string
  points: number
}

export function DriverStandingsCard({ driverCode, teamName }: { driverCode: string; teamName: string }) {
  const [driverStanding, setDriverStanding] = useState<(DriverStanding & { teamRank?: number; teamPoints?: number }) | null>(null)
  const [teamStanding, setTeamStanding] = useState<TeamStanding | null>(null)

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const [driverStandingsResponse, teamStandingsResponse] = await Promise.all([
          getDriverStandings(),
          getTeamStandings(),
        ])

        // Find driver standing
        const driverData = driverStandingsResponse.data.find(
          (d: DriverStanding) => d.driverCode === driverCode
        )
        
        if (driverData) {
          setDriverStanding(driverData)
        }

        // Find team standing
        const teamData = teamStandingsResponse.data.find(
          (t: TeamStanding) => t.team === teamName
        )
        
        if (teamData) {
          setTeamStanding(teamData)
        }
      } catch (error) {
        console.error("Error fetching standings:", error)
      }
    }

    fetchStandings()
  }, [driverCode, teamName])

  return (
    <div className="w-full h-full @container">
      <div className="bg-muted/50 rounded-xl h-full flex flex-col p-4">
        <h2 className="text-lg font-semibold pb-3">Standings</h2>
        <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
          {/* Driver Standing */}
          {driverStanding ? (
            <div className="border border-border rounded-lg p-2 @sm:p-3 bg-primary/5">
              <div className="text-xs text-muted-foreground mb-2">Driver</div>
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-1 flex-1 min-w-0">
                  <Image
                    src={`https://flagcdn.com/${driverStanding.nationalityCode.toLowerCase()}.svg`}
                    alt={driverStanding.nationality}
                    width={20}
                    height={15}
                    className="object-contain flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-semibold text-xs @sm:text-sm truncate">{driverStanding.driver}</div>
                    <div className="text-xs text-muted-foreground">P{driverStanding.position}</div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-base @sm:text-lg @md:text-xl text-primary">{driverStanding.points}</div>
                  <div className="text-xs text-muted-foreground">pts</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-border rounded-lg p-2 @sm:p-3 text-muted-foreground text-xs">
              No driver standing found
            </div>
          )}

          {/* Team Standing */}
          {teamStanding ? (
            <div className="border border-border rounded-lg p-2 @sm:p-3 bg-sidebar-primary/10">
              <div className="text-xs text-muted-foreground mb-2">Team</div>
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-1 flex-1 min-w-0">
                  <div className="h-5 w-5 @sm:h-6 @sm:w-6 rounded flex-shrink-0">
                    <CldImage
                      src={teamStanding.team}
                      alt={teamStanding.team}
                      width={32}
                      height={32}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-xs @sm:text-sm truncate">{teamStanding.team}</div>
                    <div className="text-xs text-muted-foreground">P{teamStanding.position}</div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-base @sm:text-lg @md:text-xl text-sidebar-primary">{teamStanding.points}</div>
                  <div className="text-xs text-muted-foreground">pts</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-border rounded-lg p-2 @sm:p-3 text-muted-foreground text-xs">
              No team standing found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
