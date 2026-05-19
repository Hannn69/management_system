"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CreateDepartmentContent } from "@/components/dashboard/CreateDepartmentContent";

export default function CreateDepartmentPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Create Department" />
      <CreateDepartmentContent />
    </div>
  );
}
