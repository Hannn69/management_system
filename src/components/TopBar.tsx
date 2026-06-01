"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/ThemeProvider";
import { Moon, Sun } from "lucide-react";

interface SessionUser {
  email: string;
  username: string;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
}

function getUserLabel(user: SessionUser | null) {
  if (!user) {
    return "Signed In";
  }

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  return user.displayName || fullName || user.username || user.email;
}

function getUserInitials(user: SessionUser | null) {
  const label = getUserLabel(user);
  const parts = label.split(" ").filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return label.slice(0, 2).toUpperCase();
}

function TopBarContent() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      try {
        const res = await fetch("/api/auth/session", { credentials: "include" });
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        if (active) {
          setUser(data.user || null);
        }
      } catch {
        // ignore session fetch errors here
      }
    };

    loadSession();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="sticky top-0 z-40 border-b border-zinc-200 bg-background backdrop-blur-sm dark:border-white/8">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-foreground lg:hidden">
            Management System
          </div>

          <div className="ml-auto flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 transition hover:bg-zinc-100 dark:hover:bg-white/8"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-zinc-400 dark:text-[#b7cad5]" />
              ) : (
                <Moon className="h-5 w-5 text-zinc-500 dark:text-[#b7cad5]" />
              )}
            </button>

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-zinc-200 bg-slate-200/50 px-2 py-1.5 text-left shadow-sm transition hover:bg-slate-300/50 dark:border-white/8 dark:bg-[#17242d] dark:hover:bg-[#1d2c36]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white dark:bg-[#12344d]">
                  {getUserInitials(user)}
                </span>
                <span className="text-sm font-medium text-zinc-600 dark:text-[#c0d1db]">
                  {getUserLabel(user)}
                </span>
              </button>

              {menuOpen ? (
                <div className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-zinc-200 bg-white shadow-[0_25px_60px_-35px_rgba(0,0,0,0.75)] dark:border-white/8 dark:bg-[#17242d]">
                  <div className="px-4 py-3">
                    <p className="text-sm font-semibold text-zinc-800 dark:text-white">
                      {getUserLabel(user)}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-[#8ca7b6]">
                      {user?.email || "Authenticated session"}
                    </p>
                  </div>
                  <hr className="border-zinc-200 dark:border-white/8" />
                  <button
                    type="button"
                    className="block w-full rounded-lg px-4 py-2 text-left text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-[#d3dee5] dark:hover:bg-[#20303b]"
                    onClick={handleLogout}
                    disabled={loggingOut}
                  >
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TopBar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="sticky top-0 z-40 border-b border-zinc-200 bg-background backdrop-blur-sm dark:border-white/8">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-foreground">
              Management System
            </div>
            <div className="ml-auto flex items-center gap-4">
              <div className="h-9 w-9 rounded-full bg-zinc-100 dark:bg-white/10" />
              <div className="flex items-center gap-2 rounded-full border border-zinc-200 px-2 py-1.5 dark:border-white/8">
                <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <TopBarContent />;
}
