"use client"

import Link from "next/link"
import { BrainCircuit, Flag, Timer, LineChart, Gauge, ArrowRight, Sparkles } from "lucide-react"
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
        className="flex items-center justify-between p-2 rounded-lg bg-card hover:bg-accent/50 border border-border/50 hover:border-brand/30 transition-all duration-200 shadow-sm hover:shadow-md mb-2"
      >
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-md transition-colors duration-300", colorClass)}>
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
    <Card className="h-full bg-muted/50 border-none shadow-sm flex flex-col overflow-hidden relative group/card">

      <CardHeader className="px-4">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-foreground/90">
          <div className="p-1 rounded-md bg-brand/10 text-brand">
            <BrainCircuit className="h-4 w-4" />
          </div>
          Models & Predictions
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 px-4 pb-3 flex flex-col justify-center">
        <div className="flex flex-col">
          <NavItem
            href="/models/race-predictions"
            icon={Flag}
            title="Race Predictions"
            description="AI-powered race outcomes"
            colorClass="bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20"
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
    <Card className="h-full bg-muted/50 border-none shadow-sm flex flex-col overflow-hidden relative group/card">

      <CardHeader className="px-4">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-foreground/90">
          <div className="p-1 rounded-md bg-brand/10 text-brand">
            <LineChart className="h-4 w-4" />
          </div>
          Analytics & Insights
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 px-4 pb-3 flex flex-col justify-center">
        <div className="flex flex-col">
          <NavItem
            href="/analytics/race-pace"
            icon={Gauge}
            title="Race Pace"
            description="Lap time analysis"
            colorClass="bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20"
          />

          {/* Placeholder */}
          <div className="px-0">
            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-transparent opacity-60 mt-1 mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-muted text-muted-foreground">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-xs text-muted-foreground">More Coming Soon</span>
                  <span className="text-[10px] text-muted-foreground/70 leading-tight">Advanced telemetry insights</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
