"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useEffect, useState, useCallback } from "react";
import { buildSummaryCards, emptySummary } from "@/lib/dashboard";

export default function SummaryPage() {
  const [summary, setSummary] = useState(emptySummary);
  const [loading, setLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/summary", {
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
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const tones = [
    "bg-[linear-gradient(145deg,#ffffff_0%,#effaf7_100%)] ",
    "bg-[linear-gradient(145deg,#ffffff_0%,#fff5f7_100%)] ",
    "bg-[linear-gradient(145deg,#ffffff_0%,#fff8ed_100%)] ",
    "bg-[linear-gradient(145deg,#ffffff_0%,#f3f1ff_100%)] ",
  ];
  const summaryCards = buildSummaryCards(summary).map((card, i) => ({ ...card, tone: tones[i] }));

  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Summary" />
      <div className="space-y-6">
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
                  className={`${card.tone} rounded-xl border border-[color:var(--border)] px-5 py-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-sm cursor-default`}
                >
                  <p className="text-sm font-medium text-gray-500">
                    {card.label}
                  </p>
                  <p className={`mt-3 text-4xl font-bold ${card.accent}`}>
                    {card.value}
                  </p>
                  <p className="mt-3 text-sm text-gray-400 font-medium">
                    {card.detail}
                  </p>
                </article>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
