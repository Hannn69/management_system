"use client";

import { useParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SettingsDetailContent } from "@/components/dashboard/SettingsDetailContent";

export default function SupplierDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Supplier Details" />
      <SettingsDetailContent slug={slug} type="suppliers" />
    </div>
  );
}
