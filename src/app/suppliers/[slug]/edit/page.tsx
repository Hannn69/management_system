"use client";

import { useParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { UpdateSupplierContent } from "@/components/dashboard/UpdateSupplierContent";

export default function EditSupplierPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Update Supplier" />
      <UpdateSupplierContent slug={slug} />
    </div>
  );
}
