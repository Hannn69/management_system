"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, LayoutDashboard, Settings, Package as AssetsIcon } from "lucide-react";

interface SidebarItem {
  label: string;
  href: string;
  count?: number;
}

const assetsItems: SidebarItem[] = [
  { label: "List All", href: "/assets" },
  { label: "Deployed", href: "/assets/deployed" },
  { label: "Ready to Deploy", href: "/assets/ready-to-deploy" },
  { label: "Pending", href: "/assets/pending" },
  { label: "Un-deployable", href: "/assets/undeployable" },
  { label: "BYOD", href: "/assets/byod" },
  { label: "Archive", href: "/assets/archive" },
  { label: "Requestable", href: "/assets/requestable" },
  { label: "Due for Audit", href: "/assets/due-for-audit" },
  { label: "Due for Checkin", href: "/assets/due-for-checkin" },
];

const settingsItems: SidebarItem[] = [
  { label: "Status Labels", href: "/status-labels" },
  { label: "Asset Models", href: "/asset-models" },
  { label: "Categories", href: "/categories" },
  { label: "Manufacturers", href: "/manufacturers" },
  { label: "Suppliers", href: "/suppliers" },
  { label: "Departments", href: "/departments" },
  { label: "Locations", href: "/locations" },
  { label: "Companies", href: "/companies" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isAssetsOpen, setIsAssetsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAssetsOpen(localStorage.getItem("assets-open") === "true");
      setIsSettingsOpen(localStorage.getItem("settings-open") === "true");
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("assets-open", isAssetsOpen.toString());
    }
  }, [isAssetsOpen, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("settings-open", isSettingsOpen.toString());
    }
  }, [isSettingsOpen, mounted]);

  return (
    <aside className="hidden fixed left-0 top-0 h-screen w-[280px] shrink-0 border-r border-zinc-200 dark:border-white/6 bg-slate-50 dark:bg-[#111b24] lg:flex overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-white/10 z-50">
      <div className="flex w-full flex-col px-5 py-6">
        {/* Brand Card */}
        <div className="rounded-3xl border border-zinc-200 dark:border-white/8 bg-[linear-gradient(160deg,#f8fafc_0%,#f1f5f9_100%)] dark:bg-[linear-gradient(160deg,#163042_0%,#153c49_55%,#1e6c73_100%)] px-5 py-5 text-foreground dark:text-white shadow-sm dark:shadow-[0_30px_70px_-38px_rgba(0,0,0,0.75)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 dark:bg-[#2ca6a4] text-sm font-black text-white">
              MS
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500 dark:text-white/65">
                Platform
              </p>
              <p className="text-lg font-semibold text-foreground dark:text-white">Management System</p>
            </div>
          </div>
        </div>

        <nav className="mt-6 flex flex-1 flex-col gap-5">
          <div className="flex flex-col gap-2">
            {/* Dashboard Primary Link */}
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] transition ${
                pathname === "/dashboard"
                  ? "bg-slate-200/50 dark:bg-[#213847] text-foreground dark:text-white shadow-sm dark:shadow-[0_18px_35px_-26px_rgba(0,0,0,0.8)]"
                  : "text-zinc-500 dark:text-[#9eb6c3] hover:bg-slate-200 dark:hover:bg-[#17242d] hover:text-foreground dark:hover:text-white"
              }`}
            >
              <span className={`inline-flex w-8 justify-center rounded-xl px-2 py-1 text-[10px] font-bold ${
                pathname === "/dashboard" ? "bg-white/16 text-white" : "bg-slate-200 dark:bg-[#1f3442] text-blue-600 dark:text-[#8ec8e6]"
              }`}>
                <LayoutDashboard className="h-4 w-4" />
              </span>
              <span>Dashboard</span>
            </Link>

            {/* Assets Toggle Group */}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setIsAssetsOpen(!isAssetsOpen)}
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-[15px] transition ${
                  assetsItems.some(item => pathname.startsWith(item.href))
                    ? "bg-slate-200/50 dark:bg-[#213847] text-foreground dark:text-white shadow-sm dark:shadow-[0_18px_35px_-26px_rgba(0,0,0,0.8)]"
                    : "text-zinc-500 dark:text-[#9eb6c3] hover:bg-slate-200 dark:hover:bg-[#17242d] hover:text-foreground dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`inline-flex w-8 justify-center rounded-xl px-2 py-1 text-[10px] font-bold ${
                    assetsItems.some(item => pathname.startsWith(item.href)) ? "bg-white/16 text-white" : "bg-slate-200 dark:bg-[#1f3442] text-blue-600 dark:text-[#8ec8e6]"
                  }`}>
                    <AssetsIcon className="h-4 w-4" />
                  </span>
                  <span>Assets</span>
                </div>
                {isAssetsOpen ? (
                  <ChevronDown className="h-4 w-4 text-zinc-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-zinc-500" />
                )}
              </button>

              {/* Dropdown Items */}
              {isAssetsOpen && (
                <div className="mt-1 ml-4 flex flex-col gap-1 overflow-hidden border-l border-zinc-200 dark:border-white/5 pl-4 transition-all duration-300">
                  {assetsItems.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm transition-all ${
                          active
                            ? "text-emerald-600 dark:text-emerald-400 font-bold bg-zinc-100 dark:bg-white/5 shadow-inner"
                            : "text-zinc-500 dark:text-[#9eb6c3] hover:bg-slate-200 dark:hover:bg-[#1d2d38] hover:text-foreground dark:hover:text-white"
                        }`}
                      >
                        <span>{item.label}</span>
                        {item.count !== undefined && (
                          <span className={`inline-flex items-center justify-center rounded-lg px-2 py-0.5 text-[10px] font-black ${
                            active ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-zinc-100 dark:bg-white/5 text-[#4e6c7c]"
                          }`}>
                            {item.count}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Settings Toggle Group */}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-[15px] transition ${
                  settingsItems.some(item => pathname.startsWith(item.href))
                    ? "bg-slate-200/50 dark:bg-[#213847] text-foreground dark:text-white shadow-sm dark:shadow-[0_18px_35px_-26px_rgba(0,0,0,0.8)]"
                    : "text-zinc-500 dark:text-[#9eb6c3] hover:bg-slate-200 dark:hover:bg-[#17242d] hover:text-foreground dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`inline-flex w-8 justify-center rounded-xl px-2 py-1 text-[10px] font-bold ${
                    settingsItems.some(item => pathname.startsWith(item.href)) ? "bg-white/16 text-white" : "bg-slate-200 dark:bg-[#1f3442] text-blue-600 dark:text-[#8ec8e6]"
                  }`}>
                    <Settings className="h-4 w-4" />
                  </span>
                  <span>Settings</span>
                </div>
                {isSettingsOpen ? (
                  <ChevronDown className="h-4 w-4 text-zinc-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-zinc-500" />
                )}
              </button>

              {/* Dropdown Items */}
              {isSettingsOpen && (
                <div className="mt-1 ml-4 flex flex-col gap-1 overflow-hidden border-l border-zinc-200 dark:border-white/5 pl-4 transition-all duration-300">
                  {settingsItems.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm transition-all ${
                          active
                            ? "text-emerald-600 dark:text-emerald-400 font-bold bg-zinc-100 dark:bg-white/5 shadow-inner"
                            : "text-zinc-500 dark:text-[#9eb6c3] hover:bg-slate-200 dark:hover:bg-[#1d2d38] hover:text-foreground dark:hover:text-white"
                        }`}
                      >
                        <span>{item.label}</span>
                        {item.count !== undefined && (
                          <span className={`inline-flex items-center justify-center rounded-lg px-2 py-0.5 text-[10px] font-black ${
                            active ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-zinc-100 dark:bg-white/5 text-[#4e6c7c]"
                          }`}>
                            {item.count}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
}
