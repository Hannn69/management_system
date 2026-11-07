"use client";

// App chrome in the style of halal-application-form-admin: fixed sidebar, 64px top bar,
// white scrolling content area.
import type { ReactNode } from "react";
import Sidebar from "./sidebar";
import TopNav from "./top-nav";
import { ShellProvider, useShell } from "./shell-state";

function Frame({ children }: { children: ReactNode }) {
  const { menuState, isHovered, isMobile } = useShell();

  const marginLeft =
    isMobile || menuState === "hidden"
      ? "0"
      : menuState === "collapsed" && !isHovered
        ? "4rem"
        : "16rem";

  return (
    <div className="flex h-screen print:block print:h-auto">
      <div className="print:hidden">
        <Sidebar />
      </div>
      <div
        className="w-full flex flex-1 flex-col transition-all duration-300 ease-in-out min-w-0 min-h-0 print:block print:!ml-0"
        style={{ marginLeft }}
      >
        <header className="h-16 border-b border-gray-200 flex-shrink-0 print:hidden">
          <TopNav />
        </header>
        <main className="flex-1 overflow-auto bg-white min-w-0 min-h-0 print:overflow-visible">
          <div className="p-3 sm:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ShellProvider>
      <Frame>{children}</Frame>
    </ShellProvider>
  );
}
