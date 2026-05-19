"use client";

import { useParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CompanyDetailContent } from "@/components/dashboard/CompanyDetailContent";

export default function CompanyDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Company Details" />
      <CompanyDetailContent slug={slug} />
    </div>
  );
}
