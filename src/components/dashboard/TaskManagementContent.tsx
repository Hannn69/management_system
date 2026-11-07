"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { UpdateTaskModal } from "@/components/dashboard/UpdateTaskModal";
import type { ApiRecord } from "@/lib/types";
import { DeleteTaskModal } from "@/components/dashboard/DeleteTaskModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Task = {
  key: string;
  slug: string;
  summary: string;
  status: string;
  priority: string;
  assignee: string;
  updated: string;
  space: string;
  workType: string;
  description: string;
  reporter: string;
  labels: string;
  dueDate: string;
  startDate: string;
  category: string;
  team: string;
};

const statusStyles: Record<string, string> = {
  "To do": "bg-gray-500/15 text-gray-700 ",
  "In progress": "bg-amber-500/15 text-amber-700 ",
  Review: "bg-blue-500/15 text-blue-700 ",
  Done: "bg-emerald-500/15 text-emerald-700 ",
};

const priorityStyles: Record<string, string> = {
  High: "bg-rose-500/15 text-rose-700 ",
  Medium: "bg-amber-500/15 text-amber-700 ",
  Low: "bg-emerald-500/15 text-emerald-700 ",
};

type TaskManagementContentProps = {
  spaceKey?: string;
  spaceName?: string;
  lockSpace?: boolean;
};

function TaskManagementContentInner({
  spaceKey,
  spaceName,
  lockSpace = false,
}: TaskManagementContentProps) {
  const searchParams = useSearchParams();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sort, setSort] = useState("updatedAt");
  const [order, setOrder] = useState("desc");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [spaceFilter, setSpaceFilter] = useState("");
  const [spaces, setSpaces] = useState<Array<{ name: string; key: string }>>(
    []
  );
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => window.clearTimeout(handle);
  }, [search]);

  useEffect(() => {
    if (lockSpace && spaceKey) {
      setSpaceFilter(spaceKey);
      return;
    }
    const param = searchParams?.get("space") ?? "";
    setSpaceFilter(param);
  }, [lockSpace, searchParams, spaceKey]);

  const resolvedSpaceLabel = useMemo(() => {
    if (!spaceFilter) {
      return "";
    }
    if (spaceName && spaceKey && spaceFilter === spaceKey) {
      return `${spaceName} (${spaceKey})`;
    }
    const match = spaces.find((space) => space.key === spaceFilter);
    return match ? `${match.name} (${match.key})` : spaceFilter;
  }, [spaceFilter, spaces, spaceName, spaceKey]);

  useEffect(() => {
    setSpaces([]);
  }, []);

  useEffect(() => {
    let active = true;
    const loadTasks = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          sort,
          order,
        });
        if (debouncedSearch.trim()) {
          params.set("search", debouncedSearch.trim());
        }
        if (statusFilter !== "All") {
          params.set("status", statusFilter);
        }
        if (spaceFilter) {
          params.set("space", spaceFilter);
        }
        const res = await fetch(`${apiBase}/tasks?${params.toString()}`, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to load tasks.");
        }
        const data = await res.json();
        if (!Array.isArray(data.tasks)) {
          throw new Error("Invalid tasks response.");
        }
        const mapped: Task[] = data.tasks.map((task: ApiRecord) => ({
          key: task.key,
          slug: task.slug,
          summary: task.summary,
          status: task.status,
          priority: task.priority ?? "Medium",
          assignee: task.assignee ?? "Unassigned",
          updated: formatRelative(task.updatedAt ?? task.createdAt),
          space: task.space ?? "task (TASK)",
          workType: task.workType ?? "Task",
          description: task.description ?? "",
          reporter: task.reporter ?? "",
          labels: task.labels ?? "",
          dueDate: task.dueDate ?? "",
          startDate: task.startDate ?? "",
          category: task.category ?? "",
          team: task.team ?? "",
        }));
        if (!active) {
          return;
        }
        setTasks(mapped);
        if (typeof data.total === "number") {
          setTotal(data.total);
        } else {
          setTotal(mapped.length);
        }
      } catch (err) {
        if (active) {
          setTasks([]);
          setTotal(0);
          setLoadError(err instanceof Error ? err.message : "Failed to load.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadTasks();
    const handler = () => loadTasks();
    window.addEventListener("task:created", handler);
    window.addEventListener("task:updated", handler);
    window.addEventListener("task:deleted", handler);
    return () => {
      active = false;
      window.removeEventListener("task:created", handler);
      window.removeEventListener("task:updated", handler);
      window.removeEventListener("task:deleted", handler);
    };
  }, [
    apiBase,
    page,
    limit,
    sort,
    order,
    debouncedSearch,
    statusFilter,
    spaceFilter,
  ]);

  const formatRelative = (value?: string) => {
    if (!value) {
      return "just now";
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) return "recently";
    const diffMs = Date.now() - date.getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 60) {
      return `${Math.max(minutes, 1)}m ago`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours}h ago`;
    }
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="flex flex-1 flex-col gap-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-500">
          Your work / Task management
          {resolvedSpaceLabel ? (
            <span className="ml-2 rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
              {resolvedSpaceLabel}
            </span>
          ) : null}
        </p>
        <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {["All", "To do", "In progress", "Review", "Done"].map((item) => (
              <button
                key={item}
                className={`rounded-full border border-gray-200  px-4 py-1.5 text-xs font-medium transition ${
                  statusFilter === item
                    ? "bg-gray-900 text-white "
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900   "
                }`}
                type="button"
                onClick={() => {
                  setStatusFilter(item);
                  setPage(1);
                }}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <div className="flex w-full items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-4 py-2 text-sm text-gray-600 sm:max-w-[320px]">
              <svg
                aria-hidden
                className="h-4 w-4 text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m16.5 16.5 4 4" />
              </svg>
              <input
                className="w-full bg-transparent text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none"
                placeholder="Search tasks"
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500" htmlFor="sort">
                Sort
              </label>
              <select
                id="sort"
                className="rounded-full border border-gray-200 bg-gray-100 px-3 py-2 text-xs text-gray-800"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <option value="updatedAt">Last updated</option>
                <option value="createdAt">Created</option>
                <option value="priority">Priority</option>
                <option value="status">Status</option>
              </select>
              <select
                className="rounded-full border border-gray-200 bg-gray-100 px-3 py-2 text-xs text-gray-800"
                value={order}
                onChange={(event) => setOrder(event.target.value)}
              >
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <Table className="min-w-[920px]">
              <TableHeader className="bg-gray-50">
                <TableRow className="border-gray-200">
                  <TableHead className="w-[120px] px-5">Key</TableHead>
                  <TableHead className="px-3">Summary</TableHead>
                  <TableHead className="w-[140px] px-3">Status</TableHead>
                  <TableHead className="w-[120px] px-3">Priority</TableHead>
                  <TableHead className="w-[140px] px-3">Assignee</TableHead>
                  <TableHead className="w-[110px] px-3">Updated</TableHead>
                  <TableHead className="w-[180px] px-3">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-200">
                {loading ? (
                  <TableRow className="border-gray-200">
                    <TableCell
                      colSpan={7}
                      className="px-5 py-6 text-sm text-gray-500"
                    >
                      Loading tasks...
                    </TableCell>
                  </TableRow>
                ) : null}
                {!loading && !tasks.length ? (
                  <TableRow className="border-gray-200">
                    <TableCell
                      colSpan={7}
                      className="px-5 py-6 text-sm text-gray-500"
                    >
                      No tasks found.
                    </TableCell>
                  </TableRow>
                ) : null}
                {tasks.map((task, index) => (
                  <TableRow
                    key={task.key}
                    className={`border-gray-200  transition-colors hover:bg-gray-100  ${
                      index % 2 === 1 ? "bg-gray-50 " : ""
                    }`}
                  >
                    <TableCell className="px-5 text-xs font-semibold text-gray-500">
                      {task.key}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900">
                      {task.summary}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm ${
                          statusStyles[task.status]
                        }`}
                      >
                        {task.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm ${
                          priorityStyles[task.priority]
                        }`}
                      >
                        {task.priority}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {task.assignee}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">
                      {task.updated}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/task-management/${task.slug}`}
                          className="w-fit rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs text-gray-800 transition hover:bg-gray-200"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => setEditTask(task)}
                          className="w-fit rounded-full border border-blue-400/40 bg-blue-500/10 px-3 py-1 text-xs text-blue-700 transition hover:bg-blue-500/20"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="w-fit rounded-full border border-rose-400/40 bg-rose-500/10 px-3 py-1 text-xs text-rose-700 hover:bg-rose-500/20"
                          onClick={() => setDeleteTask(task)}
                        >
                          Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-xs text-gray-600 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Rows per page</span>
            <select
              className="rounded-full border border-gray-200 bg-gray-100 px-2 py-1 text-xs text-gray-800"
              value={limit}
              onChange={(event) => {
                setPage(1);
                setLimit(Number(event.target.value));
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-500">
              {total === 0
                ? "0-0"
                : `${(page - 1) * limit + 1}-${Math.min(
                    page * limit,
                    total
                  )}`}{" "}
              of {total}
            </span>
            <div className="flex items-center gap-1">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-gray-500"
                type="button"
                aria-label="Previous page"
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                &lt;
              </button>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-200"
                type="button"
                aria-label="Next page"
                disabled={page * limit >= total}
                onClick={() => setPage((prev) => prev + 1)}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
      {loadError ? (
        <p className="text-xs text-rose-700">{loadError}</p>
      ) : null}
      <UpdateTaskModal
        open={!!editTask}
        task={editTask}
        onClose={() => setEditTask(null)}
      />
      <DeleteTaskModal
        open={!!deleteTask}
        task={deleteTask}
        onClose={() => setDeleteTask(null)}
      />
    </div>
  );
}

export function TaskManagementContent(props: TaskManagementContentProps) {
  return (
    <Suspense fallback={null}>
      <TaskManagementContentInner {...props} />
    </Suspense>
  );
}
