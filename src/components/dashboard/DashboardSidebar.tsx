"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const primaryItems = [
  { label: "Dashboard", href: "/dashboard", icon: "DB" },
  { label: "Settings", href: "/dashboard", icon: "ST" },
];

const settingsItems = [
  { label: "Asset Models", href: "/dashboard" },
  { label: "Categories", href: "/dashboard" },
  { label: "Manufacturers", href: "/dashboard" },
  { label: "Suppliers", href: "/dashboard" },
  { label: "Departments", href: "/dashboard" },
  { label: "Locations", href: "/dashboard" },
  { label: "Companies", href: "/dashboard" },
];

const moduleItems = [
  { label: "Assets", href: "/spaces", icon: "AS" },
  { label: "Licenses", href: "/task-management", icon: "LI" },
  { label: "Accessories", href: "/dashboard", icon: "AC" },
  { label: "Consumables", href: "/dashboard", icon: "CO" },
  { label: "Components", href: "/dashboard", icon: "CP" },
  { label: "Predefined Kits", href: "/dashboard", icon: "PK" },
  { label: "People", href: "/dashboard", icon: "PE" },
  { label: "Import", href: "/dashboard", icon: "IM" },
  { label: "Reports", href: "/dashboard", icon: "RP" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <aside className="hidden min-h-screen w-[280px] shrink-0 border-r border-white/6 bg-[#111b24] lg:flex">
      <div className="flex w-full flex-col px-5 py-6">
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
            {primaryItems.map((item) => {
              const active = item.label === "Settings" ? true : isActive(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-[15px] transition ${
                    active
                      ? "bg-[#213847] text-white shadow-[0_18px_35px_-26px_rgba(0,0,0,0.8)]"
                      : "text-[#9eb6c3] hover:bg-[#17242d] hover:text-white"
                  }`}
                >
                  <span
                    className={`inline-flex w-8 justify-center rounded-xl px-2 py-1 text-[10px] font-bold ${
                      active
                        ? "bg-white/16 text-white"
                        : "bg-[#1f3442] text-[#8ec8e6]"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="ml-4 rounded-2xl border border-white/6 bg-[#16232d] px-3 py-3">
              <div className="flex flex-col gap-1">
                {settingsItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="rounded-xl px-3 py-2 text-sm text-[#9eb6c3] transition hover:bg-[#1d2d38] hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6e8a99]">
              Modules
            </p>
            <div className="flex flex-col gap-1">
              {moduleItems.map((item) => {
                const active = isActive(item.href) && item.href !== "/dashboard";

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-[15px] transition ${
                      active
                        ? "bg-[#213847] text-white shadow-[0_18px_35px_-26px_rgba(0,0,0,0.8)]"
                        : "text-[#9eb6c3] hover:bg-[#17242d] hover:text-white"
                    }`}
                  >
                    <span
                      className={`inline-flex w-8 justify-center rounded-xl px-2 py-1 text-[10px] font-bold ${
                        active
                          ? "bg-white/16 text-white"
                          : "bg-[#1f3442] text-[#8ec8e6]"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
}
