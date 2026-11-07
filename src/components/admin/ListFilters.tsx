"use client";

// Filter bar for the listing pages, styled like the halal admin's filter card
// (Label + Select / Input fields in a bordered card, with a Reset button).
import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type FilterOption = { value: string; label: string };

export type FilterField = {
  /** Query-string key sent to the API. */
  key: string;
  label: string;
  /** Fixed options. */
  options?: FilterOption[];
  /** Load options from a list endpoint (e.g. "categories"), using `id` and `name`. */
  source?: string;
};

export type FilterValues = Record<string, string>;

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";

/** Loads `{ id, name }` rows from a list endpoint to use as select options. */
function useSourceOptions(source?: string) {
  const [options, setOptions] = useState<FilterOption[]>([]);

  useEffect(() => {
    if (!source) return;
    let active = true;
    fetch(`${apiBase}/${source}?limit=200&sort=name&order=asc`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { records: [] }))
      .then((data) => {
        if (!active) return;
        const rows = Array.isArray(data) ? data : (data.records ?? []);
        setOptions(
          rows.map((row: { id: number; name?: string; email?: string }) => ({
            value: String(row.id),
            label: row.name ?? row.email ?? String(row.id),
          })),
        );
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [source]);

  return options;
}

function SelectFilter({
  field,
  value,
  onChange,
}: {
  field: FilterField;
  value: string;
  onChange: (value: string) => void;
}) {
  const loaded = useSourceOptions(field.source);
  const options = field.options ?? loaded;

  return (
    <div className="space-y-2">
      <Label>{field.label}</Label>
      <Select value={value || "all"} onValueChange={(next) => onChange(next === "all" ? "" : next)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface ListFiltersProps {
  fields?: FilterField[];
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  /** Show the "Created from / to" date range. Defaults to true. */
  showDates?: boolean;
}

export function ListFilters({ fields = [], values, onChange, showDates = true }: ListFiltersProps) {
  const set = (key: string, value: string) => {
    const next = { ...values };
    if (value) next[key] = value;
    else delete next[key];
    onChange(next);
  };

  const activeCount = Object.values(values).filter(Boolean).length;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-end gap-4">
        {fields.map((field) => (
          <SelectFilter
            key={field.key}
            field={field}
            value={values[field.key] ?? ""}
            onChange={(value) => set(field.key, value)}
          />
        ))}
        {showDates ? (
          <>
            <div className="space-y-2">
              <Label>Created from</Label>
              <Input
                type="date"
                className="w-[160px]"
                value={values.createdFrom ?? ""}
                max={values.createdTo || undefined}
                onChange={(e) => set("createdFrom", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Created to</Label>
              <Input
                type="date"
                className="w-[160px]"
                value={values.createdTo ?? ""}
                min={values.createdFrom || undefined}
                onChange={(e) => set("createdTo", e.target.value)}
              />
            </div>
          </>
        ) : null}
        <Button variant="outline" onClick={() => onChange({})} disabled={activeCount === 0}>
          <RotateCcw className="h-4 w-4" />
          Reset{activeCount > 0 ? ` (${activeCount})` : ""}
        </Button>
      </div>
    </div>
  );
}
