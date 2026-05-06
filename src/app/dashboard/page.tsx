"use client";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0f1720] text-[#e6f0f7]">
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col">
          <DashboardHeader title="Home" />
          <DashboardContent />
        </div>
      </div>
    </div>
  );
}
