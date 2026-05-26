"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
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
import { ChevronDown, MoreHorizontal, Search, Tag, Copy, Edit2, Trash, Check, Activity, Eye } from "lucide-react";

const accentClasses = [
  "from-rose-400 to-red-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-blue-400 to-indigo-500",
  "from-violet-400 to-purple-500",
];

export function StatusLabelsContent() {
  const router = useRouter();
  const { push } = useToast();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  const [search, setSearch] = useState("");
  const [records, setRecords] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
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

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`${apiBase}/status-labels/${itemToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete status label");
      setRecords(prev => prev.filter(r => r.id !== itemToDelete.id));
      setItemToDelete(null);
      push("Status label deleted successfully!", "success");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete status label.";
      setError(errorMsg);
      push(errorMsg, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const loadRecords = useCallback(async () => {
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
      
      const res = await fetch(`${apiBase}/status-labels?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      
      setRecords(data.records || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading records.");
      setRecords([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [apiBase, page, limit, sort, order, search]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  return (
    <main className="px-6 pb-6 pt-5">
      <div className="mx-auto w-full max-w-full flex flex-1 flex-col gap-6">
        <DataTableToolbar 
          search={search}
          onSearchChange={setSearch}
          viewType={viewType}
          onViewToggle={setViewType}
          onCreateClick={() => router.push("/status-labels/create")}
          onRefreshClick={loadRecords}
          sortOrder={order as "asc" | "desc"}
          onSortOrderChange={(newOrder) => {
            setSort("createdAt");
            setOrder(newOrder);
          }}
        />

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#111216] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]">
          <Table className="min-w-[800px]">
            <TableHeader className="bg-white/5 sticky top-0 z-10">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead onClick={() => setSort("name")} className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px] cursor-pointer hover:text-rose-400">Status Name</TableHead>
                <TableHead onClick={() => setSort("type")} className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px] cursor-pointer hover:text-rose-400">Type</TableHead>
                <TableHead className="px-4 py-3 text-center text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Assets</TableHead>
                <TableHead className="w-[100px] px-4 py-3 text-right text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-white/5">
              {decoratedRecords.map((record) => (
                <TableRow 
                  key={record.id} 
                  className="border-white/5 transition-colors hover:bg-white/[0.03]"
                >
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${record.accent} text-black shadow-lg`}>
                        <Activity className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-bold text-zinc-100">{record.name}</p>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      record.type === "Deployable" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      record.type === "Undeployable" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                      record.type === "Archived" ? "bg-zinc-500/30 text-zinc-400 border border-white/5" :
                      "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {record.type}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center">
                    <span className="text-xs font-bold text-zinc-300">{record.assets}</span>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => router.push(`/status-labels/${record.id}`)}
                        className="p-2 rounded-xl text-zinc-500 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all active:scale-90" 
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => router.push(`/status-labels/${record.id}/edit`)}
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
                  <TableCell className="px-4 py-12 text-center text-sm text-zinc-500" colSpan={4}>
                    {loading ? "Loading..." : "No status labels found."}
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
          title="Delete Status Label"
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
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-600 text-white shadow-lg">
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
