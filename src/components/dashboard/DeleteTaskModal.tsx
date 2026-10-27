"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

type TaskRow = {
  key: string;
  slug: string;
  summary: string;
  status: string;
  priority: string;
  assignee: string;
  updated: string;
};

type DeleteTaskModalProps = {
  open: boolean;
  task: TaskRow | null;
  onClose: () => void;
};

export function DeleteTaskModal({
  open,
  task,
  onClose,
}: DeleteTaskModalProps) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  const [confirmText, setConfirmText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setConfirmText("");
      setError(null);
    }
  }, [open, task]);

  const isConfirmValid = confirmText.trim().toLowerCase() === "delete";
  const handleDelete = async () => {
    if (!task?.key || !isConfirmValid) {
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const attemptDelete = () =>
        fetch(`${apiBase}/tasks/${task.key}`, {
          method: "DELETE",
          credentials: "include",
        });

      let res = await attemptDelete();
      if (res.status === 401) {
        const refresh = await fetch(`/api/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });
        if (refresh.ok) {
          res = await attemptDelete();
        }
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || data.error || "Failed to delete task.");
      }
      window.dispatchEvent(new CustomEvent("task:deleted"));
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-md p-0">
        <div className="flex flex-col">
          <DialogHeader className="border-b border-zinc-200 dark:border-white/10 px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300">
                <AlertTriangle className="h-4 w-4" />
              </span>
              <DialogTitle>
                Delete {task?.key ?? "task"}?
              </DialogTitle>
            </div>
            <DialogDescription className="mt-2 text-zinc-500 dark:text-zinc-400">
              Deleting is irreversible. It permanently removes this task and
              all of its subtasks.
            </DialogDescription>
          </DialogHeader>

          <div className="px-5 py-4 text-sm text-zinc-600 dark:text-zinc-300">
            <label className="text-xs text-zinc-500 dark:text-zinc-400">
              Type <span className="font-semibold text-zinc-800 dark:text-zinc-200">delete</span>{" "}
              to continue
            </label>
            <input
              className="mt-2 w-full rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-[#23252a] px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100"
              value={confirmText}
              onChange={(event) => setConfirmText(event.target.value)}
              placeholder="delete"
            />
            {error ? <p className="mt-2 text-xs text-rose-700 dark:text-rose-300">{error}</p> : null}
          </div>

          <DialogFooter className="border-t border-zinc-200 dark:border-white/10 px-5 py-4 text-xs text-zinc-500 dark:text-zinc-400 sm:items-center sm:justify-end">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-full border border-zinc-200 dark:border-white/10 px-4 py-2 text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!isConfirmValid}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  isConfirmValid && !submitting
                    ? "bg-rose-500 text-white hover:bg-rose-400"
                    : "cursor-not-allowed bg-rose-500/30 text-rose-700/60 dark:text-rose-200/60"
                }`}
                onClick={handleDelete}
              >
                {submitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
