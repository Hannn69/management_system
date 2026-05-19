"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CreateAssetModelContent } from "@/components/dashboard/CreateAssetModelContent";

export default function CreateAssetModelPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Create Asset Model" />
      <CreateAssetModelContent />
    </div>
  );
}
