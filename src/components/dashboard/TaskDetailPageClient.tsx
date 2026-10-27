"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TaskDetailContent } from "@/components/dashboard/TaskDetailContent";
import type { Task } from "@/components/dashboard/TaskManagementContent";
import { UpdateTaskModal } from "@/components/dashboard/UpdateTaskModal";

type TaskDetailPageClientProps = {
  slug: string;
};

export function TaskDetailPageClient({ slug }: TaskDetailPageClientProps) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  const [task, setTask] = useState<Task | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    let active = true;
    const loadTask = async () => {
      try {
        const res = await fetch(`${apiBase}/tasks/${slug}`, {
          credentials: "include",
        });
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        if (active) {
          setTask(data.task ?? null);
        }
      } catch {
        // ignore task load errors
      }
    };
    loadTask();
    const handler = () => loadTask();
    window.addEventListener("task:updated", handler);
    return () => {
      window.removeEventListener("task:updated", handler);
      active = false;
    };
  }, [apiBase, slug]);

  return (
    <>
      <div className="flex flex-1 flex-col min-w-0">
        <DashboardHeader title="Task details" />
        <div className="mx-auto w-full max-w-[1380px] px-6 pb-6 pt-5">
          <TaskDetailContent
            slug={slug}
            task={task}
            onEdit={() => setEditOpen(true)}
          />
        </div>
      </div>
      <UpdateTaskModal
        open={editOpen}
        task={task}
        onClose={() => setEditOpen(false)}
      />
    </>
  );
}
