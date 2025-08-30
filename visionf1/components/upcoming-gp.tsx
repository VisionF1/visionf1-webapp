"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

export default function UpcomingGP({
  gp,
}: {
  gp: {
    countryCode: string
    name: string
    circuit?: string
    startDate: string
    endDate: string
    round?: number
  }
}) {
  const [left, setLeft] = useState<string>("")
  useEffect(() => {
    const update = () => {
      const now = new Date()
      const start = new Date(gp.startDate)
      const diff = Math.max(0, +start - +now)
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      setLeft(diff > 0 ? `${days}d ${hours}h` : "Live")
    }
    update()
    const id = setInterval(update, 60_000)
    return () => clearInterval(id)
  }, [gp.startDate])

  return (
    <article className="bg-muted/60 rounded-xl p-5 flex gap-4 items-center md:items-start shadow-sm overflow-hidden">
      <div className="flex-shrink-0">
        <div className="h-14 w-18 md:h-16 md:w-20 rounded-md overflow-hidden bg-transparent border border-border">
          <Image
            src={`https://flagcdn.com/${gp.countryCode}.svg`}
            alt={gp.countryCode}
            width={80}
            height={60}
            className="object-contain"
          />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-foreground truncate">{gp.name}</h3>
        {gp.circuit && <p className="text-sm text-muted-foreground mt-1 truncate">{gp.circuit}</p>}

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <time className="text-sm text-foreground">
            {new Date(gp.startDate).toLocaleDateString()} — {new Date(gp.endDate).toLocaleDateString()}
          </time>
          {gp.round && <span className="text-sm px-2 py-1 bg-sidebar-accent text-sidebar-accent-foreground rounded-md">Round {gp.round}</span>}
          <span className="ml-auto text-sm font-medium text-primary">{left}</span>
        </div>

        <div className="mt-3 flex gap-2">
          <a className="text-sm px-3 py-1 rounded-md bg-primary text-primary-foreground" href="#">
            Add to Calendar
          </a>
          <a className="text-sm px-3 py-1 rounded-md border border-border text-foreground" href="#">
            View details
          </a>
        </div>
      </div>

      {/* optional circuit thumbnail for larger screens */}
      <div className="hidden md:block md:flex-shrink-0">
        <div className="h-20 w-28 bg-muted rounded-md overflow-hidden border border-border">
          {/* replace with circuit image if available */}
          <Image src="/circuit-placeholder.jpg" alt="circuit" width={112} height={80} className="object-cover" />
        </div>
      </div>
    </article>
  )
}