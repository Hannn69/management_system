"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatusLabelsContent } from "@/components/dashboard/StatusLabelsContent";
import { StatusLabelsSeeder } from "@/components/dashboard/StatusLabelsSeeder";

export default function StatusLabelsPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Status Labels" />
      <div className="px-6 pt-6">
        <StatusLabelsSeeder />
      </div>
      <StatusLabelsContent />
    </div>
  );
}
