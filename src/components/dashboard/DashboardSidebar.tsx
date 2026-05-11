"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, LayoutDashboard, Settings } from "lucide-react";

const settingsItems = [
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);

  // Auto-open settings if we are on a settings page
  useEffect(() => {
    const isSubPage = settingsItems.some(item => pathname.startsWith(item.href));
    if (isSubPage) {
      setIsSettingsOpen(true);
    }
  }, [pathname]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <aside className="hidden min-h-screen w-[280px] shrink-0 border-r border-white/6 bg-[#111b24] lg:flex">
      <div className="flex w-full flex-col px-5 py-6">
        {/* Brand Card */}
        <div className="rounded-3xl border border-white/8 bg-[linear-gradient(160deg,#163042_0%,#153c49_55%,#1e6c73_100%)] px-5 py-5 text-white shadow-[0_30px_70px_-38px_rgba(0,0,0,0.75)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2ca6a4] text-sm font-black text-white">
              MS
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/65">
                Platform
              </p>
              <p className="text-lg font-semibold">Management System</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-white/72">
            Operational dashboard for inventory, requests, and team activity.
          </p>
        </div>

        <nav className="mt-6 flex flex-1 flex-col gap-5">
          <div className="flex flex-col gap-2">
            {/* Dashboard Primary Link */}
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] transition ${
                pathname === "/dashboard"
                  ? "bg-[#213847] text-white shadow-[0_18px_35px_-26px_rgba(0,0,0,0.8)]"
                  : "text-[#9eb6c3] hover:bg-[#17242d] hover:text-white"
              }`}
            >
              <span className={`inline-flex w-8 justify-center rounded-xl px-2 py-1 text-[10px] font-bold ${
                pathname === "/dashboard" ? "bg-white/16 text-white" : "bg-[#1f3442] text-[#8ec8e6]"
              }`}>
                <LayoutDashboard className="h-4 w-4" />
              </span>
              <span>Dashboard</span>
            </Link>

            {/* Settings Toggle Group */}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-[15px] transition ${
                  pathname !== "/dashboard"
                    ? "bg-[#213847] text-white shadow-[0_18px_35px_-26px_rgba(0,0,0,0.8)]"
                    : "text-[#9eb6c3] hover:bg-[#17242d] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`inline-flex w-8 justify-center rounded-xl px-2 py-1 text-[10px] font-bold ${
                    pathname !== "/dashboard" ? "bg-white/16 text-white" : "bg-[#1f3442] text-[#8ec8e6]"
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
                <div className="mt-1 ml-4 flex flex-col gap-1 overflow-hidden border-l border-white/5 pl-4 transition-all duration-300">
                  {settingsItems.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`rounded-xl px-4 py-2.5 text-sm transition-all ${
                          active
                            ? "text-emerald-400 font-bold bg-white/5 shadow-inner"
                            : "text-[#9eb6c3] hover:bg-[#1d2d38] hover:text-white"
                        }`}
                      >
                        {item.label}
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
