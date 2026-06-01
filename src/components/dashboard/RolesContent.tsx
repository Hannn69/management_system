"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Check,
  Edit2,
  Ellipsis,
  Eye,
  Fingerprint,
  Search,
  ShieldCheck,
  Trash,
  UserPlus,
} from "lucide-react";
import {
  emptyRoleForm,
  RoleFormState,
  RolePermissionRecord,
  RoleRecord,
} from "@/lib/roles";
import { ApiUserRecord, getUserFullName } from "@/lib/users";

const accentClasses = [
  "from-emerald-400 to-teal-500",
  "from-cyan-400 to-sky-500",
  "from-indigo-400 to-blue-500",
  "from-amber-400 to-orange-500",
];

type SortKey = "name" | "description" | "createdAt";

export function RolesContent() {
  const router = useRouter();
  const { push } = useToast();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  const menuButtonRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const [records, setRecords] = useState<RoleRecord[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState<SortKey>("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [viewType, setViewType] = useState<"list" | "grid">("list");
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [assigningUsers, setAssigningUsers] = useState(false);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [savingPermissions, setSavingPermissions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [assignUsersOpen, setAssignUsersOpen] = useState(false);
  const [viewUsersOpen, setViewUsersOpen] = useState(false);
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [createForm, setCreateForm] = useState<RoleFormState>(emptyRoleForm);
  const [itemToDelete, setItemToDelete] = useState<RoleRecord | null>(null);
  const [permissionRows, setPermissionRows] = useState<RolePermissionRecord[]>([]);
  const [availableUsers, setAvailableUsers] = useState<ApiUserRecord[]>([]);
  const [roleUsers, setRoleUsers] = useState<ApiUserRecord[]>([]);
  const [viewRole, setViewRole] = useState<RoleRecord | null>(null);
  const [roleUsersLoading, setRoleUsersLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [assignUserSearch, setAssignUserSearch] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<Array<number | string>>(
    []
  );

  const filteredRoles = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = records.filter((role) => {
      if (!query) {
        return true;
      }

      return (
        role.name.toLowerCase().includes(query) ||
        role.description.toLowerCase().includes(query) ||
        role.slug.toLowerCase().includes(query)
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      const aValue =
        sort === "createdAt" ? a.createdAt : (a[sort] || "").toString();
      const bValue =
        sort === "createdAt" ? b.createdAt : (b[sort] || "").toString();

      return order === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

    return sorted.map((role, index) => ({
      ...role,
      accent: accentClasses[index % accentClasses.length],
    }));
  }, [order, records, search, sort]);

  const total = filteredRoles.length;
  const paginatedRoles = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredRoles.slice(start, start + limit);
  }, [filteredRoles, limit, page]);

  const activeRole = useMemo(
    () => records.find((role) => role.id === openMenuId) ?? null,
    [openMenuId, records]
  );

  const permissionRole = useMemo(
    () => records.find((role) => role.id === openMenuId) ?? null,
    [openMenuId, records]
  );

  const assignRole = useMemo(
    () => records.find((role) => role.id === openMenuId) ?? null,
    [openMenuId, records]
  );

  const filteredAssignableUsers = useMemo(() => {
    const query = assignUserSearch.trim().toLowerCase();

    return availableUsers.filter((user) => {
      if (!query) {
        return true;
      }

      const fullName = getUserFullName(user).toLowerCase();
      return (
        fullName.includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.username || "").toLowerCase().includes(query)
      );
    });
  }, [assignUserSearch, availableUsers]);

  const loadRoles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiBase}/roles`, {
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch roles.");
      }

      const data = await res.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch roles.";
      setError(message);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  useEffect(() => {
    if (openMenuId === null) {
      return;
    }

    const button = menuButtonRefs.current[openMenuId];
    if (!button) {
      return;
    }

    const updatePosition = () => {
      const rect = button.getBoundingClientRect();
      setMenuPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX - 182,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [openMenuId]);

  const handleCreateRole = async () => {
    if (!createForm.name.trim()) {
      return;
    }

    setCreateLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiBase}/roles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: createForm.name.trim(),
          description: createForm.description.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to create role.");
      }

      push("Role created successfully!", "success");
      setCreateForm(emptyRoleForm);
      setCreateOpen(false);
      setPage(1);
      await loadRoles();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create role.";
      setError(message);
      push(message, "error");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteRole = async () => {
    if (!itemToDelete) {
      return;
    }

    setDeleteLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiBase}/roles/${itemToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete role.");
      }

      push("Role deleted successfully!", "success");
      setItemToDelete(null);

      if (paginatedRoles.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await loadRoles();
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete role.";
      setError(message);
      push(message, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const loadAssignableUsers = useCallback(async () => {
    setUsersLoading(true);

    try {
      const params = new URLSearchParams({
        page: "1",
        limit: "200",
        sort: "createdAt",
        order: "desc",
        search: "",
      });

      const res = await fetch(`/api/users?${params.toString()}`, {
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to load users.");
      }

      const data = await res.json();
      setAvailableUsers(data.records || []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load users.";
      setError(message);
      push(message, "error");
      setAvailableUsers([]);
    } finally {
      setUsersLoading(false);
    }
  }, [push]);

  const openAssignUsersDialog = async (roleId: number) => {
    setOpenMenuId(roleId);
    setMenuPosition(null);
    setAssignUserSearch("");
    setSelectedUserIds([]);
    setAssignUsersOpen(true);

    try {
      const [, roleUsersRes] = await Promise.all([
        loadAssignableUsers(),
        fetch(`${apiBase}/roles/${roleId}/users`, {
          credentials: "include",
          cache: "no-store",
        }),
      ]);

      if (!roleUsersRes.ok) {
        const data = await roleUsersRes.json().catch(() => ({}));
        throw new Error(data.message || "Failed to load assigned users.");
      }

      const data = await roleUsersRes.json();
      setSelectedUserIds(
        Array.isArray(data.users)
          ? data.users.map((user: ApiUserRecord) => user.id)
          : []
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load assigned users.";
      setError(message);
      push(message, "error");
    }
  };

  const openViewUsersDialog = async (role: RoleRecord) => {
    setOpenMenuId(null);
    setMenuPosition(null);
    setViewRole(role);
    setRoleUsers([]);
    setRoleUsersLoading(true);
    setViewUsersOpen(true);

    try {
      const res = await fetch(`${apiBase}/roles/${role.id}/users`, {
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to load assigned users.");
      }

      const data = await res.json();
      setRoleUsers(Array.isArray(data.users) ? data.users : []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load assigned users.";
      setError(message);
      push(message, "error");
      setViewUsersOpen(false);
    } finally {
      setRoleUsersLoading(false);
    }
  };

  const toggleUser = (userId: number | string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((currentId) => currentId !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAllUsers = () => {
    const visibleIds = filteredAssignableUsers.map((user) => user.id);
    const allVisibleSelected =
      visibleIds.length > 0 &&
      visibleIds.every((userId) => selectedUserIds.includes(userId));

    if (allVisibleSelected) {
      setSelectedUserIds((prev) =>
        prev.filter((userId) => !visibleIds.includes(userId))
      );
      return;
    }

    setSelectedUserIds((prev) => [...new Set([...prev, ...visibleIds])]);
  };

  const handleAssignUsers = async () => {
    if (!assignRole) {
      return;
    }

    setAssigningUsers(true);
    setError(null);

    try {
      const res = await fetch(`${apiBase}/roles/${assignRole.id}/users`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userIds: selectedUserIds.map(Number),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to assign users.");
      }

      push(
        `${selectedUserIds.length} user${selectedUserIds.length === 1 ? "" : "s"} assigned to ${assignRole.name}.`,
        "success"
      );
      setAssignUsersOpen(false);
      await loadRoles();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to assign users.";
      setError(message);
      push(message, "error");
    } finally {
      setAssigningUsers(false);
    }
  };

  const openPermissionsDialog = async (roleId: number) => {
    setPermissionsLoading(true);
    setPermissionRows([]);
    setPermissionsOpen(true);
    setOpenMenuId(roleId);
    setMenuPosition(null);

    try {
      const res = await fetch(`${apiBase}/roles/${roleId}/permissions`, {
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to load permissions.");
      }

      const data = await res.json();
      setPermissionRows(Array.isArray(data) ? data : []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load permissions.";
      setError(message);
      push(message, "error");
      setPermissionsOpen(false);
    } finally {
      setPermissionsLoading(false);
    }
  };

  const updatePermissionCell = (
    permissionId: number,
    field: "create" | "read" | "update" | "delete",
    value: boolean
  ) => {
    setPermissionRows((prev) =>
      prev.map((row) =>
        row.permissionId === permissionId ? { ...row, [field]: value } : row
      )
    );
  };

  const handleSavePermissions = async () => {
    if (!permissionRole) {
      return;
    }

    setSavingPermissions(true);
    setError(null);

    try {
      await Promise.all(
        permissionRows.map((row) =>
          fetch(`${apiBase}/roles/${permissionRole.id}/permissions/${row.permissionId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              create: row.create,
              read: row.read,
              update: row.update,
              delete: row.delete,
            }),
          }).then(async (res) => {
            if (!res.ok) {
              const data = await res.json().catch(() => ({}));
              throw new Error(
                data.message ||
                  `Failed to update ${row.permission?.label || row.permissionId}.`
              );
            }
            return res.json();
          })
        )
      );

      push("Permissions updated successfully!", "success");
      setPermissionsOpen(false);
      await loadRoles();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update permissions.";
      setError(message);
      push(message, "error");
    } finally {
      setSavingPermissions(false);
    }
  };

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
          onCreateClick={() => setCreateOpen(true)}
          onRefreshClick={loadRoles}
          sortOrder={order}
          onSortOrderChange={setOrder}
        />

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#111216] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]">
          <Table className="w-full table-fixed">
            <TableHeader className="sticky top-0 z-10 bg-white/5">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead
                  onClick={() => setSort("name")}
                  className="w-[28%] cursor-pointer px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-100 hover:text-emerald-400"
                >
                  Role
                </TableHead>
                <TableHead
                  onClick={() => setSort("description")}
                  className="cursor-pointer px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-100 hover:text-emerald-400"
                >
                  Description
                </TableHead>
                <TableHead className="w-[16%] px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-zinc-100">
                  Users
                </TableHead>
                <TableHead className="w-[14%] px-4 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-zinc-100">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-white/5">
              {paginatedRoles.map((role) => (
                <TableRow
                  key={role.id}
                  className="border-white/5 transition-colors hover:bg-white/[0.03]"
                >
                  <TableCell className="w-[28%] px-4 py-4 align-middle">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${role.accent} text-black shadow-lg`}
                      >
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-100">
                          {role.name}
                        </p>
                        <p className="font-mono text-[10px] tracking-tight text-zinc-500">
                          {role.slug}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 align-middle text-sm text-zinc-300">
                    <p className="max-w-[44rem] text-sm leading-6 text-zinc-300">
                      {role.description || "No description provided."}
                    </p>
                  </TableCell>
                  <TableCell className="w-[16%] px-4 py-4 align-middle text-center">
                    <span className="inline-flex min-w-[80px] items-center justify-center rounded-full border border-[#2d3442] bg-[#1e293b] px-3 py-2 text-xs font-semibold text-white shadow-sm">
                      {role._count?.users || 0} users
                    </span>
                  </TableCell>
                  <TableCell className="w-[14%] overflow-visible px-4 py-4 align-middle text-right">
                    <div className="relative inline-flex items-center justify-end">
                      <button
                        type="button"
                        ref={(element) => {
                          menuButtonRefs.current[role.id] = element;
                        }}
                        onClick={() =>
                          setOpenMenuId((prev) =>
                            prev === role.id ? null : role.id
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3b82f6] text-white transition-all hover:bg-[#2563eb]"
                        title="Open Actions"
                      >
                        <Ellipsis className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedRoles.length === 0 ? (
                <TableRow className="border-white/10">
                  <TableCell
                    className="px-4 py-12 text-center text-sm text-zinc-500"
                    colSpan={4}
                  >
                    {loading ? "Loading roles..." : "No roles found."}
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>

        {openMenuId !== null && menuPosition ? (
          <div
            className="fixed z-50 min-w-[170px] rounded-xl border border-[#3b3a34] bg-[#1e1c19] p-2 shadow-[0_18px_45px_-20px_rgba(0,0,0,0.9)]"
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
            }}
          >
            <button
              type="button"
              onClick={() => {
                if (activeRole) {
                  openViewUsersDialog(activeRole);
                }
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-zinc-100 transition hover:bg-white/5"
            >
              <Eye className="h-4 w-4 text-zinc-300" />
              <span>View Users</span>
            </button>
            <button
              type="button"
              onClick={() => openAssignUsersDialog(openMenuId)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-zinc-100 transition hover:bg-white/5"
            >
              <UserPlus className="h-4 w-4 text-zinc-300" />
              <span>Assign User</span>
            </button>
            <button
              type="button"
              onClick={() => openPermissionsDialog(openMenuId)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-zinc-100 transition hover:bg-white/5"
            >
              <Fingerprint className="h-4 w-4 text-zinc-300" />
              <span>Permission</span>
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-zinc-100 transition hover:bg-white/5"
              onClick={() => {
                router.push(`/roles/${openMenuId}/edit`);
                setOpenMenuId(null);
              }}
            >
              <Edit2 className="h-4 w-4 text-zinc-300" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-500 transition hover:bg-white/5"
              onClick={() => {
                if (activeRole) {
                  setItemToDelete(activeRole);
                }
                setOpenMenuId(null);
              }}
            >
              <Trash className="h-4 w-4" />
              <span>Delete</span>
            </button>
          </div>
        ) : null}

        <DeleteConfirmDialog
          open={!!itemToDelete}
          onClose={() => setItemToDelete(null)}
          onConfirm={handleDeleteRole}
          title="Delete Role"
          itemName={itemToDelete?.name}
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
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg">
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

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent className="max-w-md border-white/10 bg-[#111216] p-0">
            <div className="flex flex-col">
              <DialogHeader className="border-b border-white/10 px-6 py-5">
                <DialogTitle className="text-xl font-bold text-white">
                  Create Role
                </DialogTitle>
                <DialogDescription>
                  Add a role name and a short description.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5 px-6 py-5">
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Role Name
                  </label>
                  <input
                    type="text"
                    placeholder="Admin, Editor, Viewer..."
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    value={createForm.name}
                    onChange={(e) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe this role..."
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    value={createForm.description}
                    onChange={(e) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <DialogFooter className="justify-end gap-3 border-t border-white/10 px-6 py-5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-bold text-zinc-300 transition hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateRole}
                  disabled={createLoading}
                  className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {createLoading ? "Creating..." : "Create"}
                </button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={assignUsersOpen} onOpenChange={setAssignUsersOpen}>
          <DialogContent className="max-w-2xl border-white/10 bg-[#111216] p-0">
            <div className="flex flex-col">
              <DialogHeader className="border-b border-white/10 px-6 py-5">
                <DialogTitle className="text-xl font-bold text-white">
                  Assign User
                </DialogTitle>
                <DialogDescription>
                  Search and select users for{" "}
                  <span className="font-medium text-zinc-200">
                    {assignRole?.name ?? "Selected Role"}
                  </span>
                  .
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 px-6 py-5">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search users by name, email, or username..."
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    value={assignUserSearch}
                    onChange={(e) => setAssignUserSearch(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSelectAllUsers}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/10"
                >
                  <span className="flex h-4 w-4 items-center justify-center rounded border border-white/20 bg-white/5">
                    {filteredAssignableUsers.length > 0 &&
                    filteredAssignableUsers.every((user) =>
                      selectedUserIds.includes(user.id)
                    ) ? (
                      <Check className="h-3 w-3 text-cyan-400" />
                    ) : null}
                  </span>
                  Select All Visible
                </button>

                <div className="max-h-[380px] overflow-y-auto rounded-2xl border border-white/10 bg-white/[0.03]">
                  {usersLoading ? (
                    <div className="px-4 py-10 text-center text-sm text-zinc-500">
                      Loading users...
                    </div>
                  ) : filteredAssignableUsers.length === 0 ? (
                    <div className="px-4 py-10 text-center text-sm text-zinc-500">
                      No users found.
                    </div>
                  ) : (
                    <div className="divide-y divide-white/5">
                      {filteredAssignableUsers.map((user) => {
                        const checked = selectedUserIds.includes(user.id);

                        return (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => toggleUser(user.id)}
                            className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/5"
                          >
                            <span
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                                checked
                                  ? "border-cyan-500 bg-cyan-500 text-white"
                                  : "border-white/20 bg-white/5 text-transparent"
                              }`}
                            >
                              <Check className="h-3.5 w-3.5" />
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-zinc-100">
                                {getUserFullName(user)}
                              </p>
                              <p className="truncate text-xs text-zinc-400">
                                {user.email}
                                {user.username ? ` • @${user.username}` : ""}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter className="justify-end gap-3 border-t border-white/10 px-6 py-5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setAssignUsersOpen(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-bold text-zinc-300 transition hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAssignUsers}
                  disabled={usersLoading || assigningUsers}
                  className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {assigningUsers ? "Saving..." : "Save Users"}
                </button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={viewUsersOpen} onOpenChange={setViewUsersOpen}>
          <DialogContent className="max-w-2xl border-white/10 bg-[#111216] p-0">
            <div className="flex flex-col">
              <DialogHeader className="border-b border-white/10 px-6 py-5">
                <DialogTitle className="text-xl font-bold text-white">
                  Users With {viewRole?.name ?? "Selected Role"}
                </DialogTitle>
                <DialogDescription>
                  {roleUsers.length} user{roleUsers.length === 1 ? "" : "s"} assigned to this role.
                </DialogDescription>
              </DialogHeader>

              <div className="max-h-[440px] overflow-y-auto px-6 py-5">
                {roleUsersLoading ? (
                  <div className="py-10 text-center text-sm text-zinc-500">
                    Loading users...
                  </div>
                ) : roleUsers.length === 0 ? (
                  <div className="py-10 text-center text-sm text-zinc-500">
                    No users are assigned to this role.
                  </div>
                ) : (
                  <div className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                    {roleUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between gap-4 px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-zinc-100">
                            {getUserFullName(user)}
                          </p>
                          <p className="truncate text-xs text-zinc-400">
                            {user.email}
                            {user.username ? ` | @${user.username}` : ""}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                            user.loginEnabled === false
                              ? "bg-red-500/10 text-red-300"
                              : "bg-emerald-500/10 text-emerald-300"
                          }`}
                        >
                          {user.loginEnabled === false ? "Disabled" : "Active"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <DialogFooter className="justify-end border-t border-white/10 px-6 py-5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setViewUsersOpen(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-bold text-zinc-300 transition hover:bg-white/10"
                >
                  Close
                </button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={permissionsOpen} onOpenChange={setPermissionsOpen}>
          <DialogContent className="max-w-4xl border-white/10 bg-[#111216] p-0">
            <div className="flex flex-col">
              <DialogHeader className="border-b border-white/10 px-6 py-5">
                <DialogTitle className="text-xl font-bold text-white">
                  Assign Permissions
                </DialogTitle>
                <DialogDescription>
                  Configure module permissions for{" "}
                  <span className="font-medium text-zinc-200">
                    {permissionRole?.name ?? "Selected Role"}
                  </span>
                  .
                </DialogDescription>
              </DialogHeader>

              <div className="px-6 py-5">
                <div className="overflow-hidden rounded-2xl border border-white/10">
                  <Table className="min-w-full">
                    <TableHeader className="bg-white/5">
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-100">
                          Module
                        </TableHead>
                        <TableHead className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-zinc-100">
                          Create
                        </TableHead>
                        <TableHead className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-zinc-100">
                          Read
                        </TableHead>
                        <TableHead className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-zinc-100">
                          Update
                        </TableHead>
                        <TableHead className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-zinc-100">
                          Delete
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-white/5">
                      {permissionsLoading ? (
                        <TableRow className="border-white/10">
                          <TableCell
                            colSpan={5}
                            className="px-4 py-10 text-center text-sm text-zinc-500"
                          >
                            Loading permissions...
                          </TableCell>
                        </TableRow>
                      ) : permissionRows.length === 0 ? (
                        <TableRow className="border-white/10">
                          <TableCell
                            colSpan={5}
                            className="px-4 py-10 text-center text-sm text-zinc-500"
                          >
                            No permissions found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        permissionRows.map((row) => (
                          <TableRow
                            key={row.permissionId}
                            className="border-white/5 hover:bg-white/[0.03]"
                          >
                            <TableCell className="px-4 py-4 text-sm font-medium text-zinc-200">
                              {row.permission?.label || row.permission?.name || row.slug}
                            </TableCell>
                            {(["create", "read", "update", "delete"] as const).map(
                              (permissionKey) => (
                                <TableCell
                                  key={`${row.permissionId}-${permissionKey}`}
                                  className="px-4 py-4 text-center"
                                >
                                  <label className="inline-flex cursor-pointer items-center justify-center">
                                    <input
                                      type="checkbox"
                                      checked={row[permissionKey]}
                                      onChange={(e) =>
                                        updatePermissionCell(
                                          row.permissionId,
                                          permissionKey,
                                          e.target.checked
                                        )
                                      }
                                      className="sr-only"
                                    />
                                    <span
                                      className={`flex h-5 w-5 items-center justify-center rounded border transition ${
                                        row[permissionKey]
                                          ? "border-cyan-500 bg-cyan-500 text-white"
                                          : "border-white/20 bg-white/5 text-transparent"
                                      }`}
                                    >
                                      <Check className="h-3.5 w-3.5" />
                                    </span>
                                  </label>
                                </TableCell>
                              )
                            )}
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <DialogFooter className="justify-end gap-3 border-t border-white/10 px-6 py-5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setPermissionsOpen(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-bold text-zinc-300 transition hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePermissions}
                  disabled={permissionsLoading || savingPermissions}
                  className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingPermissions ? "Saving..." : "Save Changes"}
                </button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {error ? (
          <p className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-center text-xs text-rose-300">
            {error}
          </p>
        ) : null}
      </div>
    </main>
  );
}
