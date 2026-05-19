"use client";

import { useParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AssetDetailContent } from "@/components/dashboard/AssetDetailContent";

export default function AssetDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Asset Details" />
      <AssetDetailContent slug={slug} />
    </div>
  );
}
