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
import { RecordGrid, display } from "@/components/admin/RecordGrid";
import { ListFilters, type FilterField, type FilterValues } from "@/components/admin/ListFilters";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { Edit2, Eye, Mail, ShieldCheck, Trash, User } from "lucide-react";
import { ApiUserRecord, getUserFullName } from "@/lib/users";

const accentClasses = [
  "from-blue-400 to-blue-500",
  "from-emerald-400 to-blue-500",
  "from-blue-400 to-blue-500",
  "from-amber-400 to-orange-500",
];

type SortKey = "firstName" | "email" | "createdAt";

const FILTER_FIELDS: FilterField[] = [
  { key: "roleId", label: "Role", source: "roles" },
  { key: "companyId", label: "Company", source: "companies" },
  { key: "locationId", label: "Location", source: "locations" },
  { key: "loginEnabled", label: "Login", options: [{ value: "true", label: "Enabled" }, { value: "false", label: "Disabled" }] },
];

export function UsersContent() {
  const router = useRouter();
  const { push } = useToast();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterValues>({});
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

      Object.entries(filters).forEach(([key, value]) => value && params.set(key, value));


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
  }, [limit, order, page, search, sort, filters]);

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
    <div className="space-y-6">
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
        <ListFilters
          fields={FILTER_FIELDS}
          values={filters}
          onChange={(next) => {
            setFilters(next);
            setPage(1);
          }}
        />

        {viewType === "grid" ? (
          <RecordGrid
            loading={loading}
            cards={decoratedUsers.map((user) => ({
              key: user.id,
              title: getUserFullName(user),
              subtitle: user.email,
              badge: user.loginEnabled
                ? { label: "Login enabled", className: "bg-green-100 text-green-700 hover:bg-green-100" }
                : { label: "Login disabled", className: "bg-gray-100 text-gray-700 hover:bg-gray-100" },
              stats: [{ label: "Username", value: display(user.username) }],
              onView: () => router.push(`/users/${user.id}`),
              onEdit: () => router.push(`/users/${user.id}/edit`),
              onDelete: () => setItemToDelete(user),
            }))}
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <Table className="min-w-[1200px]">
              <TableHeader className="sticky top-0 z-10 bg-gray-50">
                <TableRow className="border-gray-200 hover:bg-transparent">
                  <TableHead
                    onClick={() => setSort("firstName")}
                    className="cursor-pointer px-4 py-3 text-xs font-semibold text-gray-500 hover:text-blue-600"
                  >
                    Name
                  </TableHead>
                  <TableHead
                    onClick={() => setSort("email")}
                    className="cursor-pointer px-4 py-3 text-xs font-semibold text-gray-500 hover:text-blue-600"
                  >
                    Email
                  </TableHead>
                  <TableHead className="px-4 py-3 text-center text-xs font-semibold text-gray-500">
                    Username
                  </TableHead>
                  <TableHead className="px-4 py-3 text-center text-xs font-semibold text-gray-500">
                    Is Active
                  </TableHead>
                  <TableHead className="w-[150px] px-4 py-3 text-right text-xs font-semibold text-gray-500">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100">
                {decoratedUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="border-gray-100 transition-colors hover:bg-gray-50"
                  >
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${user.accent} text-black shadow-sm`}
                        >
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {getUserFullName(user)}
                          </p>
                          <p className="font-mono text-[10px] tracking-tight text-gray-500">
                            ID: {user.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-gray-600" />
                        <span>{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-center text-xs text-gray-500">
                      {user.username || "N/A"}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-center">
                      <span
                        className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-bold ${
                          user.loginEnabled
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                            : "border-gray-500/20 bg-gray-500/10 text-gray-400"
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
                          className="rounded-xl p-2 text-gray-500 transition-all active:scale-90 hover:bg-blue-500/10 hover:text-blue-600"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => router.push(`/users/${user.id}/edit`)}
                          className="rounded-xl p-2 text-gray-500 transition-all active:scale-90 hover:bg-emerald-500/10 hover:text-emerald-600"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setItemToDelete(user)}
                          className="rounded-xl p-2 text-gray-500 transition-all active:scale-90 hover:bg-rose-500/10 hover:text-rose-600"
                          title="Delete"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {decoratedUsers.length === 0 ? (
                  <TableRow className="border-gray-200">
                    <TableCell
                      className="px-4 py-12 text-center text-sm text-gray-500"
                      colSpan={5}
                    >
                      {loading ? "Loading users..." : "No users found."}
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        )}

        <DeleteConfirmDialog
          open={!!itemToDelete}
          onClose={() => setItemToDelete(null)}
          onConfirm={handleDelete}
          title="Delete User"
          itemName={itemToDelete ? getUserFullName(itemToDelete) : undefined}
          loading={deleteLoading}
        />

        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-xs text-gray-600 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Rows per page</span>
            <select
              className="rounded-full border border-gray-200 bg-gray-100 px-2 py-1 text-xs text-gray-800"
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
            <span className="text-gray-500">
              {total === 0
                ? "0-0"
                : `${(page - 1) * limit + 1}-${Math.min(page * limit, total)}`}{" "}
              of {total}
            </span>
            <div className="flex items-center gap-1">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-gray-500 disabled:opacity-30"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                &lt;
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
                {page}
              </button>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-gray-800 disabled:opacity-30"
                disabled={page * limit >= total}
                onClick={() => setPage((prev) => prev + 1)}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>

        {error ? (
          <p className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-center text-xs text-rose-700">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
