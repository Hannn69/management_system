"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CreateTaskModal } from "@/components/dashboard/CreateTaskModal";
import { TaskManagementContent } from "@/components/dashboard/TaskManagementContent";

export default function TaskManagementPage() {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col min-w-0">
      <DashboardHeader title="Tasks" />
      <div className="mx-auto w-full max-w-[1380px] px-6 pb-6 pt-5">
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] transition-all hover:bg-emerald-500 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            New task
          </button>
        </div>
        <TaskManagementContent />
      </div>
      <CreateTaskModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
