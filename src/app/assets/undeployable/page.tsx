"use client";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AssetsContent } from "@/components/dashboard/AssetsContent";

export default function UndeployableAssetsPage() {
  return (
    <div className="min-h-screen bg-[#0f1720] text-[#e6f0f7]">
      <div className="flex min-h-screen">
        <DashboardSidebar />

        <div className="flex flex-1 flex-col min-w-0">
          <DashboardHeader title="Un-deployable Assets" />
          <AssetsContent title="Un-deployable Assets" subtitle="Inventory" categoryFilter="undeployable" />
        </div>
      </div>
    </div>
  );
}
