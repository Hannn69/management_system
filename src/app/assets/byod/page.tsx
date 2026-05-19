"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AssetsContent } from "@/components/dashboard/AssetsContent";

export default function BYODAssetsPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="BYOD Assets" />
      <AssetsContent title="BYOD Assets" subtitle="User Owned" categoryFilter="byod" />
    </div>
  );
}
