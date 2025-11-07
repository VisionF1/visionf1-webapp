"use client"

import { Input } from "@/components/ui/input"
import { JSX, SVGProps, useState, useRef, useEffect } from "react"

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
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  return (
    <form className="relative">
      <div className="flex items-center gap-2">
        {/* Mobile toggle button */}
        <button
          type="button"
          className="md:hidden size-9 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 rounded-md transition-colors p-2 flex items-center justify-center"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle search"
        >
          <SearchIcon className="text-muted-foreground h-4 w-4" />
        </button>

        {/* Search input - hidden on mobile unless open */}
        <div className={`${isOpen ? 'block' : 'hidden'} md:block w-24 md:w-56 transition-all`}>
          <div className="relative">
            <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 hidden md:block" />
            <Input
              ref={inputRef}
              type="search"
              placeholder={"Search..."}
              className="pl-3 md:pl-8 bg-background text-foreground text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                     placeholder:text-transparent md:placeholder:text-muted-foreground
                     w-full"
              onBlur={() => setIsOpen(false)}
            />
          </div>
        </div>
      </div>
    </form>
  )
}