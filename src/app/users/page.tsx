"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { UsersContent } from "@/components/dashboard/UsersContent";

export default function UsersPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Users" />
      <UsersContent />
    </div>
  );
}
