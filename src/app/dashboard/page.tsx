"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Home" />
      <DashboardContent />
    </div>
  );
}
