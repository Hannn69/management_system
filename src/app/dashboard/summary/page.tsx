"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useEffect, useState, useCallback } from "react";

export default function SummaryPage() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
  const [summary, setSummary] = useState({
    inventoryTracked: 0,
    openLicenses: 0,
    accessoriesReady: 0,
    supplyAlerts: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/api/dashboard/summary`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard summary", err);
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const summaryCards = [
    {
      label: "Inventory Tracked",
      value: summary.inventoryTracked.toLocaleString(),
      detail: "+8.4% this month",
      tone: "bg-[linear-gradient(145deg,#ffffff_0%,#effaf7_100%)] dark:bg-[#121f29]",
      accent: "text-emerald-600 dark:text-[#43d3cf]",
    },
    {
      label: "Open Licenses",
      value: summary.openLicenses.toLocaleString(),
      detail: "12 renewals soon",
      tone: "bg-[linear-gradient(145deg,#ffffff_0%,#fff5f7_100%)] dark:bg-[#121f29]",
      accent: "text-rose-600 dark:text-[#ff5b9a]",
    },
    {
      label: "Accessories Ready",
      value: summary.accessoriesReady.toLocaleString(),
      detail: "1 awaiting assignment",
      tone: "bg-[linear-gradient(145deg,#ffffff_0%,#fff8ed_100%)] dark:bg-[#121f29]",
      accent: "text-amber-600 dark:text-[#ffb24d]",
    },
    {
      label: "Supply Alerts",
      value: summary.supplyAlerts.toLocaleString(),
      detail: "Low-stock watchlist",
      tone: "bg-[linear-gradient(145deg,#ffffff_0%,#f3f1ff_100%)] dark:bg-[#121f29]",
      accent: "text-indigo-600 dark:text-[#9c8cff]",
    },
  ];

  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Summary" />
      <main className="px-6 pb-6 pt-5">
        <div className="mx-auto w-full max-w-[1380px] flex flex-col gap-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500">Loading summary...</p>
            </div>
          ) : (
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map((card) => (
                <article
                  key={card.label}
                  className={`${card.tone} rounded-[28px] border border-[color:var(--border)] px-5 py-5 shadow-[var(--panel-shadow)] transition-all hover:-translate-y-1 hover:shadow-[var(--panel-shadow-hover)] cursor-default`}
                >
                  <p className="text-sm font-medium text-zinc-500 dark:text-[#7993a1]">
                    {card.label}
                  </p>
                  <p className={`mt-3 text-4xl font-bold ${card.accent}`}>
                    {card.value}
                  </p>
                  <p className="mt-3 text-sm text-zinc-400 dark:text-[#688290] font-medium">
                    {card.detail}
                  </p>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
