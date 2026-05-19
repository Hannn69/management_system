"use client";

import { useParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { UpdateDepartmentContent } from "@/components/dashboard/UpdateDepartmentContent";

export default function EditDepartmentPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Update Department" />
      <UpdateDepartmentContent slug={slug} />
    </div>
  );
}
