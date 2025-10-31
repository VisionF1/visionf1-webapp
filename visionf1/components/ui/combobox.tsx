"use client";

import React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type GenericComboBoxProps<T> = {
  items: T[];
  value: string | null;
  onChange: (id: string | null) => void;
  getLabel: (item: T) => string;
  getValue: (item: T) => string;
  placeholder?: string;
  search_label?: string;
  width?: string;
  emptyText?: string;
  className?: string;
};

export function GenericComboBox<T>({
  items,
  value,
  onChange,
  getLabel,
  getValue,
  placeholder = "Select...",
  search_label = "",
  width = "w-[200px]",
  emptyText = "No results.",
  className,
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

  const selected = React.useMemo(
    () => items.find((i) => getValue(i) === value) ?? null,
    [items, value, getValue]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(width, "justify-between", className)}
        >
          {selected ? getLabel(selected) : placeholder}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className={cn(width, "p-0")}>
        <Command>
          <CommandInput placeholder={`Search ${search_label}...`} onValueChange={setQuery} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {filtered.map((item) => {
                const id = getValue(item);
                const label = getLabel(item);
                return (
                  <CommandItem
                    key={id}
                    value={id}
                    onSelect={(currentValue: string) => {
                      onChange(currentValue === value ? null : currentValue);
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn("mr-2 h-4 w-4", value === id ? "opacity-100" : "opacity-0")}
                    />
                    <span className="truncate">{label}</span>
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
