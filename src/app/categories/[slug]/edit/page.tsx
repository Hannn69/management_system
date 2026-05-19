"use client";

import { useParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { UpdateCategoryContent } from "@/components/dashboard/UpdateCategoryContent";

export default function EditCategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Update Category" />
      <UpdateCategoryContent slug={slug} />
    </div>
  );
}
