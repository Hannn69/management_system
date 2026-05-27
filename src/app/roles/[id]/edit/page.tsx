"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { EditRoleContent } from "@/components/dashboard/EditRoleContent";

export default function EditRolePage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Edit Role & Permission" />
      <EditRoleContent />
    </div>
  );
}
