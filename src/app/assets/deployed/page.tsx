"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AssetsContent } from "@/components/dashboard/AssetsContent";

export default function DeployedAssetsPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Deployed Assets" />
      <AssetsContent title="Deployed Assets" subtitle="Inventory" categoryFilter="deployed" />
    </div>
  );
}
