"use client";

import { motion } from "framer-motion";
import { CldImage } from "next-cloudinary";
import { cn } from "@/lib/utils";

interface TireProps {
    compound: "soft" | "medium" | "hard";
    className?: string;
    duration?: number;
    delay?: number;
}

export function Tire({ compound, className, duration = 2, delay = 0 }: TireProps) {
    // Calculate rotations based on duration (e.g., 2 rotations per second)
    const rotationAngle = duration * 360 * 2;

    const imageId = `${compound}_vector`;

    return (
        <div className={cn("relative w-12 h-12", className)}>
            <motion.div
                className="w-full h-full"
                initial={{ rotate: 0 }}
                animate={{ rotate: rotationAngle }}
                transition={{
                    delay: delay,
                    duration: duration,
                    ease: "linear",
                }}
            >
                <CldImage
                    src={imageId}
                    alt={`${compound} tire`}
                    width={100}
                    height={100}
                    className="w-full h-full object-contain"
                />
            </motion.div>
        </div>
    );
}
