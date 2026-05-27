"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  Edit2,
  Ellipsis,
  Fingerprint,
  ChevronDown,
  Check,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";

const seedRoles = [
  {
    id: 1,
    name: "Asset Control",
    description: "Manage asset records, assignment, and status updates.",
    users: ["2 assigned"],
  },
  {
    id: 2,
    name: "Request Review",
    description: "Review submitted requests and approve workflow changes.",
    users: ["1 assigned"],
  },
  {
    id: 3,
    name: "Read Only Access",
    description: "Allow dashboard visibility without edit privileges.",
    users: ["4 assigned"],
  },
];

const accentClasses = [
  "from-emerald-400 to-teal-500",
  "from-cyan-400 to-sky-500",
  "from-indigo-400 to-blue-500",
  "from-amber-400 to-orange-500",
];

const availableUsers = [
  "Asset Team Lead",
  "Operations Reviewer",
  "Support Coordinator",
  "Space Manager",
  "Inventory Clerk",
  "Audit Observer",
];

const permissionModules = [
  "API",
  "Buckets",
  "Media Library",
  "Permissions",
  "Roles",
  "Spaces",
  "Users",
] as const;

type SortKey = "name" | "description";

export function RolesContent() {
  const router = useRouter();
  const menuButtonRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const [roles, setRoles] = useState(seedRoles);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState<SortKey>("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [viewType, setViewType] = useState<"list" | "grid">("list");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [assignRoleOpen, setAssignRoleOpen] = useState(false);
  const [assignPermissionsOpen, setAssignPermissionsOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
  });
  const [assignUserSearch, setAssignUserSearch] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [permissionsState, setPermissionsState] = useState<
    Record<
      (typeof permissionModules)[number],
      { create: boolean; read: boolean; update: boolean; delete: boolean }
    >
  >({
    API: { create: false, read: true, update: false, delete: false },
    Buckets: { create: false, read: false, update: false, delete: false },
    "Media Library": {
      create: false,
      read: true,
      update: false,
      delete: false,
    },
    Permissions: { create: false, read: true, update: false, delete: false },
    Roles: { create: false, read: true, update: false, delete: false },
    Spaces: { create: false, read: true, update: false, delete: false },
    Users: { create: false, read: true, update: false, delete: false },
  });

  const filteredRoles = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = roles.filter((role) => {
      return (
        role.name.toLowerCase().includes(query) ||
        role.description.toLowerCase().includes(query)
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      const aValue = a[sort];
      const bValue = b[sort];

      return order === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

    return sorted.map((role, index) => ({
      ...role,
      accent: accentClasses[index % accentClasses.length],
    }));
  }, [order, roles, search, sort]);

  const total = filteredRoles.length;
  const paginatedRoles = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredRoles.slice(start, start + limit);
  }, [filteredRoles, limit, page]);

  const activeRole = useMemo(
    () => roles.find((role) => role.id === openMenuId) ?? null,
    [openMenuId, roles]
  );

  const filteredAssignableUsers = useMemo(() => {
    const query = assignUserSearch.trim().toLowerCase();
    return availableUsers.filter((user) => user.toLowerCase().includes(query));
  }, [assignUserSearch]);

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

  const handleCreateRole = () => {
    if (!createForm.name.trim()) {
      return;
    }

    setRoles((prev) => [
      {
        id: prev.length + 1,
        name: createForm.name.trim(),
        description: createForm.description.trim() || "No description provided.",
        users: ["0 assigned"],
      },
      ...prev,
    ]);
    setCreateForm({ name: "", description: "" });
    setCreateOpen(false);
    setPage(1);
  };

  const toggleUser = (user: string) => {
    setSelectedUsers((prev) =>
      prev.includes(user) ? prev.filter((item) => item !== user) : [...prev, user]
    );
  };

  const handleSelectAllUsers = () => {
    const allVisibleSelected =
      filteredAssignableUsers.length > 0 &&
      filteredAssignableUsers.every((user) => selectedUsers.includes(user));

    if (allVisibleSelected) {
      setSelectedUsers((prev) =>
        prev.filter((user) => !filteredAssignableUsers.includes(user))
      );
      return;
    }

    setSelectedUsers((prev) => [
      ...new Set([...prev, ...filteredAssignableUsers]),
    ]);
  };

  const openAssignUsersDialog = () => {
    setAssignRoleOpen(true);
    setUserDropdownOpen(false);
    setAssignUserSearch("");
    setOpenMenuId(null);
  };

  const openPermissionsDialog = () => {
    setAssignPermissionsOpen(true);
    setOpenMenuId(null);
  };

  return (
    <main className="px-6 pb-6 pt-5">
      <div className="mx-auto w-full max-w-full flex flex-1 flex-col gap-6">
        <DataTableToolbar
          search={search}
          onSearchChange={(value) => {
            setPage(1);
            setSearch(value);
          }}
          viewType={viewType}
          onViewToggle={setViewType}
          onCreateClick={() => setCreateOpen(true)}
          sortOrder={order}
          onSortOrderChange={setOrder}
        />

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#111216] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]">
          <Table className="min-w-[1100px]">
            <TableHeader className="bg-white/5 sticky top-0 z-10">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead
                  onClick={() => setSort("name")}
                  className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px] cursor-pointer hover:text-emerald-400"
                >
                  Role
                </TableHead>
                <TableHead
                  onClick={() => setSort("description")}
                  className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px] cursor-pointer hover:text-emerald-400"
                >
                  Description
                </TableHead>
                <TableHead className="px-4 py-3 text-center text-zinc-100 font-bold uppercase tracking-widest text-[10px]">
                  Users
                </TableHead>
                <TableHead className="w-[220px] px-4 py-3 text-right text-zinc-100 font-bold uppercase tracking-widest text-[10px]">
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
                  <TableCell className="px-4 py-4">
                    <div>
                      <p className="text-sm font-bold text-zinc-100">
                        {role.name}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-sm text-zinc-300">
                    <p className="max-w-[480px] text-sm text-zinc-300">
                      {role.description}
                    </p>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center">
                      {role.users.map((userCode, index) => (
                        <span
                          key={`${role.id}-${userCode}-${index}`}
                          className={`${
                            index > 0 ? "-ml-2" : ""
                          } inline-flex min-w-[88px] items-center justify-center rounded-full border border-[#2d3442] bg-[#2c2a22] px-3 py-2 text-xs font-semibold text-white shadow-sm`}
                        >
                          {userCode}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-right overflow-visible">
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
              {paginatedRoles.length === 0 && (
                <TableRow className="border-white/10">
                  <TableCell
                    className="px-4 py-12 text-center text-sm text-zinc-500"
                    colSpan={4}
                  >
                    No roles found.
                  </TableCell>
                </TableRow>
              )}
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
              onClick={openAssignUsersDialog}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-zinc-100 transition hover:bg-white/5"
            >
              <UserPlus className="h-4 w-4 text-zinc-300" />
              <span>Assign Users</span>
            </button>
            <button
              type="button"
              onClick={openPermissionsDialog}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-zinc-100 transition hover:bg-white/5"
            >
              <Fingerprint className="h-4 w-4 text-zinc-300" />
              <span>Permission</span>
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-zinc-100 transition hover:bg-white/5"
              onClick={() => {
                if (openMenuId !== null) {
                  router.push(`/roles/${openMenuId}/edit`);
                }
                setOpenMenuId(null);
              }}
            >
              <Edit2 className="h-4 w-4 text-zinc-300" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-500 transition hover:bg-white/5"
            >
              <Trash className="h-4 w-4" />
              <span>Delete</span>
            </button>
          </div>
        ) : null}

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
                  className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-cyan-500"
                >
                  Create
                </button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={assignRoleOpen} onOpenChange={setAssignRoleOpen}>
          <DialogContent className="max-w-lg border-white/10 bg-[#111216] p-0">
            <div className="flex flex-col">
              <DialogHeader className="border-b border-white/10 px-6 py-5">
                <DialogTitle className="text-xl font-bold text-white">
                  Assign Role
                </DialogTitle>
                <DialogDescription>
                  Role Name:{" "}
                  <span className="font-medium text-zinc-200">
                    {activeRole?.name ?? "Selected Role"}
                  </span>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 px-6 py-5">
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Select Users
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setUserDropdownOpen((prev) => !prev)}
                      className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-zinc-100 transition hover:bg-white/10"
                    >
                      <span className="truncate">
                        {selectedUsers.length > 0
                          ? `${selectedUsers.length} user${
                              selectedUsers.length > 1 ? "s" : ""
                            } selected`
                          : "Select users"}
                      </span>
                      <ChevronDown className="h-4 w-4 text-zinc-400" />
                    </button>

                    {userDropdownOpen ? (
                      <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-10 rounded-2xl border border-white/10 bg-[#17191d] p-3 shadow-[0_18px_45px_-20px_rgba(0,0,0,0.9)]">
                        <input
                          type="text"
                          placeholder="Search users..."
                          className="mb-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                          value={assignUserSearch}
                          onChange={(e) => setAssignUserSearch(e.target.value)}
                        />

                        <button
                          type="button"
                          onClick={handleSelectAllUsers}
                          className="mb-2 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-zinc-100 transition hover:bg-white/5"
                        >
                          <span className="flex h-4 w-4 items-center justify-center rounded border border-white/20 bg-white/5">
                            {filteredAssignableUsers.length > 0 &&
                            filteredAssignableUsers.every((user) =>
                              selectedUsers.includes(user)
                            ) ? (
                              <Check className="h-3 w-3 text-cyan-400" />
                            ) : null}
                          </span>
                          <span>Select All</span>
                        </button>

                        <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
                          {filteredAssignableUsers.map((user) => (
                            <button
                              key={user}
                              type="button"
                              onClick={() => toggleUser(user)}
                              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-zinc-100 transition hover:bg-white/5"
                            >
                              <span className="flex h-4 w-4 items-center justify-center rounded border border-white/20 bg-white/5">
                                {selectedUsers.includes(user) ? (
                                  <Check className="h-3 w-3 text-cyan-400" />
                                ) : null}
                              </span>
                              <span>{user}</span>
                            </button>
                          ))}
                          {filteredAssignableUsers.length === 0 ? (
                            <p className="px-3 py-2 text-sm text-zinc-500">
                              No users found.
                            </p>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <DialogFooter className="justify-end gap-3 border-t border-white/10 px-6 py-5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setAssignRoleOpen(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-bold text-zinc-300 transition hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setAssignRoleOpen(false)}
                  className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-cyan-500"
                >
                  Assign Role
                </button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={assignPermissionsOpen}
          onOpenChange={setAssignPermissionsOpen}
        >
          <DialogContent className="max-w-4xl border-white/10 bg-[#111216] p-0">
            <div className="flex flex-col">
              <DialogHeader className="border-b border-white/10 px-6 py-5">
                <DialogTitle className="text-xl font-bold text-white">
                  Assign Permissions
                </DialogTitle>
                <DialogDescription>
                  Configure module permissions for{" "}
                  <span className="font-medium text-zinc-200">
                    {activeRole?.name ?? "Selected Role"}
                  </span>
                  .
                </DialogDescription>
              </DialogHeader>

              <div className="px-6 py-5">
                <div className="overflow-hidden rounded-2xl border border-white/10">
                  <Table className="min-w-full">
                    <TableHeader className="bg-white/5">
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px]">
                          Module
                        </TableHead>
                        <TableHead className="px-4 py-3 text-center text-zinc-100 font-bold uppercase tracking-widest text-[10px]">
                          Create
                        </TableHead>
                        <TableHead className="px-4 py-3 text-center text-zinc-100 font-bold uppercase tracking-widest text-[10px]">
                          Read
                        </TableHead>
                        <TableHead className="px-4 py-3 text-center text-zinc-100 font-bold uppercase tracking-widest text-[10px]">
                          Update
                        </TableHead>
                        <TableHead className="px-4 py-3 text-center text-zinc-100 font-bold uppercase tracking-widest text-[10px]">
                          Delete
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-white/5">
                      {permissionModules.map((moduleName) => (
                        <TableRow
                          key={moduleName}
                          className="border-white/5 hover:bg-white/[0.03]"
                        >
                          <TableCell className="px-4 py-4 text-sm font-medium text-zinc-200">
                            {moduleName}
                          </TableCell>
                          {(["create", "read", "update", "delete"] as const).map(
                            (permissionKey) => (
                              <TableCell
                                key={`${moduleName}-${permissionKey}`}
                                className="px-4 py-4 text-center"
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    permissionsState[moduleName][permissionKey]
                                  }
                                  onChange={(e) =>
                                    setPermissionsState((prev) => ({
                                      ...prev,
                                      [moduleName]: {
                                        ...prev[moduleName],
                                        [permissionKey]: e.target.checked,
                                      },
                                    }))
                                  }
                                  className="h-4 w-4 rounded border-white/20 bg-white/5 accent-cyan-500"
                                />
                              </TableCell>
                            )
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <DialogFooter className="justify-end gap-3 border-t border-white/10 px-6 py-5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setAssignPermissionsOpen(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-bold text-zinc-300 transition hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setAssignPermissionsOpen(false)}
                  className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-cyan-500"
                >
                  Save Changes
                </button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
