"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CreateUserContent } from "@/components/dashboard/CreateUserContent";

export default function CreateUserPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Create User" />
      <CreateUserContent />
    </div>
  );
}
