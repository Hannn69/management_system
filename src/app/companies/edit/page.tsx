"use client";

import { use } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { UpdateCompanyContent } from "@/components/dashboard/UpdateCompanyContent";

export default function EditCompanyPage({ searchParams }: { searchParams: Promise<{ id: string }> }) {
  const { id } = use(searchParams);

  return (
    <div className="min-h-screen bg-[#0f1720] text-[#e6f0f7]">
      <div className="flex min-h-screen">
        <DashboardSidebar />

        <div className="flex flex-1 flex-col min-w-0">
          <DashboardHeader title="Edit Company" />
          <UpdateCompanyContent companyId={id} />
        </div>
      </div>
    </div>
  );
}
