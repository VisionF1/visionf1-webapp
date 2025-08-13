"use client"

import * as React from "react"
import {
  AudioWaveform,
  Bot,
  ChartAreaIcon,
  ChartBarBigIcon,
  ChartBarIcon,
  ChartBarIncreasingIcon,
  ChartBarStackedIcon,
  ChartGanttIcon,
  ChartLineIcon,
  Command,
  GalleryVerticalEnd,
  GitGraphIcon,
  HomeIcon,
  InfoIcon,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Alejo Fabregas",
    email: "afabregas@fi.uba.ar",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "VisionF1",
      logo: GalleryVerticalEnd,
      plan: "FIUBA",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  home: [
    {
      name: "Home",
      url: "#",
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
          url: "#",
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
      isActive: true,
      items: [
        {
          title: "Race Pace",
          url: "#",
        },
        {
          title: "Qualy Head to Head",
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
      url: "#",
      icon: InfoIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.home} />
        <NavMain items={data.navMain} />
        <NavProjects projects={data.about} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
