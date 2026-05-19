"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CreateLocationContent } from "@/components/dashboard/CreateLocationContent";

export default function CreateLocationPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Create Location" />
      <CreateLocationContent />
    </div>
  );
}
