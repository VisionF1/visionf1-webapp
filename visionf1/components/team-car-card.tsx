"use client";

import { CldImage } from "next-cloudinary"

type Team = {
  teamCode: string
  teamName: string
}

export function TeamCarCard({ team, teamName }: { team: string; teamName: string }) {
  const carImageUrl = `${teamName.toLowerCase()} car`
  
  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-lg font-semibold pb-3">{teamName} - Car</h2>
      {/* Team Car Image */}
      <div className="relative w-full flex-1 flex items-center justify-center min-h-0">
        <CldImage
          src={carImageUrl}
          alt={`${teamName} car`}
          width={1200}
          height={600}
          className="object-contain h-full w-full"
        />
      </div>
    </div>
  )
}
