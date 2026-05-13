"use client";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AssetsContent } from "@/components/dashboard/AssetsContent";

export default function ReadyToDeployAssetsPage() {
  return (
    <div className="min-h-screen bg-[#0f1720] text-[#e6f0f7]">
      <div className="flex min-h-screen">
        <DashboardSidebar />

        <div className="flex flex-1 flex-col min-w-0">
          <DashboardHeader title="Ready to Deploy" />
          <AssetsContent title="Ready to Deploy" subtitle="Inventory" categoryFilter="ready" />
        </div>
      </div>
    </div>
  );
}
