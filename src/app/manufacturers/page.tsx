"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ManufacturersContent } from "@/components/dashboard/ManufacturersContent";

export default function ManufacturersPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Manufacturers" />
      <ManufacturersContent />
    </div>
  );
}
