"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type MenuState = "full" | "collapsed" | "hidden";

interface ShellState {
  menuState: MenuState;
  isHovered: boolean;
  isMobile: boolean;
  isMobileMenuOpen: boolean;
  setIsHovered: (value: boolean) => void;
  setIsMobileMenuOpen: (value: boolean) => void;
  toggleMenuState: () => void;
}

const ShellContext = createContext<ShellState | null>(null);

/** Sidebar collapse / hover / mobile-overlay state shared by the sidebar, top nav and layout. */
export function ShellProvider({ children }: { children: React.ReactNode }) {
  const [menuState, setMenuState] = useState<MenuState>("full");
  const [previousDesktopState, setPreviousDesktopState] = useState<MenuState>("full");
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024;
      setIsMobile(!isDesktop);
      if (!isDesktop) {
        if (menuState !== "hidden") {
          setPreviousDesktopState(menuState);
          setMenuState("hidden");
        }
      } else if (menuState === "hidden" && previousDesktopState !== "hidden") {
        setMenuState(previousDesktopState);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuState, previousDesktopState]);

  const value = useMemo<ShellState>(
    () => ({
      menuState,
      isHovered,
      isMobile,
      isMobileMenuOpen,
      setIsHovered,
      setIsMobileMenuOpen,
      toggleMenuState: () =>
        setMenuState((prev) =>
          prev === "full" ? "collapsed" : prev === "collapsed" ? "hidden" : "full",
        ),
    }),
    [menuState, isHovered, isMobile, isMobileMenuOpen],
  );

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}

export function useShell() {
  const context = useContext(ShellContext);
  if (!context) throw new Error("useShell must be used within ShellProvider");
  return context;
}
