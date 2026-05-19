"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CreateStatusLabelContent } from "@/components/dashboard/CreateStatusLabelContent";

export default function CreateStatusLabelPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Create Status Label" />
      <CreateStatusLabelContent />
    </div>
  );
}
