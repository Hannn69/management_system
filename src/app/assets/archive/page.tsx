"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AssetsContent } from "@/components/dashboard/AssetsContent";

export default function ArchiveAssetsPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Archive" />
      <AssetsContent title="Archive" subtitle="Decommissioned" categoryFilter="archive" />
    </div>
  );
}
