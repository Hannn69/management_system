"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AssetsContent } from "@/components/dashboard/AssetsContent";

export default function UndeployableAssetsPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Un-deployable Assets" />
      <AssetsContent title="Un-deployable Assets" subtitle="Inventory" categoryFilter="undeployable" />
    </div>
  );
}
