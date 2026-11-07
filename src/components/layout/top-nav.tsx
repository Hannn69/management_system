"use client";

// Top bar in the style of halal-application-form-admin: menu toggle, breadcrumb, profile dropdown.
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Home, LogOut, Menu, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useShell } from "./shell-state";

interface SessionUser {
  email: string;
  username: string;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  role?: string | null;
}

function getUserLabel(user: SessionUser | null) {
  if (!user) return "Signed In";
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  return user.displayName || fullName || user.username || user.email;
}

function getUserInitials(user: SessionUser | null) {
  const label = getUserLabel(user);
  const parts = label.split(" ").filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return label.slice(0, 2).toUpperCase();
}

const titleCase = (segment: string) =>
  decodeURIComponent(segment)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

export default function TopNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { toggleMenuState, isMobileMenuOpen, setIsMobileMenuOpen } = useShell();
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data) setUser(data.user || null);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const crumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    return segments.map((segment, index) => ({
      label: titleCase(segment),
      href: `/${segments.slice(0, index + 1).join("/")}`,
      last: index === segments.length - 1,
    }));
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } finally {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="flex items-center justify-between h-full px-4 lg:px-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          className="hidden lg:flex p-2"
          onClick={toggleMenuState}
          aria-label="Toggle menu"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          className="lg:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <nav className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/dashboard" className="flex items-center hover:text-gray-900">
            <Home className="h-4 w-4 mr-1" />
          </Link>
          {crumbs.map((crumb) => (
            <span key={crumb.href} className="flex items-center space-x-2">
              <span className="text-gray-400">/</span>
              {crumb.last ? (
                <span className="text-gray-900 font-medium">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="hover:text-gray-900">
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>

      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-600 text-xs font-bold text-white">
                  {getUserInitials(user)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:flex flex-col items-start">
                <span className="text-sm font-medium text-gray-900">{getUserLabel(user)}</span>
                <span className="text-xs text-gray-500">{user?.role || "Administrator"}</span>
              </div>
              <ChevronDown className="hidden lg:block h-4 w-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm font-semibold text-gray-900">{getUserLabel(user)}</p>
              <p className="text-xs font-normal text-gray-500">
                {user?.email || "Authenticated session"}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onSelect={() => router.push("/users")}>
              <UserRound className="mr-2 h-4 w-4" />
              Users
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-red-600" onSelect={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
