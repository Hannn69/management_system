"use client";

import { useParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { UpdateCompanyContent } from "@/components/dashboard/UpdateCompanyContent";

export default function EditCompanyPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Update Company" />
      <UpdateCompanyContent companyId={slug} />
    </div>
  );
}
