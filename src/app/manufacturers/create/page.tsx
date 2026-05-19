"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CreateManufacturerContent } from "@/components/dashboard/CreateManufacturerContent";

export default function CreateManufacturerPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Create Manufacturer" />
      <CreateManufacturerContent />
    </div>
  );
}
