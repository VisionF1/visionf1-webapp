"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  CommandGroup,
} from "@/components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type GenericComboBoxProps<T> = {
  items: T[];
  value: string | null;
  onChange: (id: string | null) => void;
  getLabel: (item: T) => string;
  getValue: (item: T) => string;
  placeholder?: string;
  className?: string;
  width?: string;
};

export function GenericComboBox<T>({
  items,
  value,
  onChange,
  getLabel,
  getValue,
  placeholder = "Select...",
  className,
  width = "w-[220px]",
}: GenericComboBoxProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(
    () =>
      query
        ? items.filter((i) => getLabel(i).toLowerCase().includes(query.toLowerCase()))
        : items,
    [items, query, getLabel]
  );

  const selectedLabel = React.useMemo(
    () => items.find((i) => getValue(i) === value)?.let?.(() => undefined) ?? undefined,
    // small placeholder to avoid linting unused, we'll compute below differently
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn(width, "justify-between", className)} role="combobox" aria-expanded={open}>
          {value ? items.find((i) => getValue(i) === value)?.let?.(() => undefined) ?? items.find((i) => getValue(i) === value) && getLabel(items.find((i) => getValue(i) === value) as T) : placeholder}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={width + " p-0"}>
        <Command>
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} onValueChange={setQuery} />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup>
              {filtered.map((item) => {
                const id = getValue(item);
                const label = getLabel(item);
                return (
                  <CommandItem
                    key={id}
                    value={id}
                    onSelect={() => {
                      onChange(id === value ? null : id);
                      setOpen(false);
                    }}
                  >
                    {label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
