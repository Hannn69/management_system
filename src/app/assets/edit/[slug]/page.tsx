"use client";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { UpdateAssetContent } from "@/components/dashboard/UpdateAssetContent";
import { useParams } from "next/navigation";

export default function UpdateAssetPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="min-h-screen bg-[#0f1720] text-[#e6f0f7]">
      <div className="flex min-h-screen">
        <DashboardSidebar />

        <div className="flex flex-1 flex-col min-w-0">
          <DashboardHeader title="Update Asset" />
          <UpdateAssetContent id={slug} />
        </div>
      </div>
    </div>
  );
}
