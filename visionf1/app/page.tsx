import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeToggler } from "@/components/theme-toggler"
import { SearchBar } from "@/components/search-bar"
import { DriverImages } from "@/components/drivers"
import UpcomingGP from "@/components/upcoming-gp"

export default function Home() {

  // upcoming GP data (get from API later)
  const upcomingGP = {
    countryCode: "it", // ISO alpha-2 in lowercase for flagcdn
    name: "Italian Grand Prix",
    circuit: "Autodromo Nazionale Monza",
    startDate: "2025-09-05",
    endDate: "2025-09-07",
    round: 15,
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-20 shrink-0 items-center gap-2 border-b bg-sidebar px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">
          <div className="flex items-center gap-4 flex-1">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 h-6"
            />
            {/* Site section Breadcrumb */}
            <div className="flex items-center gap-3">
              <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    VisionF1
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            </div>
            {/* Search Bar and Dark Mode Button */}
            <div className="ml-auto">
              <div className="flex items-center gap-4">
                <SearchBar />
                <ThemeToggler />
              </div>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-between px-4 py-6 overflow-hidden relative box-border">
              {/* Welcome text */}
              <div className="flex flex-col items-start flex-1 pr-2">
                <span
                  className="text-2xl font-normal leading-tight md:whitespace-nowrap py-4"
                  style={{ fontFamily: "Formula1-Display-Regular, sans-serif" }}
                >
                  Welcome to{" "}
                  <span
                    className="text-3xl font-black align-middle"
                    style={{ fontFamily: "Formula1-Display-Black, sans-serif" }}
                  >
                    VisionF1
                  </span>
                </span>

                <span
                  className="text-base font-normal mt-3 max-w-xl"
                  style={{ fontFamily: "Formula1-Display-Regular, sans-serif" }}
                >
                  Your place for Formula 1 analysis, statistics and predictive models.
                </span>
              </div>

              {/* Logo */}
              <div className="ml-8 flex-shrink-0">
                <div className="h-28 w-28 md:h-36 md:w-36 bg-sidebar-primary flex items-center justify-center rounded-lg overflow-hidden">
                  <img
                    src="/visionf1-logo.png"
                    alt="VisionF1"
                    className="object-contain h-full w-full"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl">
              <DriverImages />
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl">
              <UpcomingGP gp={upcomingGP} />
            </div>
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}