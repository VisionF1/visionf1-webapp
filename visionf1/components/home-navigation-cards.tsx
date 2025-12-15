"use client"

import Link from "next/link"
import { BrainCircuit, Flag, Timer, LineChart, Gauge, ArrowRight, Zap, Layers, Wind, BarChart3, Swords, Crosshair } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface NavItemProps {
  href: string
  icon: React.ElementType
  title: string
  description: string
  colorClass: string
}

function NavItem({ href, icon: Icon, title, description, colorClass }: NavItemProps) {
  return (
    <Link href={href} className="block group">
      <motion.div
        whileHover={{ scale: 1.01, x: 2 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-between p-2 rounded-lg bg-popover hover:bg-accent/50 border border-border/50 hover:border-brand/30 transition-all duration-200 shadow-sm hover:shadow-md mb-2"
      >
        <div className="flex items-center gap-2.5">
          <div className={cn("p-1.5 rounded-md transition-colors duration-300", colorClass)}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-xs group-hover:text-brand transition-colors">{title}</span>
            <span className="text-[10px] text-muted-foreground leading-tight">{description}</span>
          </div>
        </div>
        <div className="flex items-center justify-center p-1 rounded-full bg-background/50 group-hover:bg-brand/10 transition-colors">
          <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-brand transition-colors duration-200" />
        </div>
      </motion.div>
    </Link>
  )
}

export function ModelsCard() {
  return (
    <Card className="h-full bg-muted/50 border-none shadow-sm flex flex-col overflow-hidden relative group/card @container py-0 gap-0">

      <CardHeader className="px-3 py-3 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-foreground/90">
          <div className="p-1 rounded-md bg-brand/10 text-brand">
            <BrainCircuit className="h-4 w-4" />
          </div>
          Models & Predictions
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 px-3 pb-2 flex flex-col justify-start overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-md scrollbar-thumb-muted-foreground/20">
        <div className="flex flex-col gap-0.5">
          <NavItem
            href="/models/race-predictions"
            icon={Flag}
            title="Race Predictions"
            description="AI-powered race outcomes"
            colorClass="bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20"
          />
          <NavItem
            href="/models/quali-predictions"
            icon={Zap}
            title="Quali Predictions"
            description="Qualification results forecast"
            colorClass="bg-purple-500/10 text-purple-500 group-hover:bg-purple-500/20"
          />
          <NavItem
            href="/models/race-quali-predictions"
            icon={Layers}
            title="Race + Quali"
            description="Combined event predictions"
            colorClass="bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500/20"
          />
          <NavItem
            href="/models/race-strategy"
            icon={Timer}
            title="Race Strategy"
            description="Optimal pit stop strategies"
            colorClass="bg-orange-500/10 text-orange-500 group-hover:bg-orange-500/20"
          />
        </div>
      </CardContent>
    </Card>
  )
}

export function AnalyticsCard() {
  return (
    <Card className="h-full bg-muted/50 border-none shadow-sm flex flex-col overflow-hidden relative group/card @container py-0 gap-0">

      <CardHeader className="px-3 py-3 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-foreground/90">
          <div className="p-1 rounded-md bg-brand/10 text-brand">
            <LineChart className="h-4 w-4" />
          </div>
          Analytics & Insights
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 px-3 pb-2 flex flex-col justify-start overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-md scrollbar-thumb-muted-foreground/20">
        <div className="flex flex-col gap-0.5">
          <NavItem
            href="/analytics/race-pace"
            icon={Gauge}
            title="Race Pace"
            description="Lap time analysis"
            colorClass="bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20"
          />
          <NavItem
            href="/analytics/clean-air-race-pace"
            icon={Wind}
            title="Clean Air Race Pace"
            description="Unimpeded pace analysis"
            colorClass="bg-teal-500/10 text-teal-500 group-hover:bg-teal-500/20"
          />
          <NavItem
            href="/analytics/lap-time-distributions"
            icon={BarChart3}
            title="Lap Time Distributions"
            description="Consistency & performance"
            colorClass="bg-cyan-500/10 text-cyan-500 group-hover:bg-cyan-500/20"
          />
          <NavItem
            href="/analytics/race-head-to-head"
            icon={Swords}
            title="Race Head to Head"
            description="Driver performance comparison"
            colorClass="bg-rose-500/10 text-rose-500 group-hover:bg-rose-500/20"
          />
          <NavItem
            href="/analytics/clean-air-head-to-head"
            icon={Crosshair}
            title="Clean Air Head to Head"
            description="Pure pace comparison"
            colorClass="bg-pink-500/10 text-pink-500 group-hover:bg-pink-500/20"
          />
        </div>
      </CardContent>
    </Card>
  )
}
