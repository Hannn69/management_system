"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CreateCompanyContent } from "@/components/dashboard/CreateCompanyContent";

export default function CreateCompanyPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Create Company" />
      <CreateCompanyContent />
    </div>
  );
}
