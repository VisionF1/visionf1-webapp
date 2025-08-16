"use client"

import * as React from "react"
import {
  AudioWaveform,
  Bot,
  ChartLineIcon,
  Command,
  GalleryVerticalEnd,
  HomeIcon,
  InfoIcon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { SidebarBrand } from "@/components/sidebar-brand"
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
  brand: {
    name: "VisionF1",
    logo: "/visionf1-logo.JPEG",
  },
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
        <SidebarBrand brand={data.brand} />
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
