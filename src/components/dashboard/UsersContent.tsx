"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableToolbar } from "@/components/admin/DataTableToolbar";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { Edit2, Eye, Mail, ShieldCheck, Trash, User } from "lucide-react";
import { ApiUserRecord, getUserFullName } from "@/lib/users";

const accentClasses = [
  "from-cyan-400 to-sky-500",
  "from-emerald-400 to-teal-500",
  "from-indigo-400 to-blue-500",
  "from-amber-400 to-orange-500",
];

type SortKey = "firstName" | "email" | "createdAt";

export function UsersContent() {
  const router = useRouter();
  const { push } = useToast();
  const [search, setSearch] = useState("");
  const [records, setRecords] = useState<ApiUserRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState<SortKey>("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewType, setViewType] = useState<"list" | "grid">("list");
  const [itemToDelete, setItemToDelete] = useState<ApiUserRecord | null>(null);

  const decoratedUsers = useMemo(
    () =>
      records.map((record, index) => ({
        ...record,
        accent: accentClasses[index % accentClasses.length],
      })),
    [records]
  );

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sort,
        order,
        search,
      });

      const res = await fetch(`/api/users?${params.toString()}`, {
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to fetch users.");
      }

      const data = await res.json();
      setRecords(data.records || []);
      setTotal(data.total || 0);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch users.";
      setError(message);
      setRecords([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [limit, order, page, search, sort]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleDelete = useCallback(async () => {
    if (!itemToDelete) {
      return;
    }

    setDeleteLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/users/${itemToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete user.");
      }

      setItemToDelete(null);
      push("User deleted successfully!", "success");

      if (records.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await loadUsers();
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete user.";
      setError(message);
      push(message, "error");
    } finally {
      setDeleteLoading(false);
    }
  }, [itemToDelete, loadUsers, page, push, records.length]);

  return (
    <main className="px-6 pb-6 pt-5">
      <div className="mx-auto flex w-full max-w-full flex-1 flex-col gap-6">
        <DataTableToolbar
          search={search}
          onSearchChange={(value) => {
            setPage(1);
            setSearch(value);
          }}
          viewType={viewType}
          onViewToggle={setViewType}
          onCreateClick={() => router.push("/users/create")}
          onRefreshClick={loadUsers}
          sortOrder={order}
          onSortOrderChange={(newOrder) => {
            setSort("createdAt");
            setOrder(newOrder);
          }}
        />

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#111216] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]">
          <Table className="min-w-[1200px]">
            <TableHeader className="sticky top-0 z-10 bg-white/5">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead
                  onClick={() => setSort("firstName")}
                  className="cursor-pointer px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-100 hover:text-cyan-400"
                >
                  Name
                </TableHead>
                <TableHead
                  onClick={() => setSort("email")}
                  className="cursor-pointer px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-100 hover:text-cyan-400"
                >
                  Email
                </TableHead>
                <TableHead className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-zinc-100">
                  Username
                </TableHead>
                <TableHead className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-zinc-100">
                  Is Active
                </TableHead>
                <TableHead className="w-[150px] px-4 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-zinc-100">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-white/5">
              {decoratedUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="border-white/5 transition-colors hover:bg-white/[0.03]"
                >
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${user.accent} text-black shadow-lg`}
                      >
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-100">
                          {getUserFullName(user)}
                        </p>
                        <p className="font-mono text-[10px] tracking-tight text-zinc-500">
                          ID: {user.id}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-xs text-zinc-400">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-zinc-600" />
                      <span>{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center text-xs text-zinc-400">
                    {user.username || "N/A"}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-bold ${
                        user.loginEnabled
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                          : "border-zinc-500/20 bg-zinc-500/10 text-zinc-400"
                      }`}
                    >
                      <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                      {user.loginEnabled ? "Enabled" : "Disabled"}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => router.push(`/users/${user.id}`)}
                        className="rounded-xl p-2 text-zinc-500 transition-all active:scale-90 hover:bg-cyan-500/10 hover:text-cyan-400"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push(`/users/${user.id}/edit`)}
                        className="rounded-xl p-2 text-zinc-500 transition-all active:scale-90 hover:bg-emerald-500/10 hover:text-emerald-400"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setItemToDelete(user)}
                        className="rounded-xl p-2 text-zinc-500 transition-all active:scale-90 hover:bg-rose-500/10 hover:text-rose-400"
                        title="Delete"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {decoratedUsers.length === 0 ? (
                <TableRow className="border-white/10">
                  <TableCell
                    className="px-4 py-12 text-center text-sm text-zinc-500"
                    colSpan={5}
                  >
                    {loading ? "Loading users..." : "No users found."}
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>

        <DeleteConfirmDialog
          open={!!itemToDelete}
          onClose={() => setItemToDelete(null)}
          onConfirm={handleDelete}
          title="Delete User"
          itemName={itemToDelete ? getUserFullName(itemToDelete) : undefined}
          loading={deleteLoading}
        />

        <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-zinc-300 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Rows per page</span>
            <select
              className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-zinc-200"
              value={limit}
              onChange={(e) => {
                setPage(1);
                setLimit(Number(e.target.value));
              }}
            >
              {[5, 10, 20, 50].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-zinc-400">
              {total === 0
                ? "0-0"
                : `${(page - 1) * limit + 1}-${Math.min(page * limit, total)}`}{" "}
              of {total}
            </span>
            <div className="flex items-center gap-1">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-500 disabled:opacity-30"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                &lt;
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-600 text-white shadow-lg">
                {page}
              </button>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-200 disabled:opacity-30"
                disabled={page * limit >= total}
                onClick={() => setPage((prev) => prev + 1)}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>

        {error ? (
          <p className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-center text-xs text-rose-300">
            {error}
          </p>
        ) : null}
      </div>
    </main>
  );
}
