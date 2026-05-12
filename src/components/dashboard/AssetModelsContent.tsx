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
import { DataTableToolbar } from "@/components/admin/DataTableToolbar";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { ChevronDown, MoreHorizontal, Search, Package, Copy, Edit2, Trash, Check, Image as ImageIcon, Tag, Factory, Hash, TrendingDown, ClipboardList } from "lucide-react";

const accentClasses = [
  "from-amber-400 to-orange-500",
  "from-yellow-400 to-amber-500",
  "from-orange-400 to-red-500",
  "from-rose-400 to-pink-500",
];

export function AssetModelsContent() {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
  const [search, setSearch] = useState("");
  const [records, setRecords] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("name");
  const [order, setOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewType, setViewType] = useState<"list" | "grid">("list");

  const decoratedRecords = useMemo(() => {
    return records.map((record, index) => ({
      ...record,
      accent: accentClasses[index % accentClasses.length],
    }));
  }, [records]);

  const toggleAll = () => {
    if (selectedIds.size === records.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(records.map(r => r.id)));
    }
  };

  const toggleOne = (id: number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setDeleteLoading(true);
    try {
      // Mock delete logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRecords(prev => prev.filter(r => r.id !== itemToDelete.id));
      setItemToDelete(null);
    } catch (err) {
      setError("Failed to delete asset model.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const loadRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mock data for development
      const allRecords = [
        { 
          id: 1, 
          name: "MacBook Pro 14", 
          slug: "macbook-pro-14", 
          isActive: true, 
          createdAt: new Date().toISOString(),
          modelNo: "A2442",
          minQty: 5,
          assets: 120,
          assigned: 85,
          remaining: 35,
          percentRemaining: 29.1,
          archived: 2,
          category: "Laptops",
          eol: 36,
          fieldset: "Apple Fieldset",
          image: null
        },
        { 
          id: 2, 
          name: "Dell XPS 15", 
          slug: "dell-xps-15", 
          isActive: true, 
          createdAt: new Date().toISOString(),
          modelNo: "XPS15-9520",
          minQty: 10,
          assets: 85,
          assigned: 78,
          remaining: 7,
          percentRemaining: 8.2,
          archived: 5,
          category: "Laptops",
          eol: 48,
          fieldset: "Dell Fieldset",
          image: null
        },
        { 
          id: 3, 
          name: "iPhone 13 Pro", 
          slug: "iphone-13-pro", 
          isActive: true, 
          createdAt: new Date().toISOString(),
          modelNo: "A2638",
          minQty: 2,
          assets: 45,
          assigned: 42,
          remaining: 3,
          percentRemaining: 6.7,
          archived: 0,
          category: "Phones",
          eol: 24,
          fieldset: "Mobile Fieldset",
          image: null
        },
        { 
          id: 4, 
          name: "Logitech MX Master 3", 
          slug: "mx-master-3", 
          isActive: false, 
          createdAt: new Date().toISOString(),
          modelNo: "910-005620",
          minQty: 20,
          assets: 250,
          assigned: 210,
          remaining: 40,
          percentRemaining: 16.0,
          archived: 15,
          category: "Peripherals",
          eol: 60,
          fieldset: "Standard Fieldset",
          image: null
        },
        { 
          id: 5, 
          name: "Samsung Odyssey G7", 
          slug: "odyssey-g7", 
          isActive: true, 
          createdAt: new Date().toISOString(),
          modelNo: "LC32G75TQSNXZA",
          minQty: 4,
          assets: 15,
          assigned: 12,
          remaining: 3,
          percentRemaining: 20.0,
          archived: 1,
          category: "Monitors",
          eol: 72,
          fieldset: "Monitor Fieldset",
          image: null
        },
      ];
      
      let filtered = [...allRecords];
      if (search.trim()) {
        const s = search.toLowerCase();
        filtered = filtered.filter(r => r.name.toLowerCase().includes(s) || r.modelNo.toLowerCase().includes(s));
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
  }, [apiBase, page, limit, search, sort, order]);

  return (
    <main className="px-6 pb-6 pt-5">
      <div className="mx-auto w-full max-w-full flex flex-1 flex-col gap-6">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6e8a99]">Settings</p>
          <h2 className="text-3xl font-bold text-white">Asset Models</h2>
        </div>

        <DataTableToolbar 
          search={search}
          onSearchChange={setSearch}
          viewType={viewType}
          onViewToggle={setViewType}
          onCreateClick={() => router.push("/asset-models/create")}
          onRefreshClick={loadRecords}
          showAdvancedSearch={true}
        />

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#111216] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]">
          <Table className="min-w-[2200px]">
            <TableHeader className="bg-white/5 sticky top-0 z-10">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="w-[50px] px-4 py-3">
                  <div 
                    onClick={toggleAll}
                    className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded border transition-all ${selectedIds.size === records.length && records.length > 0 ? "border-cyan-500 bg-cyan-500" : "border-white/20 bg-white/5 hover:border-white/40"}`}
                  >
                    {selectedIds.size === records.length && records.length > 0 && <Check className="h-3 w-3 text-black font-bold" />}
                  </div>
                </TableHead>
                <TableHead className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Name</TableHead>
                <TableHead className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px] text-center">Image</TableHead>
                <TableHead className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Model No.</TableHead>
                <TableHead className="px-4 py-3 text-center text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Min Qty</TableHead>
                <TableHead className="px-4 py-3 text-center text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Assets</TableHead>
                <TableHead className="px-4 py-3 text-center text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Assigned</TableHead>
                <TableHead className="px-4 py-3 text-center text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Remaining</TableHead>
                <TableHead className="px-4 py-3 text-center text-zinc-100 font-bold uppercase tracking-widest text-[10px]">% Remaining</TableHead>
                <TableHead className="px-4 py-3 text-center text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Archived</TableHead>
                <TableHead className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Category</TableHead>
                <TableHead className="px-4 py-3 text-center text-zinc-100 font-bold uppercase tracking-widest text-[10px]">EOL Rate</TableHead>
                <TableHead className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Fieldset</TableHead>
                <TableHead className="w-[180px] px-4 py-3 text-right text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-white/5">
              {decoratedRecords.map((record) => (
                <TableRow 
                  key={record.id} 
                  className={`border-white/5 transition-colors hover:bg-white/[0.03] ${selectedIds.has(record.id) ? "bg-cyan-500/5" : ""}`}
                >
                  <TableCell className="px-4 py-4">
                    <div 
                      onClick={() => toggleOne(record.id)}
                      className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded border transition-all ${selectedIds.has(record.id) ? "border-cyan-500 bg-cyan-500" : "border-white/10 bg-white/5 hover:border-white/30"}`}
                    >
                      {selectedIds.has(record.id) && <Check className="h-3 w-3 text-black font-bold" />}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${record.accent} text-black shadow-lg`}>
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-100">{record.name}</p>
                        <p className="text-[10px] text-zinc-500 font-mono tracking-tight">{record.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center justify-center">
                      {record.image ? (
                        <img src={record.image} alt={record.name} className="h-10 w-10 rounded-xl object-cover ring-1 ring-white/10" />
                      ) : (
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10`}>
                          <ImageIcon className="h-5 w-5 text-zinc-600" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Hash className="h-3 w-3 text-zinc-600" />
                      <span className="text-xs font-mono text-zinc-400">{record.modelNo}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center">
                    <span className="inline-flex rounded-lg bg-white/5 px-2 py-1 text-xs font-bold text-zinc-400 border border-white/10">
                      {record.minQty}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center">
                    <span className="inline-flex rounded-lg bg-indigo-500/10 px-2.5 py-1 text-xs font-bold text-indigo-400 border border-indigo-500/20">
                      {record.assets}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center">
                    <span className="inline-flex rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                      {record.assigned}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center">
                    <span className="inline-flex rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-400 border border-amber-500/20">
                      {record.remaining}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center">
                    <div className="flex flex-col gap-1.5 items-center">
                      <span className={`text-[10px] font-bold ${record.percentRemaining < 10 ? "text-rose-400" : "text-zinc-400"}`}>
                        {record.percentRemaining}%
                      </span>
                      <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${record.percentRemaining < 10 ? "bg-rose-500" : "bg-emerald-500"}`} 
                          style={{ width: `${record.percentRemaining}%` }} 
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center">
                    <span className="inline-flex rounded-lg bg-zinc-500/10 px-2.5 py-1 text-xs font-bold text-zinc-500 border border-white/5">
                      {record.archived}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Tag className="h-3 w-3 text-indigo-500" />
                      <span className="text-xs font-medium text-zinc-300">{record.category}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400">
                      <TrendingDown className="h-3 w-3 text-rose-500" />
                      <span>{record.eol} mo</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-3 w-3 text-amber-500" />
                      <span className="text-xs text-zinc-400">{record.fieldset}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button className="px-2 py-1 text-[10px] font-bold text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all">New Asset</button>
                      <button className="p-2 rounded-xl text-zinc-500 hover:bg-white/10 hover:text-white transition-all active:scale-90" title="Clone Item">
                        <Copy className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => router.push(`/asset-models/edit/${record.id}`)}
                        className="p-2 rounded-xl text-zinc-500 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all active:scale-90" 
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => setItemToDelete(record)}
                        className="p-2 rounded-xl text-zinc-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all active:scale-90" 
                        title="Delete"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {decoratedRecords.length === 0 && (
                <TableRow className="border-white/10">
                  <TableCell className="px-4 py-12 text-center text-sm text-zinc-500" colSpan={14}>
                    {loading ? "Loading..." : "No asset models found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <DeleteConfirmDialog 
          open={!!itemToDelete}
          onClose={() => setItemToDelete(null)}
          onConfirm={handleDelete}
          title="Delete Asset Model"
          itemName={itemToDelete?.name}
          loading={deleteLoading}
        />

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
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600 text-white shadow-lg">
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
