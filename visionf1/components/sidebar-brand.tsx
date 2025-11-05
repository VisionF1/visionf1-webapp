"use client"

import Image from "next/image"
import Link from "next/link"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function SidebarBrand({
  brand,
}: {
  brand: {
    name: string
    logo: string
  }
}) {

  const { state } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link href="/">
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-18"
          >
            <div className={`bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square items-center justify-center rounded-lg transition-all duration-300 ${
              state === "expanded" ? "h-12 w-12" : "h-8 w-8"
            }`}>
              <Image
                src={brand.logo}
                alt={brand.name}
                width={state === "expanded" ? 48 : 32}
                height={state === "expanded" ? 48 : 32}
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
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
