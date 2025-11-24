"use client"

import { DriverCard, DriverImage } from "@/components/driver/driver-card"
import { getDrivers } from "@/lib/api-requests"
import { Driver } from "@/lib/types"
import { useEffect, useState } from "react"
import { CldImage } from "next-cloudinary"

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([])

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await getDrivers()
        setDrivers(response.data || [])
      } catch (error) {
        console.error("Error fetching drivers:", error)
      }
    }

    fetchDrivers()
  }, [])

  // Group drivers by team
  const groupedByTeam = drivers.reduce((acc, driver) => {
    const teamKey = driver.teamCode || driver.team
    if (!acc[teamKey]) {
      acc[teamKey] = {
        team: driver.team,
        teamCode: driver.teamCode,
        drivers: []
      }
    }
    acc[teamKey].drivers.push(driver)
    return acc
  }, {} as Record<string, { team: string; teamCode: string; drivers: Driver[] }>)

  const teams = Object.values(groupedByTeam)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
      <div>
        <h1 className="text-3xl font-bold mb-1">Drivers</h1>
        <p className="text-muted-foreground">F1 Championship Drivers</p>
      </div>

      <div className="grid auto-rows-min gap-4 grid-cols-1 2xl:grid-cols-2">
        {teams.map((teamGroup) => (
          <div
            key={teamGroup.teamCode}
            className="bg-muted/30 rounded-xl p-4 border border-border"
          >
            {/* Team Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded flex-shrink-0">
                <CldImage
                  src={teamGroup.team}
                  alt={teamGroup.team}
                  width={100}
                  height={100}
                  className="object-contain w-full h-full"
                />
              </div>
              <h2 className="text-xl font-bold text-sidebar-primary">{teamGroup.team}</h2>
            </div>

            {/* Drivers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {teamGroup.drivers.map((driver) => (
                <div
                  key={driver.driverCode}
                  className="bg-muted/50 aspect-video rounded-lg flex items-center justify-between px-4 pl-0 relative @container"
                >
                  <DriverCard driver={driver} isTeamView={true} />
                  <DriverImage driver={driver} useTeamColor={true} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
