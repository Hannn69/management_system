"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AssetsContent } from "@/components/dashboard/AssetsContent";

export default function PendingAssetsPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Pending Assets" />
      <AssetsContent title="Pending Assets" subtitle="Inventory" categoryFilter="pending" />
    </div>
  );
}
