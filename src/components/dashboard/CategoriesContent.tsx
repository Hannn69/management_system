"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, MoreHorizontal, Search, Tag } from "lucide-react";

const accentClasses = [
  "from-indigo-400 to-violet-500",
  "from-purple-400 to-fuchsia-500",
  "from-blue-400 to-indigo-500",
  "from-cyan-400 to-blue-500",
];

const statusFilters = ["All status", "Active", "Inactive"];
const sortOptions = [
  { label: "Name", value: "name" },
  { label: "Created", value: "createdAt" },
];

export function CategoriesContent() {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(statusFilters[0]);
  const [records, setRecords] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("name");
  const [order, setOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const decoratedRecords = useMemo(() => {
    return records.map((record, index) => ({
      ...record,
      accent: accentClasses[index % accentClasses.length],
    }));
  }, [records]);

  const loadRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      /*
      const res = await fetch(`${apiBase}/categories`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load categories.");
      const data = await res.json();
      const allRecords = data.records || [];
      */

      // Mock data for development
      const allRecords = [
        { id: 1, name: "Laptops", slug: "laptops", isActive: true, createdAt: new Date().toISOString() },
        { id: 2, name: "Desktop PCs", slug: "desktops", isActive: true, createdAt: new Date().toISOString() },
        { id: 3, name: "Monitors", slug: "monitors", isActive: true, createdAt: new Date().toISOString() },
        { id: 4, name: "Tablets", slug: "tablets", isActive: false, createdAt: new Date().toISOString() },
        { id: 5, name: "Printers", slug: "printers", isActive: true, createdAt: new Date().toISOString() },
      ];
      
      let filtered = [...allRecords];
      if (search.trim()) {
        const s = search.toLowerCase();
        filtered = filtered.filter(r => r.name.toLowerCase().includes(s));
      }
      if (statusFilter !== "All status") {
        const active = statusFilter === "Active";
        filtered = filtered.filter(r => r.isActive === active);
      }

      filtered.sort((a, b) => {
        const valA = a[sort] || "";
        const valB = b[sort] || "";
        if (order === "asc") return valA > valB ? 1 : -1;
        return valA < valB ? 1 : -1;
      });

      setTotal(filtered.length);
      const start = (page - 1) * limit;
      setRecords(filtered.slice(start, start + limit));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading records.");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [apiBase, page, limit, search, statusFilter, sort, order]);

  return (
    <main className="px-6 pb-6 pt-5">
      <div className="mx-auto w-full max-w-[1380px] flex flex-1 flex-col gap-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-zinc-400">Settings / Categories</p>
            <h2 className="text-lg font-semibold text-zinc-100">Categories</h2>
          </div>
          <button 
            onClick={() => router.push("/categories/create")}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-900/20"
          >
            Add Category
          </button>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((item) => (
              <button
                key={item}
                className={`rounded-full border border-white/10 px-4 py-1.5 text-xs font-medium transition ${
                  statusFilter === item ? "bg-white/10 text-white" : "text-zinc-300 hover:bg-white/5"
                }`}
                onClick={() => { setStatusFilter(item); setPage(1); }}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="flex flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 sm:max-w-[320px]">
            <Search className="h-4 w-4 text-zinc-500" />
            <input
              className="w-full bg-transparent text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none"
              placeholder="Search categories"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111216]">
          <Table className="min-w-[700px]">
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/10">
                <TableHead className="px-4 py-3 text-zinc-100">Category Name</TableHead>
                <TableHead className="px-4 py-3 text-center text-zinc-100">Status</TableHead>
                <TableHead className="px-4 py-3 text-zinc-100">Created At</TableHead>
                <TableHead className="w-[80px] px-4 py-3 text-right text-zinc-100">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-white/10">
              {decoratedRecords.map((record) => (
                <TableRow key={record.id} className="border-white/10 transition-colors hover:bg-white/5">
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${record.accent} text-black shadow-lg`}>
                        <Tag className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-100">{record.name}</p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{record.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${
                      record.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-500/10 text-zinc-400"
                    }`}>
                      {record.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs text-zinc-500">
                    {new Date(record.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <button className="rounded-lg p-2 text-zinc-500 hover:bg-white/5 hover:text-zinc-200">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {decoratedRecords.length === 0 && (
                <TableRow className="border-white/10">
                  <TableCell className="px-4 py-12 text-center text-sm text-zinc-500" colSpan={4}>
                    {loading ? "Loading..." : "No categories found."}
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
              onChange={(e) => { setPage(1); setLimit(Number(e.target.value)); }}
            >
              {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-zinc-400">
              {total === 0 ? "0-0" : `${(page - 1) * limit + 1}-${Math.min(page * limit, total)}`} of {total}
            </span>
            <div className="flex items-center gap-1">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-500 disabled:opacity-30"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                &lt;
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg">
                {page}
              </button>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-200 disabled:opacity-30"
                disabled={page * limit >= total}
                onClick={() => setPage(p => p + 1)}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
        {error && <p className="rounded-lg bg-rose-500/10 p-3 text-center text-xs text-rose-300 border border-rose-500/20">{error}</p>}
      </div>
    </main>
  );
}
