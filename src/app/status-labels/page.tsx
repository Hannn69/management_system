"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatusLabelsContent } from "@/components/dashboard/StatusLabelsContent";

export default function StatusLabelsPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Status Labels" />
      <StatusLabelsContent />
    </div>
  );
}
