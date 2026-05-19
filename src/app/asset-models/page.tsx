"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AssetModelsContent } from "@/components/dashboard/AssetModelsContent";

export default function AssetModelsPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Asset Models" />
      <AssetModelsContent />
    </div>
  );
}
