"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AssetsContent } from "@/components/dashboard/AssetsContent";

export default function AssetsPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Assets" />
      <AssetsContent />
    </div>
  );
}
