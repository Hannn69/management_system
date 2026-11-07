"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type CreateTaskModalProps = {
  open: boolean;
  onClose: () => void;
  spaces?: Array<{ name: string; key: string }>;
  defaultSpace?: string;
  lockSpace?: boolean;
};

function CreateTaskModalInner({
  open,
  onClose,
  spaces = [],
  defaultSpace,
  lockSpace = false,
}: CreateTaskModalProps) {
  const searchParams = useSearchParams();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  const [internalSpaces, setInternalSpaces] = useState<
    Array<{ name: string; key: string }>
  >([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createAnother, setCreateAnother] = useState(false);
  const [spaceTouched, setSpaceTouched] = useState(false);
  const [form, setForm] = useState({
    space: "task (TASK)",
    workType: "Task",
    status: "To do",
    summary: "",
    description: "",
    assignee: "",
    reporter: "",
    priority: "Medium",
    labels: "",
    dueDate: "",
    startDate: "",
    category: "",
    team: "",
  });

  const updateForm = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const effectiveSpaces = spaces.length ? spaces : internalSpaces;

  const spaceOptions = effectiveSpaces.length
    ? effectiveSpaces.map((space) => ({
        label: `${space.name} (${space.key})`,
        value: `${space.name} (${space.key})`,
      }))
    : [
        { label: "task (TASK)", value: "task (TASK)" },
        { label: "platform (PLAT)", value: "platform (PLAT)" },
      ];

  const derivedDefaultSpace = useMemo(() => {
    if (
      defaultSpace &&
      spaceOptions.some((option) => option.value === defaultSpace)
    ) {
      return defaultSpace;
    }
    const spaceKey = searchParams?.get("space");
    if (spaceKey && effectiveSpaces.length) {
      const match = effectiveSpaces.find((space) => space.key === spaceKey);
      if (match) {
        return `${match.name} (${match.key})`;
      }
    }
    return spaceOptions[0]?.value ?? "task (TASK)";
  }, [defaultSpace, searchParams, effectiveSpaces, spaceOptions]);

  useEffect(() => {
    if (!open) {
      setSpaceTouched(false);
      return;
    }
    if (!spaceTouched) {
      setForm((prev) => ({ ...prev, space: derivedDefaultSpace }));
    }
  }, [open, derivedDefaultSpace, spaceTouched]);

  useEffect(() => {
    setInternalSpaces([]);
  }, []);

  const handleSubmit = async () => {
    if (!form.summary.trim()) {
      setError("Summary is required.");
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const attemptCreate = () =>
        fetch(`${apiBase}/tasks`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });

      let res = await attemptCreate();
      if (res.status === 401) {
        const refresh = await fetch(`/api/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });
        if (refresh.ok) {
          res = await attemptCreate();
        }
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || data.error || "Failed to create task.");
      }

      window.dispatchEvent(new CustomEvent("task:created"));

      if (createAnother) {
        setForm((prev) => ({
          ...prev,
          summary: "",
          description: "",
          labels: "",
          dueDate: "",
          startDate: "",
          category: "",
          team: "",
        }));
      } else {
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task.");
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
      <DialogContent className="max-h-[80vh] max-w-3xl overflow-hidden p-0">
        <div className="flex flex-col">
          <DialogHeader className="border-b border-gray-200 px-5 py-4">
            <DialogTitle>Create Task</DialogTitle>
            <DialogDescription>
              Required fields are marked with an asterisk{" "}
              <span className="text-rose-700">*</span>
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
            <div className="flex flex-col gap-5">
              <div>
                <label className="text-xs text-gray-500">
                  Space <span className="text-rose-700">*</span>
                </label>
                {lockSpace ? (
                  <div className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-800">
                    {form.space}
                  </div>
                ) : (
                  <select
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-900"
                    value={form.space}
                    onChange={(event) => {
                      setSpaceTouched(true);
                      updateForm("space", event.target.value);
                    }}
                  >
                    {spaceOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="text-xs text-gray-500">
                  Work type <span className="text-rose-700">*</span>
                </label>
                <select
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-900"
                  value={form.workType}
                  onChange={(event) =>
                    updateForm("workType", event.target.value)
                  }
                >
                  <option>Task</option>
                  <option>Bug</option>
                  <option>Story</option>
                </select>
                <p className="mt-1 text-[11px] text-blue-700">
                  Learn about work types
                </p>
              </div>

              <div>
                <label className="text-xs text-gray-500">Status</label>
                <select
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-900"
                  value={form.status}
                  onChange={(event) => updateForm("status", event.target.value)}
                >
                  <option>To do</option>
                  <option>In progress</option>
                  <option>Done</option>
                </select>
                <p className="mt-1 text-[11px] text-gray-500">
                  This is the initial status upon creation.
                </p>
              </div>

              <div>
                <label className="text-xs text-gray-500">
                  Summary <span className="text-rose-700">*</span>
                </label>
                <input
                  className="mt-2 w-full rounded-xl border border-rose-400/60 bg-gray-100 px-3 py-2 text-sm text-gray-900"
                  placeholder="Summary is required"
                  type="text"
                  value={form.summary}
                  onChange={(event) =>
                    updateForm("summary", event.target.value)
                  }
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Description</label>
                <div className="mt-2 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                  <div className="flex flex-wrap gap-2 border-b border-gray-200 px-3 py-2 text-xs text-gray-500">
                    {["T", "B", "I", "•", "1.", "@", "😊"].map((item) => (
                      <span
                        key={item}
                        className="rounded border border-gray-200 px-2 py-1"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <textarea
                    className="min-h-[140px] w-full bg-transparent px-3 py-3 text-sm text-gray-800 outline-none"
                    placeholder="Add a description…"
                    value={form.description}
                    onChange={(event) =>
                      updateForm("description", event.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs text-gray-500">Assignee</label>
                  <input
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-900"
                    placeholder="Automatic"
                    value={form.assignee}
                    onChange={(event) =>
                      updateForm("assignee", event.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">
                    Reporter <span className="text-rose-700">*</span>
                  </label>
                  <input
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-900"
                    placeholder="Defaults to you"
                    value={form.reporter}
                    onChange={(event) =>
                      updateForm("reporter", event.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs text-gray-500">Priority</label>
                <select
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-900"
                  value={form.priority}
                  onChange={(event) =>
                    updateForm("priority", event.target.value)
                  }
                >
                  <option>Medium</option>
                  <option>High</option>
                  <option>Low</option>
                </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Labels</label>
                  <input
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-900"
                    placeholder="Select label"
                    value={form.labels}
                    onChange={(event) =>
                      updateForm("labels", event.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs text-gray-500">Due date</label>
                  <input
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-900"
                    placeholder="Select date"
                    type="date"
                    value={form.dueDate}
                    onChange={(event) =>
                      updateForm("dueDate", event.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Attachment</label>
                  <div className="mt-2 flex items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-100 px-3 py-6 text-xs text-gray-500">
                    Drop files to attach or{" "}
                    <span className="ml-1 rounded-md border border-gray-200 px-2 py-1 text-gray-600">
                      Browse
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs text-gray-500">Start date</label>
                  <input
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-900"
                    placeholder="Select date"
                    type="date"
                    value={form.startDate}
                    onChange={(event) =>
                      updateForm("startDate", event.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Category</label>
                  <select
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-900"
                    value={form.category}
                    onChange={(event) =>
                      updateForm("category", event.target.value)
                    }
                  >
                    <option>Select...</option>
                    <option>Admin</option>
                    <option>Security</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500">Team</label>
              <input
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-900"
                placeholder="Choose a team"
                value={form.team}
                onChange={(event) => updateForm("team", event.target.value)}
              />
            </div>
            {error ? (
              <p className="text-sm text-rose-700">{error}</p>
            ) : null}
          </div>
        </div>

        <DialogFooter className="border-t border-gray-200 px-5 py-4 text-xs text-gray-500 sm:items-center sm:justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-blue-500"
              checked={createAnother}
              onChange={(event) => setCreateAnother(event.target.checked)}
            />
            Create another
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gray-200 px-4 py-2 text-xs text-gray-600 hover:bg-gray-200"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-full bg-blue-500 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create"}
            </button>
          </div>
        </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CreateTaskModal(props: CreateTaskModalProps) {
  return (
    <Suspense fallback={null}>
      <CreateTaskModalInner {...props} />
    </Suspense>
  );
}
