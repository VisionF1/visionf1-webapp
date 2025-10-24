"use client";

import { useMemo, useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { CheckIcon, ChevronsUpDown as ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type GPOption = { id: string; label: string; season: number; round: number };

export function RaceFilter({
  years,
  gps,
  value,
  onChange,
}: {
  years: number[];
  gps: GPOption[];
  value: { year: number | null; gpId: string | null };
  onChange: (next: { year: number | null; gpId: string | null }) => void;
}) {
  const [gpQuery, setGpQuery] = useState("");
  const gpsForYear = useMemo(
    () => (value.year ? gps.filter((g) => g.season === value.year) : gps),
    [gps, value.year]
  );

  return (
    <div className="flex gap-2 items-center">
      {/* Year Combo */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[200px] justify-between"
            role="combobox"
            aria-expanded={false}
          >
            {value.year ?? "Year"}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search year..." />
            <CommandList>
              <CommandEmpty>No year found.</CommandEmpty>
              {years.map((y) => (
                <CommandItem
                  key={y}
                  value={String(y)}
                  onSelect={() => onChange({ ...value, year: y, gpId: null })}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.year === y ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {y}
                </CommandItem>
              ))}
              <CommandItem onSelect={() => onChange({ ...value, year: null, gpId: null })}>
                Clear year
              </CommandItem>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* GP Combo (searchable) */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[300px] justify-between" role="combobox" aria-expanded={false}>
            {value.gpId ? gps.find((g) => g.id === value.gpId)?.label ?? "GP" : "Select GP"}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput
              placeholder="Search grand prix..."
              onValueChange={(v) => setGpQuery(v)}
            />
            <CommandList>
              <CommandEmpty>No GP found.</CommandEmpty>
              {gpsForYear
                .filter((g) =>
                  gpQuery ? g.label.toLowerCase().includes(gpQuery.toLowerCase()) : true
                )
                .map((g) => (
                  <CommandItem
                    key={g.id}
                    value={g.id}
                    onSelect={() => onChange({ ...value, gpId: g.id })}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.gpId === g.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="truncate">{g.label} • {g.season}</span>
                  </CommandItem>
                ))}
              <CommandItem onSelect={() => onChange({ ...value, gpId: null })}>
                Clear GP
              </CommandItem>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}