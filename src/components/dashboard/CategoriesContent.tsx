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
import { ChevronDown, MoreHorizontal, Search, Tag, Copy, Edit2, Trash, Check, Image as ImageIcon, Layers, Mail, ShieldAlert } from "lucide-react";

const accentClasses = [
  "from-indigo-400 to-violet-500",
  "from-purple-400 to-fuchsia-500",
  "from-blue-400 to-indigo-500",
  "from-cyan-400 to-blue-500",
];

export function CategoriesContent() {
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
      setError("Failed to delete category.");
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
          name: "Laptops", 
          slug: "laptops", 
          isActive: true, 
          createdAt: new Date().toISOString(),
          type: "Asset",
          qty: 450,
          sendEmail: true,
          acceptance: true,
          image: null
        },
        { 
          id: 2, 
          name: "Desktop PCs", 
          slug: "desktops", 
          isActive: true, 
          createdAt: new Date().toISOString(),
          type: "Asset",
          qty: 210,
          sendEmail: true,
          acceptance: false,
          image: null
        },
        { 
          id: 3, 
          name: "Monitors", 
          slug: "monitors", 
          isActive: true, 
          createdAt: new Date().toISOString(),
          type: "Asset",
          qty: 320,
          sendEmail: false,
          acceptance: false,
          image: null
        },
        { 
          id: 4, 
          name: "Tablets", 
          slug: "tablets", 
          isActive: false, 
          createdAt: new Date().toISOString(),
          type: "Asset",
          qty: 85,
          sendEmail: true,
          acceptance: true,
          image: null
        },
        { 
          id: 5, 
          name: "Printers", 
          slug: "printers", 
          isActive: true, 
          createdAt: new Date().toISOString(),
          type: "Asset",
          qty: 42,
          sendEmail: false,
          acceptance: false,
          image: null
        },
      ];
      
      let filtered = [...allRecords];
      if (search.trim()) {
        const s = search.toLowerCase();
        filtered = filtered.filter(r => r.name.toLowerCase().includes(s));
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
          <h2 className="text-3xl font-bold text-white">Categories</h2>
        </div>

        <DataTableToolbar 
          search={search}
          onSearchChange={setSearch}
          viewType={viewType}
          onViewToggle={setViewType}
          onCreateClick={() => router.push("/categories/create")}
          onRefreshClick={loadRecords}
        />

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#111216] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]">
          <Table className="min-w-[1000px]">
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
                <TableHead className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Type</TableHead>
                <TableHead className="px-4 py-3 text-center text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Qty</TableHead>
                <TableHead className="px-4 py-3 text-center text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Send Email</TableHead>
                <TableHead className="px-4 py-3 text-center text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Acceptance</TableHead>
                <TableHead className="w-[100px] px-4 py-3 text-right text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Actions</TableHead>
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
                        <Tag className="h-5 w-5" />
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
                      <Layers className="h-3.5 w-3.5 text-violet-500" />
                      <span className="text-xs font-medium text-zinc-300">{record.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center">
                    <span className="inline-flex rounded-lg bg-indigo-500/10 px-2.5 py-1 text-xs font-bold text-indigo-400 border border-indigo-500/20">
                      {record.qty}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center">
                    <div className="flex justify-center">
                      {record.sendEmail ? (
                        <div className="flex items-center gap-1 text-emerald-400">
                          <Check className="h-3.5 w-3.5" />
                          <Mail className="h-3.5 w-3.5" />
                        </div>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center">
                    <div className="flex justify-center">
                      {record.acceptance ? (
                        <div className="flex items-center gap-1 text-amber-400">
                          <ShieldAlert className="h-3.5 w-3.5" />
                          <span className="text-[10px] font-bold uppercase">Required</span>
                        </div>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => router.push(`/categories/edit/${record.id}`)}
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
                  <TableCell className="px-4 py-12 text-center text-sm text-zinc-500" colSpan={8}>
                    {loading ? "Loading..." : "No categories found."}
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
          title="Delete Category"
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
