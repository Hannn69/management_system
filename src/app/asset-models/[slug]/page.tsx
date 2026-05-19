"use client";

import { useParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AssetModelDetailContent } from "@/components/dashboard/AssetModelDetailContent";

export default function AssetModelDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Model Details" />
      <AssetModelDetailContent slug={slug} />
    </div>
  );
}
