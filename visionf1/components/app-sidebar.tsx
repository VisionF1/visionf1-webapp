"use client"

import * as React from "react"
import {
  Bot,
  ChartLineIcon,
  HomeIcon,
  InfoIcon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { SidebarBrand } from "@/components/sidebar-brand"
import { SidebarBottom } from "@/components/sidebar-bottom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  brand: {
    name: "VisionF1",
    logo: "/visionf1-logo.svg",
  },
  university: {
    title: "FIUBA",
    subtitle: "Trabajo Profesional",
    year: "2025",
    logo: "/fiuba-logo.png",
  },
  home: [
    {
      name: "Home",
      url: "/",
      icon: HomeIcon,
    },
  ],
  navMain: [
    {
      title: "Models & Predictions",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Race Predictions",
          url: "/models/race-predictions",
        },
        {
          title: "Pit Probabilities",
          url: "#",
        },
        {
          title: "Race Strategy",
          url: "#",
        },
      ],
    },
    {
      title: "Analytics & Insights",
      url: "#",
      icon: ChartLineIcon,
      items: [
        {
          title: "Race Pace",
          url: "#",
        },
        {
          title: "Quali Head to Head",
          url: "#",
        },
        {
          title: "Race Head to Head",
          url: "#",
        },
      ],
    },
  ],
  about: [
    {
      name: "About",
      url: "/about",
      icon: InfoIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarBrand brand={data.brand} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.home} />
        <NavMain items={data.navMain} />
        <NavProjects projects={data.about} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarBottom detail={data.university} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
