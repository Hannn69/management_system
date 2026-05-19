"use client";

import { useParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { UpdateAssetModelContent } from "@/components/dashboard/UpdateAssetModelContent";

export default function EditAssetModelPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Update Asset Model" />
      <UpdateAssetModelContent id={slug} />
    </div>
  );
}
