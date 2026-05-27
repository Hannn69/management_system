"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { EditUserContent } from "@/components/dashboard/EditUserContent";

export default function EditUserPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Edit User" />
      <EditUserContent />
    </div>
  );
}
