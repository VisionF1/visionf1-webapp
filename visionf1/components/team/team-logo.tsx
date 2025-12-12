"use client";

import { CldImage } from "next-cloudinary"

interface TeamLogoProps {
    team: string;
}

export function TeamLogo({ team }: TeamLogoProps) {
    return (
        <CldImage
            src={team}
            alt={team}
            width={100}
            height={100}
            className="object-contain w-full h-full"
        />
    )
}
