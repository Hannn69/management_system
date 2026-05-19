"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AssetsContent } from "@/components/dashboard/AssetsContent";

export default function ReadyToDeployAssetsPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Ready to Deploy" />
      <AssetsContent title="Ready to Deploy" subtitle="Inventory" categoryFilter="ready" />
    </div>
  );
}
