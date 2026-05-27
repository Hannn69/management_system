"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
  Eye,
  Mail,
  ShieldCheck,
  Trash,
  User,
} from "lucide-react";

const seedUsers = [
  {
    id: 1,
    firstName: "Sonvirak",
    lastName: "Kim",
    email: "sonvirak@management.local",
    loginEnabled: true,
  },
  {
    id: 2,
    firstName: "Dara",
    lastName: "Sok",
    email: "dara.sok@management.local",
    loginEnabled: true,
  },
  {
    id: 3,
    firstName: "Malis",
    lastName: "Chan",
    email: "malis.chan@management.local",
    loginEnabled: false,
  },
  {
    id: 4,
    firstName: "Sophy",
    lastName: "Lim",
    email: "sophy.lim@management.local",
    loginEnabled: true,
  },
  {
    id: 5,
    firstName: "Narin",
    lastName: "Chea",
    email: "narin.chea@management.local",
    loginEnabled: true,
  },
  {
    id: 6,
    firstName: "Kanha",
    lastName: "Phan",
    email: "kanha.phan@management.local",
    loginEnabled: false,
  },
];

const accentClasses = [
  "from-cyan-400 to-sky-500",
  "from-emerald-400 to-teal-500",
  "from-indigo-400 to-blue-500",
  "from-amber-400 to-orange-500",
];

type SortKey = "firstName" | "email";

export function UsersContent() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState<SortKey>("firstName");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [viewType, setViewType] = useState<"list" | "grid">("list");

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = seedUsers.filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return (
        fullName.includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      const aValue =
        sort === "firstName"
          ? `${a.firstName} ${a.lastName}`
          : a[sort];
      const bValue =
        sort === "firstName"
          ? `${b.firstName} ${b.lastName}`
          : b[sort];

      return order === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

    return sorted.map((user, index) => ({
      ...user,
      accent: accentClasses[index % accentClasses.length],
    }));
  }, [order, search, sort]);

  const total = filteredUsers.length;
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredUsers.slice(start, start + limit);
  }, [filteredUsers, limit, page]);

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
          onCreateClick={() => router.push("/users/create")}
          sortOrder={order}
          onSortOrderChange={setOrder}
        />

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#111216] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]">
          <Table className="min-w-[1200px]">
            <TableHeader className="bg-white/5 sticky top-0 z-10">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead
                  onClick={() => setSort("firstName")}
                  className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px] cursor-pointer hover:text-cyan-400"
                >
                  Name
                </TableHead>
                <TableHead
                  onClick={() => setSort("email")}
                  className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px] cursor-pointer hover:text-cyan-400"
                >
                  Email
                </TableHead>
                <TableHead className="px-4 py-3 text-center text-zinc-100 font-bold uppercase tracking-widest text-[10px]">
                  Is Active
                </TableHead>
                <TableHead className="w-[150px] px-4 py-3 text-right text-zinc-100 font-bold uppercase tracking-widest text-[10px]">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-white/5">
              {paginatedUsers.map((user) => (
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
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-mono tracking-tight">
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
                  <TableCell className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-bold border ${
                        user.loginEnabled
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
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
                        className="p-2 rounded-xl text-zinc-500 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all active:scale-90"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push(`/users/${user.id}/edit`)}
                        className="p-2 rounded-xl text-zinc-500 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all active:scale-90"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="p-2 rounded-xl text-zinc-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all active:scale-90"
                        title="Delete"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedUsers.length === 0 && (
                <TableRow className="border-white/10">
                  <TableCell
                    className="px-4 py-12 text-center text-sm text-zinc-500"
                    colSpan={4}
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

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
      </div>
    </main>
  );
}
