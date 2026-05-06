"use client";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SpacesContent } from "@/components/dashboard/SpacesContent";

export default function SpacesPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0c10] text-zinc-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute right-[-120px] top-12 h-96 w-96 rounded-full bg-slate-400/10 blur-3xl" />
        <div className="absolute bottom-[-140px] left-[35%] h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen w-full gap-6 px-4 py-6 sm:px-6">
        <DashboardSidebar />

        <div className="flex flex-1 flex-col gap-6">
          <DashboardHeader title="Spaces" />
          <SpacesContent />
        </div>
      </div>
    </div>
  );
}
