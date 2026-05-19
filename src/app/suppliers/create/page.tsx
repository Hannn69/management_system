"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CreateSupplierContent } from "@/components/dashboard/CreateSupplierContent";

export default function CreateSupplierPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Create Supplier" />
      <CreateSupplierContent />
    </div>
  );
}
