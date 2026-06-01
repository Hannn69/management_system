"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { UserDetailContent } from "@/components/dashboard/UserDetailContent";

export default function UserDetailPage() {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <DashboardHeader title="User Details" />
      <UserDetailContent />
    </div>
  );
}
