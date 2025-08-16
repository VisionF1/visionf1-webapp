"use client"

import * as React from "react"
import Image from "next/image"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function SidebarBrand({
  brand,
}: {
  brand: {
    name: string
    logo: string
  }
}) {

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Image
              src={brand.logo}
              alt={brand.name}
              width={48}
              height={48}
              className="object-cover"
              priority
            />
          </div>
          <div className="grid flex-1 text-left text-3xl leading-tight">
            <span
              className="truncate font-normal"
              style={{ fontFamily: "Formula1-Display-Black, sans-serif" }}
            >
              {brand.name}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
