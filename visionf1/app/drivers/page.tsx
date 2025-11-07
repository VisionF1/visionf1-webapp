"use client"

import { DriverCard, DriverImage } from "@/components/driver/driver-card"
import { getDrivers } from "@/lib/api-requests"
import { Driver } from "@/lib/types"
import { useEffect, useState } from "react"

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

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
      <div>
        <h1 className="text-3xl font-bold mb-1">Drivers</h1>
        <p className="text-muted-foreground">F1 Championship Drivers</p>
      </div>

      <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        {drivers.map((driver) => (
          <div
            key={driver.driverCode}
            className="bg-muted/50 aspect-video rounded-xl flex items-center justify-between px-4 pl-0 relative @container"
          >
            <DriverCard driver={driver} />
            <DriverImage driver={driver} useTeamColor={true} />
          </div>
        ))}
      </div>
    </div>
  );
}
