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
            {/* Welcome card */}
            <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-between px-4 py-6 overflow-hidden relative box-border">           
              {/* Welcome text */}
              <div className="flex flex-col justify-center h-full flex-1 pr-2 z-10">
                <span
                  className="text-2xl md:text-3xl font-normal leading-tight py-2"
                  style={{ fontFamily: "Formula1-Display-Regular, sans-serif" }}
                >
                  Welcome to
                </span>
                
                <span
                  className="text-4xl md:text-5xl font-black py-2 bg-gradient-to-r from-primary to-50% to-brand bg-clip-text text-transparent"
                  style={{ fontFamily: "Formula1-Display-Black, sans-serif" }}
                >
                  VisionF1
                </span>

                <p
                  className="text-base md:text-lg font-normal mt-3 max-w-md text-muted-foreground"
                  style={{ fontFamily: "Formula1-Display-Regular, sans-serif" }}
                >
                  Your place for Formula 1 analysis, statistics and predictive models. Made by passionate students.
                </p>
                
                {/* Quick stats or features */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="text-xs bg-primary/20 px-2 py-1 rounded-full">Data Analytics</span>
                  <span className="text-xs bg-primary/20 px-2 py-1 rounded-full">Predictive Models</span>
                  <span className="text-xs bg-primary/20 px-2 py-1 rounded-full">Key Statistics</span>
                </div>
              </div>

              {/* Logo */}
              <div className="mt-4 md:mt-0 flex-shrink-0 z-10">
                <div className="h-24 w-24 md:h-32 md:w-32 bg-sidebar-primary border-2 border-brand flex items-center justify-center rounded-full overflow-hidden shadow-lg">
                  <img
                    src="/visionf1-logo.png"
                    alt="VisionF1"
                    className="object-contain h-full w-full p-2"
                    loading="eager"
                  />
                </div>
              </div>
              
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-32 h-32 border-2 border-red-500 rounded-full -mt-16 -mr-16"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 border-2 border-primary rounded-full -mb-20 -ml-20"></div>
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