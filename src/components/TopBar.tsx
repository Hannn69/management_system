"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/lib/ThemeProvider";
import { Sun, Moon } from "lucide-react";

function TopBarContent() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
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

  return (
    <div className="sticky top-0 z-40 border-b border-zinc-200 dark:border-white/8 bg-background backdrop-blur-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo or branding */}
          <div className="text-lg font-semibold text-foreground lg:hidden">
            Management System
          </div>

          {/* Right side - Theme toggle and User */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
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

            {/* User Menu */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-zinc-200 dark:border-white/8 bg-slate-200/50 dark:bg-[#17242d] px-2 py-1.5 text-left shadow-sm transition hover:bg-slate-300/50 dark:hover:bg-[#1d2c36]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 dark:bg-[#12344d] text-xs font-bold text-white">
                  AU
                </span>
                <span className="text-sm font-medium text-zinc-600 dark:text-[#c0d1db]">
                  Admin User
                </span>
              </button>

              {menuOpen ? (
                <div className="absolute right-0 top-12 z-50 w-48 rounded-xl border border-zinc-200 dark:border-white/8 bg-white dark:bg-[#17242d] shadow-[0_25px_60px_-35px_rgba(0,0,0,0.75)]">
                  <button
                    type="button"
                    className="block w-full rounded-lg px-4 py-2 text-left text-sm text-zinc-700 dark:text-[#d3dee5] transition hover:bg-zinc-100 dark:hover:bg-[#20303b]"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </button>
                  <button
                    type="button"
                    className="block w-full rounded-lg px-4 py-2 text-left text-sm text-zinc-700 dark:text-[#d3dee5] transition hover:bg-zinc-100 dark:hover:bg-[#20303b]"
                    onClick={() => setMenuOpen(false)}
                  >
                    Workspace Settings
                  </button>
                  <hr className="my-2 border-zinc-200 dark:border-white/8" />
                  <button
                    type="button"
                    className="block w-full rounded-lg px-4 py-2 text-left text-sm text-zinc-700 dark:text-[#d3dee5] transition hover:bg-zinc-100 dark:hover:bg-[#20303b]"
                    onClick={() => setMenuOpen(false)}
                  >
                    Logout
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
      <div className="sticky top-0 z-40 border-b border-zinc-200 dark:border-white/8 bg-background backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-foreground">
              Management System
            </div>
            <div className="flex items-center gap-4">
              <div className="h-9 w-9 rounded-full bg-zinc-100 dark:bg-white/10" />
              <div className="flex items-center gap-2 rounded-full border border-zinc-200 dark:border-white/8 px-2 py-1.5">
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
