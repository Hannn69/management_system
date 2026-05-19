"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { LocationsContent } from "@/components/dashboard/LocationsContent";

export default function LocationsPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Locations" />
      <LocationsContent />
    </div>
  );
}
