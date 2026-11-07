"use client";

// Sidebar in the style of halal-application-form-admin: blue gradient rail, section labels,
// collapsible groups, tooltip when collapsed, slide-in overlay on mobile.
import type React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useShell } from "./shell-state";

interface MenuItem {
  id: string;
  label: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: MenuItem[];
}

interface MenuSection {
  id: string;
  label: string;
  items: MenuItem[];
}

const assetLinks: [string, string][] = [
  ["List All", "/assets"],
  ["Deployed", "/assets/deployed"],
  ["Ready to Deploy", "/assets/ready-to-deploy"],
  ["Pending", "/assets/pending"],
  ["Un-deployable", "/assets/undeployable"],
  ["BYOD", "/assets/byod"],
  ["Archive", "/assets/archive"],
  ["Requestable", "/assets/requestable"],
  ["Due for Audit", "/assets/due-for-audit"],
  ["Due for Checkin", "/assets/due-for-checkin"],
];

const settingsLinks: [string, string][] = [
  ["Status Labels", "/status-labels"],
  ["Asset Models", "/asset-models"],
  ["Categories", "/categories"],
  ["Manufacturers", "/manufacturers"],
  ["Suppliers", "/suppliers"],
  ["Departments", "/departments"],
  ["Locations", "/locations"],
  ["Companies", "/companies"],
];

const toChildren = (links: [string, string][], icon: MenuItem["icon"]): MenuItem[] =>
  links.map(([label, href]) => ({ id: href, label, href, icon }));

const menuData: MenuSection[] = [
  {
    id: "overview",
    label: "Overview",
    items: [{ id: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    id: "inventory",
    label: "Inventory",
    items: [
      { id: "assets", label: "Assets", icon: Package, children: toChildren(assetLinks, Package) },
    ],
  },
  {
    id: "configuration",
    label: "Configuration",
    items: [
      {
        id: "settings",
        label: "Settings",
        icon: Settings,
        children: toChildren(settingsLinks, Settings),
      },
    ],
  },
  {
    id: "users",
    label: "Users",
    items: [
      {
        id: "user-management",
        label: "User Management",
        icon: Users,
        children: toChildren(
          [
            ["User", "/users"],
            ["Role & Permission", "/roles"],
          ],
          Users,
        ),
      },
    ],
  },
];

function collectHrefs(items: MenuItem[]): string[] {
  return items.flatMap((item) => [
    ...(item.href ? [item.href] : []),
    ...collectHrefs(item.children ?? []),
  ]);
}

const allHrefs = menuData.flatMap((section) => collectHrefs(section.items));

/** The most specific menu href that owns the current path (so /assets/deployed does not also light up /assets). */
function activeHrefFor(pathname: string) {
  return allHrefs
    .filter((href) => pathname === href || pathname.startsWith(`${href}/`))
    .sort((a, b) => b.length - a.length)[0];
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { menuState, isHovered, isMobile, isMobileMenuOpen, setIsHovered, setIsMobileMenuOpen } =
    useShell();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const activeHref = activeHrefFor(pathname);

  const showText =
    menuState === "full" ||
    (menuState === "collapsed" && isHovered) ||
    (isMobile && isMobileMenuOpen);
  const showTooltip = menuState === "collapsed" && !isHovered && !isMobile;

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } finally {
      router.push("/");
      router.refresh();
    }
  };

  function NavItem({ item }: { item: MenuItem }) {
    const isActive = Boolean(item.href && item.href === activeHref);
    const rowClasses = cn(
      "flex items-center gap-3 py-2.5 rounded-lg transition-colors hover:bg-white/10 relative group cursor-pointer min-w-0 w-full text-left text-sm px-3.5 text-white",
      isActive ? "font-semibold bg-white/10" : "font-medium",
    );

    if (item.children) {
      const hasActiveChild = item.children.some((child) => child.href === activeHref);
      const isOpen = openSections[item.id] ?? hasActiveChild;
      return (
        <div>
          <button
            type="button"
            onClick={() => setOpenSections((prev) => ({ ...prev, [item.id]: !isOpen }))}
            className={cn(rowClasses, hasActiveChild && "font-semibold bg-white/10")}
            title={showTooltip ? item.label : undefined}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {showText && (
              <>
                <span className="ml-3 flex-1 text-left min-w-0">{item.label}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 flex-shrink-0 transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                />
              </>
            )}
          </button>
          {showText && isOpen && (
            <div className="mt-1 space-y-1 pl-6">
              {item.children.map((child) => (
                <NavItem key={child.id} item={child} />
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        href={item.href!}
        className={rowClasses}
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
        title={showTooltip ? item.label : undefined}
      >
        <item.icon className="h-5 w-5 flex-shrink-0" />
        {showText && <span className="ml-3 flex-1 min-w-0">{item.label}</span>}
        {showTooltip && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            {item.label}
          </div>
        )}
      </Link>
    );
  }

  const logoBlock = (
    <div
      className={cn(
        "px-4 flex items-center gap-3 flex-shrink-0 border-b border-blue-600/40",
        showText ? "h-24 py-3" : "h-20",
      )}
    >
      {showText ? (
        <Link href="/dashboard" className="flex items-center gap-3 w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/moc-logo.png"
            alt="Ministry of Commerce"
            width={64}
            height={64}
            className="flex-shrink-0 object-contain"
          />
          <div className="overflow-hidden">
            <p className="text-base font-bold text-white leading-tight">ក្រសួងពាណិជ្ជកម្ម</p>
            <p className="text-[11px] font-semibold text-blue-100 leading-tight mt-0.5">
              Management System
            </p>
            <p className="text-[10px] text-blue-200/80 leading-tight mt-0.5">Admin Console</p>
          </div>
        </Link>
      ) : (
        <div className="flex justify-center w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/moc-logo.png"
            alt="Ministry of Commerce"
            width={48}
            height={48}
            className="flex-shrink-0 object-contain"
          />
        </div>
      )}
    </div>
  );

  const navBlock = (
    <div
      className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <div className="space-y-6">
        {menuData.map((section) => (
          <div key={section.id}>
            {showText && (
              <p className="px-3.5 mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-blue-200/70">
                {section.label}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const logoutBlock = (
    <div className="px-3 py-4 border-t border-white/15">
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-3 py-2.5 rounded-lg transition-colors hover:bg-white/10 cursor-pointer min-w-0 w-full text-left text-sm px-3.5 font-medium text-white"
        title={showTooltip ? "Logout" : undefined}
      >
        <LogOut className="h-5 w-5 flex-shrink-0" />
        {showText && <span className="ml-3 flex-1">Logout</span>}
      </button>
    </div>
  );

  const gradient =
    "bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 border-r border-blue-800/40";

  if (isMobile) {
    return (
      <>
        <nav
          className={cn(
            "fixed inset-y-0 left-0 z-[70] w-64 transform transition-transform duration-300 ease-in-out",
            gradient,
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="h-full flex flex-col">
            {logoBlock}
            {navBlock}
            {logoutBlock}
          </div>
        </nav>
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-[65]"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </>
    );
  }

  const width = menuState === "collapsed" && !isHovered ? "w-16" : "w-64";
  return (
    <nav
      className={cn(
        "fixed inset-y-0 left-0 z-[60] transition-all duration-300 ease-in-out",
        gradient,
        menuState === "hidden" ? "w-0 border-r-0" : width,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ overflow: menuState === "hidden" ? "hidden" : "visible" }}
    >
      {menuState !== "hidden" && (
        <div className="h-full flex flex-col">
          {logoBlock}
          {navBlock}
          {logoutBlock}
        </div>
      )}
    </nav>
  );
}
