"use client";

import { useParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { UpdateAssetContent } from "@/components/dashboard/UpdateAssetContent";

export default function EditAssetPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Update Asset" />
      <UpdateAssetContent id={slug} />
    </div>
  );
}
