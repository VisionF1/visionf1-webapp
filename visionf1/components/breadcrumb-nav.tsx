"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const routeNames: Record<string, string> = {
  "/": "Dashboard",
  "/about": "About",
  "/models/race-predictions": "Race Predictions",
  "/models/pit-probabilities": "Pit Probabilities",
  "/models/race-strategy": "Race Strategy",
  "/analytics/race-pace": "Race Pace",
  "/analytics/quali-h2h": "Quali Head-to-Head",
  "/analytics/race-h2h": "Race Head-to-Head",
};

export function BreadcrumbNav() {
  const pathname = usePathname();
  
  // Get the current route name or use the last segment of the URL
  const currentPageName = routeNames[pathname] || 
    pathname.split("/").pop()?.replace(/-/g, " ") || 
    "Unknown Page";

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/">VisionF1</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage className="capitalize">
            {currentPageName}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}