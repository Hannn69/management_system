"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CategoriesContent } from "@/components/dashboard/CategoriesContent";

export default function CategoriesPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Categories" />
      <CategoriesContent />
    </div>
  );
}
