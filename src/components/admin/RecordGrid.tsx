"use client";

// Card view for the listing pages' list/grid toggle, styled like the halal admin cards.
import type { ReactNode } from "react";
import { Edit2, Eye, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type GridCard = {
  key: string | number;
  title?: string;
  subtitle?: string;
  image?: string | null;
  badge?: { label: string; className?: string };
  stats?: { label: string; value: ReactNode }[];
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

/** Reads a display string from a value that may be a string, an `{ name }` object or empty. */
export function display(value: unknown, fallback = "—"): string {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "object") {
    const name = (value as { name?: unknown }).name;
    return name ? String(name) : fallback;
  }
  return String(value);
}

function initials(title: string) {
  const parts = title.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return title.slice(0, 2).toUpperCase();
}

export function RecordGrid({
  cards,
  loading,
  emptyText = "No records found.",
}: {
  cards: GridCard[];
  loading?: boolean;
  emptyText?: string;
}) {
  if (cards.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center text-sm text-gray-500 shadow-sm">
        {loading ? "Loading..." : emptyText}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {cards.map((raw) => {
        const card = { ...raw, title: raw.title || "Untitled" };
        return (
        <div
          key={card.key}
          className="flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-blue-200"
        >
          <div className="flex items-start gap-3">
            {card.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={card.image}
                alt={card.title}
                className="h-12 w-12 flex-shrink-0 rounded-lg border border-gray-200 object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-semibold text-blue-600">
                {initials(card.title)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900" title={card.title}>
                {card.title}
              </p>
              {card.subtitle ? (
                <p className="truncate text-xs text-gray-500" title={card.subtitle}>
                  {card.subtitle}
                </p>
              ) : null}
            </div>
            {card.badge ? (
              <Badge
                className={`flex-shrink-0 border-transparent ${
                  card.badge.className ?? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                }`}
              >
                {card.badge.label}
              </Badge>
            ) : null}
          </div>

          {card.stats && card.stats.length > 0 ? (
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-gray-100 pt-4">
              {card.stats.map((stat) => (
                <div key={stat.label} className="min-w-0">
                  <dt className="text-xs text-gray-500">{stat.label}</dt>
                  <dd className="truncate text-sm font-medium text-gray-900">{stat.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {card.onView || card.onEdit || card.onDelete ? (
            <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
              {card.onView ? (
                <button
                  type="button"
                  onClick={card.onView}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </button>
              ) : null}
              <div className="ml-auto flex items-center gap-1">
                {card.onEdit ? (
                  <button
                    type="button"
                    onClick={card.onEdit}
                    title="Edit"
                    className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-blue-600"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                ) : null}
                {card.onDelete ? (
                  <button
                    type="button"
                    onClick={card.onDelete}
                    title="Delete"
                    className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
        );
      })}
    </div>
  );
}
