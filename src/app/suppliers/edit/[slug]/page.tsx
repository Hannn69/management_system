"use client";

import { use } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { UpdateSupplierContent } from "@/components/dashboard/UpdateSupplierContent";

export default function EditSupplierPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  return (
    <div className="min-h-screen bg-[#0f1720] text-[#e6f0f7]">
      <div className="flex min-h-screen">
        <DashboardSidebar />

        <div className="flex flex-1 flex-col min-w-0">
          <DashboardHeader title="Edit Supplier" />
          <UpdateSupplierContent id={slug} />
        </div>
      </div>
    </div>
  );
}
