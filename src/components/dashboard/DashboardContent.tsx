"use client";

// Layout follows halal-application-form-admin's dashboard: two large totals, a row of
// per-status count cards, chart cards, then a "Recent" table — re-scoped to asset management.
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Archive,
  CalendarClock,
  CheckCircle2,
  Clock,
  Package,
  PackageCheck,
  RefreshCcw,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { emptySummary, timeAgo, type DashboardSummary } from "@/lib/dashboard";

type StatusCard = {
  label: string;
  value: number;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  boxClass: string;
};

const MIX_STYLES: Record<string, { label: string; bar: string; dot: string }> = {
  Deployable: { label: "Ready to Deploy", bar: "bg-green-500", dot: "#22c55e" },
  Pending: { label: "Pending", bar: "bg-amber-500", dot: "#f59e0b" },
  Archived: { label: "Archived", bar: "bg-slate-400", dot: "#94a3b8" },
  Undeployable: { label: "Un-deployable", bar: "bg-red-500", dot: "#ef4444" },
};

function stateStyle(state: string) {
  const value = state.toLowerCase();
  if (value.includes("ready")) return "bg-green-100 text-green-700 hover:bg-green-100";
  if (value.includes("deployed")) return "bg-blue-100 text-blue-700 hover:bg-blue-100";
  if (value.includes("pending")) return "bg-amber-100 text-amber-700 hover:bg-amber-100";
  if (value.includes("repair") || value.includes("broken") || value.includes("lost"))
    return "bg-red-100 text-red-700 hover:bg-red-100";
  return "bg-gray-100 text-gray-700 hover:bg-gray-100";
}

/** Circular progress ring for utilization (deployed / (deployed + ready)). */
function Ring({ percent }: { percent: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative flex h-40 w-40 items-center justify-center">
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#eff6ff" strokeWidth="14" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#2563eb"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - percent / 100)}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-semibold text-gray-900">{percent}%</span>
        <span className="text-xs text-gray-500">in use</span>
      </div>
    </div>
  );
}

export function DashboardContent() {
  const router = useRouter();
  const [summary, setSummary] = useState<DashboardSummary>(emptySummary);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const fetchSummary = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/dashboard/summary", { credentials: "include" });
      if (!res.ok) throw new Error("Unable to load the dashboard summary.");
      setSummary(await res.json());
      setUpdatedAt(new Date());
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Unable to load the dashboard summary.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchSummary, 0);
    return () => clearTimeout(timer);
  }, [fetchSummary]);

  const statusCards: StatusCard[] = [
    { label: "Ready to Deploy", value: summary.readyToDeploy, href: "/assets/ready-to-deploy", icon: CheckCircle2, iconClass: "text-green-600", boxClass: "bg-green-50" },
    { label: "Deployed", value: summary.deployed, href: "/assets/deployed", icon: PackageCheck, iconClass: "text-blue-600", boxClass: "bg-blue-50" },
    { label: "Pending", value: summary.pending, href: "/assets/pending", icon: Clock, iconClass: "text-amber-600", boxClass: "bg-amber-50" },
    { label: "Un-deployable", value: summary.undeployable, href: "/assets/undeployable", icon: XCircle, iconClass: "text-red-600", boxClass: "bg-red-50" },
    { label: "Archived", value: summary.archived, href: "/assets/archive", icon: Archive, iconClass: "text-slate-600", boxClass: "bg-slate-100" },
    { label: "Due for Audit", value: summary.dueForAudit, href: "/assets/due-for-audit", icon: CalendarClock, iconClass: "text-purple-600", boxClass: "bg-purple-50" },
    { label: "Overdue Check-in", value: summary.overdueCheckin, href: "/assets/due-for-checkin", icon: RotateCcw, iconClass: "text-cyan-600", boxClass: "bg-cyan-50" },
  ];

  const mixTotal = summary.statusMix.reduce((sum, item) => sum + item.count, 0);
  const assigned = summary.deployed + summary.readyToDeploy;
  const utilization = assigned ? Math.round((summary.deployed / assigned) * 100) : 0;
  const pendingActions = summary.pending + summary.dueForAudit + summary.overdueCheckin;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Overview of assets, their status and recent activity.</p>
        </div>
        <div className="flex items-center gap-3 sm:text-right">
          {updatedAt ? (
            <p className="text-xs text-gray-500" suppressHydrationWarning>
              Updated {updatedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          ) : null}
          <Button variant="outline" size="sm" onClick={fetchSummary} disabled={isLoading}>
            <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {loadError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50">
            <Package className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Assets</p>
            <p className="text-2xl font-semibold text-gray-900">
              {isLoading ? "…" : summary.inventoryTracked.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">{summary.addedThisMonth.toLocaleString()} added this month</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-teal-50">
            <PackageCheck className="h-5 w-5 text-teal-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Deployed Assets</p>
            <p className="text-2xl font-semibold text-gray-900">
              {isLoading ? "…" : summary.deployed.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">{pendingActions.toLocaleString()} actions need attention</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {statusCards.map((card) => (
          <button
            key={card.label}
            type="button"
            onClick={() => router.push(card.href)}
            className="rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-colors hover:bg-blue-50/40"
          >
            <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${card.boxClass}`}>
              <card.icon className={`h-[18px] w-[18px] ${card.iconClass}`} />
            </div>
            <p className="text-xs text-gray-500">{card.label}</p>
            <p className="text-xl font-semibold text-gray-900">
              {isLoading ? "…" : card.value.toLocaleString()}
            </p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-semibold text-gray-900">Assets by Status</h2>
          <p className="text-xs text-gray-500">Share of the inventory in each status type.</p>
          <div className="mt-5 space-y-4">
            {summary.statusMix.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                {isLoading ? "Loading..." : "No assets yet."}
              </p>
            ) : (
              summary.statusMix.map((item) => {
                const style = MIX_STYLES[item.type] ?? { label: item.type, bar: "bg-gray-400", dot: "#9ca3af" };
                const percent = mixTotal ? Math.round((item.count / mixTotal) * 100) : 0;
                return (
                  <div key={item.type}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">{style.label}</span>
                      <span className="text-gray-500">
                        {item.count.toLocaleString()} · {percent}%
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                      <div className={`h-full rounded-full ${style.bar}`} style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="w-full">
            <h2 className="text-sm font-semibold text-gray-900">Utilization</h2>
            <p className="text-xs text-gray-500">Deployed out of deployable assets.</p>
          </div>
          <div className="flex flex-1 items-center py-4">
            <Ring percent={utilization} />
          </div>
          <p className="text-xs text-gray-500">
            {summary.deployed.toLocaleString()} deployed · {summary.readyToDeploy.toLocaleString()} ready
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-gray-900">Recent Assets</h2>
            <button
              type="button"
              onClick={() => router.push("/assets")}
              className="text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              View all
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-left">Asset</th>
                  <th className="px-4 py-3 text-left">Assigned To</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Updated</th>
                </tr>
              </thead>
              <tbody>
                {summary.recentAssets.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-gray-500">
                      {isLoading ? "Loading..." : "No assets found."}
                    </td>
                  </tr>
                ) : (
                  summary.recentAssets.map((row, index) => (
                    <tr
                      key={`${row.name}-${index}`}
                      className={index % 2 === 0 ? "bg-white" : "bg-blue-50/40"}
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">{row.name}</td>
                      <td className="px-4 py-3 text-gray-700">{row.owner ?? "—"}</td>
                      <td className="px-4 py-3">
                        <Badge className={`border-transparent ${stateStyle(row.state)}`}>{row.state}</Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{timeAgo(row.updatedAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <ul className="divide-y divide-gray-100">
            {summary.activity.length === 0 ? (
              <li className="px-5 py-10 text-center text-sm text-gray-500">
                {isLoading ? "Loading..." : "No activity yet."}
              </li>
            ) : (
              summary.activity.map((item) => (
                <li key={`${item.at}-${item.title}`} className="flex gap-3 px-5 py-3">
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-50">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">{item.title}</p>
                    <p className="truncate text-xs text-gray-500">{item.meta}</p>
                    <p className="text-[11px] text-gray-400">{timeAgo(item.at)}</p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
