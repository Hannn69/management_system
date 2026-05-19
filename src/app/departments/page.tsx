"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DepartmentsContent } from "@/components/dashboard/DepartmentsContent";

export default function DepartmentsPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Departments" />
      <DepartmentsContent />
    </div>
  );
}
