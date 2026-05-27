"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { RolesContent } from "@/components/dashboard/RolesContent";

export default function RolesPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Role & Permission" />
      <RolesContent />
    </div>
  );
}
