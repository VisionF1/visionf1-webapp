"use client";
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
import { Footer } from "@/components/footer"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CldImage } from "next-cloudinary"

export default function Home() {

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-20 shrink-0 items-center gap-2 border-b bg-sidebar px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">
          <div className="flex items-center gap-4 flex-1">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-6" />
            <div className="flex items-center gap-3">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">VisionF1</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>About</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="ml-auto">
              <div className="flex items-center gap-4">
                <SearchBar />
                <ThemeToggler />
              </div>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
          <div className="flex flex-col gap-12 items-center w-full">
            {/* Main Heading and Mission */}
              <div className="flex flex-col items-center text-center gap-2 w-full">
                <h1 className="text-5xl font-bold mt-4 mb-2">About Us</h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  We&apos;re on a mission to use data science and machine learning to reveal new insights and predictions in Formula 1, combining our passion for racing and technology.
                </p>
              </div>
            {/* Story and Mission Columns */}
            <div className="flex flex-col md:flex-row gap-10 w-full max-w-5xl justify-center">
              <Card className="flex-1 min-w-[250px]">
                <CardHeader>
                  <CardTitle className="text-3xl">Our Story</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-muted-foreground">
                    VisionF1 began as a final project by four engineering students at the University of Buenos Aires, united by a love for Formula 1 and data. We set out to analyze detailed telemetry and historical data from F1 races, drivers, and teams, building a platform that uncovers performance patterns and predicts race outcomes.
                  </p>
                </CardContent>
              </Card>
              <Card className="flex-1 min-w-[250px]">
                <CardHeader>
                  <CardTitle className="text-3xl">Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-muted-foreground">
                    We believe in the power of data to deepen the understanding of motorsport. Our mission is to empower fans and analysts with modern tools and models, providing new perspectives on what drives success in Formula 1.
                  </p>
                </CardContent>
              </Card>
            </div>
            {/* Team Section */}
            <div className="flex flex-col items-center w-full">
              <h2 className="text-3xl font-bold mb-6">Meet the Team</h2>
              <div className="flex flex-row flex-wrap gap-10 justify-center w-full">
                {/* Alejo Fabregas */}
                <div className="flex flex-col items-center">
                  <div className="relative aspect-square w-36 h-36 mb-4 rounded-full overflow-hidden bg-brand">
                    <CldImage
                      src="avatar"
                      fill
                      alt="Alejo Fabregas Avatar"
                      crop="fill"
                      className="object-contain"
                      sizes="144px"
                    />
                  </div>
                  <span className="font-bold text-lg">Alejo Fabregas</span>
                  <span className="text-muted-foreground text-sm">Frontend Developer</span>
                </div>
                {/* Camilo Fabregas */}
                <div className="flex flex-col items-center">
                  <div className="relative aspect-square w-36 h-36 mb-4 rounded-full overflow-hidden bg-brand">
                    <CldImage
                      src="avatar"
                      fill
                      alt="Camilo Fabregas Avatar"
                      crop="fill"
                      className="object-contain"
                      sizes="144px"
                    />
                  </div>
                  <span className="font-bold text-lg">Camilo Fabregas</span>
                  <span className="text-muted-foreground text-sm">Backend Developer</span>
                </div>
                {/* Francisco Sobral */}
                <div className="flex flex-col items-center">
                  <div className="relative aspect-square w-36 h-36 mb-4 rounded-full overflow-hidden bg-brand">
                    <CldImage
                      src="avatar"
                      fill
                      alt="Francisco Sobral Avatar"
                      crop="fill"
                      className="object-contain"
                      sizes="144px"
                    />
                  </div>
                  <span className="font-bold text-lg">Francisco Sobral</span>
                  <span className="text-muted-foreground text-sm">Machine Learning Engineer</span>
                </div>
                {/* Tomás Della Vecchia */}
                <div className="flex flex-col items-center">
                  <div className="relative aspect-square w-36 h-36 mb-4 rounded-full overflow-hidden bg-brand">
                    <CldImage
                      src="avatar"
                      fill
                      alt="Tomás Della Vecchia Avatar"
                      crop="fill"
                      className="object-contain"
                      sizes="144px"
                    />
                  </div>
                  <span className="font-bold text-lg">Tomás Della Vecchia</span>
                  <span className="text-muted-foreground text-sm">Machine Learning Engineer</span>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}