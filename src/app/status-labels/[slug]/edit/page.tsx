"use client";

import { useParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { UpdateStatusLabelContent } from "@/components/dashboard/UpdateStatusLabelContent";

export default function EditStatusLabelPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Update Status Label" />
      <UpdateStatusLabelContent slug={slug} />
    </div>
  );
}
