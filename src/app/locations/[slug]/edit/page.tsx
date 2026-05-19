"use client";

import { useParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { UpdateLocationContent } from "@/components/dashboard/UpdateLocationContent";

export default function EditLocationPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Update Location" />
      <UpdateLocationContent id={slug} />
    </div>
  );
}
