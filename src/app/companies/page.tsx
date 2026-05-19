"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CompaniesContent } from "@/components/dashboard/CompaniesContent";

export default function CompaniesPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Companies" />
      <CompaniesContent />
    </div>
  );
}
