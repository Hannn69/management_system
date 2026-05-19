"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AssetsContent } from "@/components/dashboard/AssetsContent";

export default function RequestableAssetsPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Requestable Assets" />
      <AssetsContent title="Requestable Assets" subtitle="Available" categoryFilter="requestable" />
    </div>
  );
}
