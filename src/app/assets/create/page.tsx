"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CreateAssetContent } from "@/components/dashboard/CreateAssetContent";

export default function CreateAssetPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Create Asset" />
      <CreateAssetContent />
    </div>
  );
}
