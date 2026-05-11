"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ChevronDown, 
  MoreHorizontal, 
  Search, 
  Building2, 
  ArrowUpDown, 
  LayoutList, 
  Columns, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Printer, 
  Download, 
  Maximize,
  Mail,
  Edit2,
  Trash
} from "lucide-react";

const accentClasses = [
  "from-emerald-400 to-teal-500",
  "from-cyan-400 to-sky-500",
  "from-indigo-400 to-blue-500",
  "from-amber-400 to-orange-500",
];

const statusFilters = ["All status", "Active", "Inactive"];
const sortOptions = [
  { label: "Name", value: "name" },
  { label: "Code", value: "code" },
  { label: "Created", value: "createdAt" },
];

export function CompaniesContent() {
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
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock data for new columns since backend doesn't support them yet
  const decorateRecords = useCallback((rawRecords: any[]) => {
    return rawRecords.map((record, index) => ({
      ...record,
      email: `${record.slug}@example.com`,
      image: null,
      usersCount: Math.floor(Math.random() * 50),
      assetsCount: Math.floor(Math.random() * 200),
      licensesCount: Math.floor(Math.random() * 20),
      accessoriesCount: Math.floor(Math.random() * 100),
      consumablesCount: Math.floor(Math.random() * 500),
      componentsCount: Math.floor(Math.random() * 300),
      accent: accentClasses[index % accentClasses.length],
    }));
  }, []);

  const loadRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      /*
      const res = await fetch(`${apiBase}/companies`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load companies.");
      const data = await res.json();
      const allRecords = data.records || [];
      */

      // Mock data for development
      const allRecords = [
        { id: 1, name: "Tech Corp", slug: "tech-corp", code: "TC001", isActive: true, createdAt: new Date().toISOString() },
        { id: 2, name: "Global Solutions", slug: "global-solutions", code: "GS002", isActive: true, createdAt: new Date().toISOString() },
        { id: 3, name: "Future Systems", slug: "future-systems", code: "FS003", isActive: false, createdAt: new Date().toISOString() },
        { id: 4, name: "Nexus Industries", slug: "nexus-industries", code: "NI004", isActive: true, createdAt: new Date().toISOString() },
        { id: 5, name: "Innovate Ltd", slug: "innovate-ltd", code: "IL005", isActive: true, createdAt: new Date().toISOString() },
      ];
      
      let filtered = [...allRecords];
      if (search.trim()) {
        const s = search.toLowerCase();
        filtered = filtered.filter(r => 
          r.name.toLowerCase().includes(s) || 
          (r.code && r.code.toLowerCase().includes(s))
        );
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
      setRecords(decorateRecords(filtered.slice(start, start + limit)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading records.");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [apiBase, page, limit, search, statusFilter, sort, order, decorateRecords]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <main className={`px-6 pb-6 pt-5 ${isFullscreen ? 'p-0' : ''}`}>
      <div className={`mx-auto w-full max-w-[1380px] flex flex-col gap-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur ${isFullscreen ? 'fixed inset-0 z-[100] bg-[#0b0c10] max-w-none rounded-none overflow-y-auto' : ''}`}>
      {/* Enhanced Toolbar */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-zinc-400">Settings / Companies</p>
            <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Company Management</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => loadRecords()}
              className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-all shadow-lg"
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
            <button 
              className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-all shadow-lg"
              title="Print"
            >
              <Printer className="h-4 w-4" />
            </button>
            <button 
              className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-all shadow-lg"
              title="Export Data"
            >
              <Download className="h-4 w-4" />
            </button>
            <button 
              onClick={toggleFullscreen}
              className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-all shadow-lg"
              title="Fullscreen"
            >
              <Maximize className="h-4 w-4" />
            </button>
            <div className="h-8 w-px bg-white/10 mx-1" />
            <button 
              onClick={() => router.push("/companies/create")}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-[0_10px_30px_-15px_rgba(16,185,129,0.5)] hover:bg-emerald-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              <span>Create New</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between bg-white/[0.02] p-3 rounded-[28px] border border-white/5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:min-w-[300px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                placeholder="Search by company name, email or code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-zinc-300 hover:bg-white/10 transition-all">
              <ArrowUpDown className="h-4 w-4 text-zinc-500" />
              <span>Sort</span>
            </button>
            <button className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-zinc-300 hover:bg-white/10 transition-all">
              <LayoutList className="h-4 w-4 text-zinc-500" />
              <span>List View</span>
            </button>
            <button className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-zinc-300 hover:bg-white/10 transition-all">
              <Columns className="h-4 w-4 text-zinc-500" />
              <span>Columns</span>
            </button>
            <button className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-sm text-rose-400 hover:bg-rose-500/10 transition-all">
              <Trash2 className="h-4 w-4" />
              <span>Deleted</span>
            </button>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                {statusFilters.map(filter => (
                  <button
                    key={filter}
                    onClick={() => { setStatusFilter(filter); setPage(1); }}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      statusFilter === filter 
                        ? 'bg-emerald-600 text-white shadow-lg' 
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Enhanced Table */}
      <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#111216] shadow-2xl">
        <div className="overflow-x-auto">
          <Table className="min-w-[1200px]">
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="px-5 py-4 text-zinc-100 font-bold uppercase tracking-wider text-[11px]">Company Name</TableHead>
                <TableHead className="px-5 py-4 text-zinc-100 font-bold uppercase tracking-wider text-[11px]">Email</TableHead>
                <TableHead className="px-5 py-4 text-zinc-100 font-bold uppercase tracking-wider text-[11px] text-center">Image</TableHead>
                <TableHead className="px-5 py-4 text-zinc-100 font-bold uppercase tracking-wider text-[11px] text-center">Users</TableHead>
                <TableHead className="px-5 py-4 text-zinc-100 font-bold uppercase tracking-wider text-[11px] text-center">Assets</TableHead>
                <TableHead className="px-5 py-4 text-zinc-100 font-bold uppercase tracking-wider text-[11px] text-center">Licenses</TableHead>
                <TableHead className="px-5 py-4 text-zinc-100 font-bold uppercase tracking-wider text-[11px] text-center">Accessories</TableHead>
                <TableHead className="px-5 py-4 text-zinc-100 font-bold uppercase tracking-wider text-[11px] text-center">Consumables</TableHead>
                <TableHead className="px-5 py-4 text-zinc-100 font-bold uppercase tracking-wider text-[11px] text-center">Components</TableHead>
                <TableHead className="px-5 py-4 text-zinc-100 font-bold uppercase tracking-wider text-[11px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-white/5">
              {records.map((record) => (
                <TableRow key={record.id} className="border-white/5 transition-all hover:bg-white/[0.03] group">
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${record.accent} text-black shadow-lg shadow-black/40 transition-transform group-hover:scale-110`}>
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">{record.name}</p>
                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{record.code || record.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Mail className="h-3.5 w-3.5 text-zinc-600" />
                      <span>{record.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="h-10 w-10 rounded-full border-2 border-dashed border-white/10 bg-white/5 flex items-center justify-center">
                        <span className="text-[10px] text-zinc-600 font-bold">NO IMG</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center">
                    <span className="inline-flex items-center justify-center min-w-[32px] h-6 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
                      {record.usersCount}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center">
                    <span className="inline-flex items-center justify-center min-w-[32px] h-6 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                      {record.assetsCount}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center">
                    <span className="inline-flex items-center justify-center min-w-[32px] h-6 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                      {record.licensesCount}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center">
                    <span className="inline-flex items-center justify-center min-w-[32px] h-6 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
                      {record.accessoriesCount}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center">
                    <span className="inline-flex items-center justify-center min-w-[32px] h-6 rounded-lg bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20">
                      {record.consumablesCount}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center">
                    <span className="inline-flex items-center justify-center min-w-[32px] h-6 rounded-lg bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20">
                      {record.componentsCount}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 rounded-lg text-zinc-500 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all" title="Edit">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="p-2 rounded-lg text-zinc-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all" title="Delete">
                        <Trash className="h-4 w-4" />
                      </button>
                      <button className="p-2 rounded-lg text-zinc-500 hover:bg-white/10 hover:text-white transition-all">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {records.length === 0 && (
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableCell className="px-5 py-24 text-center" colSpan={10}>
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-zinc-700" />
                      </div>
                      <p className="text-zinc-500 text-sm font-medium">
                        {loading ? "Decrypting company data..." : "No companies found matching your filters."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Enhanced Pagination */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white/[0.02] border border-white/10 rounded-[28px] px-6 py-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">View</span>
            <select
              className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-bold text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
              value={limit}
              onChange={(e) => { setPage(1); setLimit(Number(e.target.value)); }}
            >
              {[5, 10, 20, 50, 100].map(v => <option key={v} value={v}>{v} / page</option>)}
            </select>
          </div>
          <p className="text-xs text-zinc-500">
            Showing <span className="text-zinc-200 font-bold">{(page - 1) * limit + 1}</span> to <span className="text-zinc-200 font-bold">{Math.min(page * limit, total)}</span> of <span className="text-zinc-200 font-bold">{total}</span> companies
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-500 transition-all hover:bg-white/10 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            &lt;
          </button>
          
          <div className="flex items-center gap-1.5 px-2">
            {[...Array(Math.ceil(total / limit))].map((_, i) => (
               <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`h-9 w-9 rounded-xl text-xs font-bold transition-all ${
                    page === i + 1 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30 scale-110' 
                      : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-200'
                  }`}
               >
                 {i + 1}
               </button>
            )).slice(Math.max(0, page - 3), page + 2)}
          </div>

          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-200 transition-all hover:bg-white/10 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed"
            disabled={page * limit >= total}
            onClick={() => setPage(p => p + 1)}
          >
            &gt;
          </button>
        </div>
      </div>
      
      {error && (
        <div className="flex items-center gap-3 rounded-xl bg-rose-500/10 p-4 border border-rose-500/20 text-rose-400">
          <Trash2 className="h-5 w-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
      </div>
    </main>
  );
}
