"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SuppliersContent } from "@/components/dashboard/SuppliersContent";

export default function SuppliersPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Suppliers" />
      <SuppliersContent />
    </div>
  );
}
