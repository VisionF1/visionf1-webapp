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
import { UpcomingGP } from "@/components/upcoming-gp"
import { Welcome } from "@/components/welcome"
import { DriverStandings } from "@/components/driver-standings"
import { TeamStandings } from "@/components/team-standings"
import { PlaceholderBrand } from "@/components/placeholder-brand"
import { Footer } from "@/components/footer"
import { getDriverStandings } from "@/lib/api-requests";

export default async function Home() {

  // upcoming GP data (get from API later)
  const upcomingGP = {
    countryCode: "it", // ISO alpha-2 in lowercase for flagcdn
    name: "Italian Grand Prix",
    circuit: "Autodromo Nazionale Monza",
    startDate: "2025-09-05",
    endDate: "2025-09-07",
    round: 15,
  }

  const driverStandings = await getDriverStandings();

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
          <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl">
              <Welcome />
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl">
              <DriverImages />
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl">
              <UpcomingGP gp={upcomingGP} />
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl hidden md:block lg:block xl:hidden">
              <PlaceholderBrand />
            </div>
          </div>
          <div className="bg-muted/50 min-h-min flex-1 rounded-xl md:min-h-min">
            <DriverStandings data={driverStandings.data} />
          </div>
          <div className="bg-muted/50 min-h-min flex-1 rounded-xl md:min-h-min">
            <TeamStandings />
          </div>
          <Footer />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}