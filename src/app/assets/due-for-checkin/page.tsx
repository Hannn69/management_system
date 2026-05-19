"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AssetsContent } from "@/components/dashboard/AssetsContent";

export default function DueForCheckinAssetsPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Due for Checkin" />
      <AssetsContent title="Due for Checkin" subtitle="Overdue" categoryFilter="checkin" />
    </div>
  );
}
