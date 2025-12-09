"use client"

import { Input } from "@/components/ui/input"
import { JSX, SVGProps, useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Bot,
  Calendar,
  ChartLineIcon,
  HomeIcon,
  InfoIcon,
  Users,
} from "lucide-react"
import { getDrivers } from "@/lib/api-requests"

function SearchIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  // Static pages data
  const pages = [
    { name: "Home", url: "/", icon: HomeIcon, type: "Page" },
    { name: "Race Predictions", url: "/models/race-predictions", icon: Bot, type: "Page" },
    { name: "Race Strategy", url: "/models/race-strategy", icon: Bot, type: "Page" },
    { name: "Race Pace", url: "/analytics/race-pace", icon: ChartLineIcon, type: "Page" },
    { name: "Clean Air Race Pace", url: "/analytics/clean-air-race-pace", icon: ChartLineIcon, type: "Page" },
    { name: "Lap Time Distributions", url: "/analytics/lap-time-distributions", icon: ChartLineIcon, type: "Page" },
    { name: "Calendar", url: "/calendar", icon: Calendar, type: "Page" },
    { name: "Drivers", url: "/drivers", icon: Users, type: "Page" },
    { name: "About", url: "/about", icon: InfoIcon, type: "Page" },
  ]

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  // Fetch drivers on mount
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const data = await getDrivers();
        const driverList = data.data && Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
        setDrivers(driverList);
      } catch (e) {
        console.warn("Search bar failed to fetch drivers", e);
      }
    }
    fetchDrivers();
  }, [])

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setQuery(""); // Clear query to hide dropdown, effectively "closing" the search results
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter results when query changes
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();

    const matchedPages = pages.filter(p => p.name.toLowerCase().includes(lowerQuery));

    const matchedDrivers = drivers.filter((d: any) => {
      const first = d.firstName || "";
      const last = d.lastName === "Hülkenberg" ? "Hulkenberg" : d.lastName || "";
      const fullName = `${first} ${last}`.toLowerCase();
      return fullName.includes(lowerQuery);
    }).map((d: any) => ({
      name: `${d.firstName} ${d.lastName}`,
      url: d.lastName === "Hülkenberg" ? `/drivers/nico-hulkenberg` : `/drivers/${d.firstName}-${d.lastName}`.toLowerCase(),
      icon: Users,
      type: "Driver"
    })).slice(0, 5); // Limit driver results

    setResults([...matchedPages, ...matchedDrivers]);
  }, [query, drivers]);

  const handleSelect = (url: string) => {
    router.push(url);
    setQuery("");
    setIsOpen(false); // Close mobile expansion if applicable
  };

  return (
    <form className="relative" onSubmit={(e) => e.preventDefault()} ref={containerRef}>
      <div className="flex items-center gap-2">
        {/* Mobile: Collapsed search button */}
        {!isOpen && (
          <button
            type="button"
            className="md:hidden size-9 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 rounded-md transition-colors p-2 flex items-center justify-center"
            onClick={() => setIsOpen(true)}
            aria-label="Toggle search"
          >
            <SearchIcon className="text-muted-foreground h-4 w-4" />
          </button>
        )}

        {/* Search input container */}
        <div className={`${isOpen ? 'block' : 'hidden'} md:block w-28 md:w-56 transition-all relative`}>
          <button
            type="button"
            className="absolute left-2 top-1/2 -translate-y-1/2 flex md:hidden items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1"
            onClick={(e) => {
              e.preventDefault()
              setIsOpen(false)
              setQuery("")
            }}
            aria-label="Toggle search"
          >
            <SearchIcon className="h-4 w-4" />
          </button>
          <div className="absolute left-2 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center text-muted-foreground pointer-events-none p-1">
            <SearchIcon className="h-4 w-4" />
          </div>

          <Input
            ref={inputRef}
            type="search"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8 bg-background text-foreground text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                     placeholder:text-transparent md:placeholder:text-muted-foreground
                     w-full"
          />

          {/* Dropdown Results */}
          {query && results.length > 0 && (
            <div className="absolute top-full -left-4 mt-2 w-48 md:w-56 right-0 md:left-0 bg-popover border border-border rounded-md shadow-md overflow-hidden z-50">
              <div className="py-1">
                {results.map((result, i) => (
                  <button
                    key={result.url + i}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground text-left transition-colors"
                    onClick={() => handleSelect(result.url)}
                  >
                    <result.icon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span>{result.name}</span>
                      <span className="text-[10px] text-muted-foreground leading-none">{result.type}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && results.length === 0 && (
            <div className="absolute top-full mt-2 w-full md:w-[200px] right-0 md:left-0 bg-popover border border-border rounded-md shadow-md p-3 text-sm text-muted-foreground z-50 text-center">
              No results found.
            </div>
          )}
        </div>
      </div>
    </form>
  )
}