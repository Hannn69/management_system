"use client";

import { useParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { UpdateManufacturerContent } from "@/components/dashboard/UpdateManufacturerContent";

export default function EditManufacturerPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Update Manufacturer" />
      <UpdateManufacturerContent slug={slug} />
    </div>
  );
}
