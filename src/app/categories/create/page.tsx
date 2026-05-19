"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CreateCategoryContent } from "@/components/dashboard/CreateCategoryContent";

export default function CreateCategoryPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Create Category" />
      <CreateCategoryContent />
    </div>
  );
}
