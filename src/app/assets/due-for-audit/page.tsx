"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AssetsContent } from "@/components/dashboard/AssetsContent";

export default function DueForAuditAssetsPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Due for Audit" />
      <AssetsContent title="Due for Audit" subtitle="Verification Needed" categoryFilter="audit" />
    </div>
  );
}
