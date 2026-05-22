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
import { ChevronDown, MoreHorizontal, Search, MapPin, Copy, Edit2, Trash, Eye, Image as ImageIcon, Check } from "lucide-react";

const accentClasses = [
  "from-cyan-400 to-teal-500",
  "from-teal-400 to-emerald-500",
  "from-emerald-400 to-green-500",
  "from-sky-400 to-cyan-500",
];

export function LocationsContent() {
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

  const toggleAll = () => {
    // Logic removed as per request
  };

  const toggleOne = (id: number) => {
    // Logic removed as per request
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`${apiBase}/locations/${itemToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete location");
      setRecords(prev => prev.filter(r => r.id !== itemToDelete.id));
      setItemToDelete(null);
      push("Location deleted successfully!", "success");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete location.";
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

      const res = await fetch(`${apiBase}/locations?${params}`, { credentials: "include" });
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
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6e8a99]">Settings</p>
          <h2 className="text-3xl font-bold text-white">Locations</h2>
        </div>

        <DataTableToolbar 
          search={search}
          onSearchChange={setSearch}
          viewType={viewType}
          onViewToggle={setViewType}
          onCreateClick={() => router.push("/locations/create")}
          onRefreshClick={loadRecords}
          sortOrder={order as "asc" | "desc"}
          onSortOrderChange={(newOrder) => {
            setSort("createdAt");
            setOrder(newOrder);
          }}
        />

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#111216] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]">
          <Table className="min-w-[2000px]">
            <TableHeader className="bg-white/5 sticky top-0 z-10">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead onClick={() => setSort("name")} className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px] cursor-pointer hover:text-cyan-500">Name</TableHead>
                <TableHead className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Image</TableHead>
                <TableHead className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Parent</TableHead>
                <TableHead className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Currency</TableHead>
                <TableHead className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px]">People</TableHead>
                <TableHead className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Assets</TableHead>
                <TableHead className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Accessories</TableHead>
                <TableHead className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Components</TableHead>
                <TableHead className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Consumables</TableHead>
                <TableHead className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Address</TableHead>
                <TableHead onClick={() => setSort("city")} className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px] cursor-pointer hover:text-cyan-500">City</TableHead>
                <TableHead className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Province</TableHead>
                <TableHead className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Country</TableHead>
                <TableHead className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Zip</TableHead>
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
                        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${record.accent} text-black shadow-[0_10px_20px_-5px_rgba(0,0,0,0.5)]`}>
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-100">{record.name}</p>
                          <p className="text-[10px] text-zinc-500 font-mono tracking-tight">{record.slug}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      {record.image ? (
                        <img src={record.image} alt="" className="h-10 w-10 rounded-xl object-cover border border-white/10 shadow-lg" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-dashed border-white/10">
                          <ImageIcon className="h-4 w-4 text-zinc-600" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      {record.parent ? (
                        <span className="text-xs text-emerald-400 font-medium">{record.parent.name}</span>
                      ) : (
                        <span className="text-xs text-zinc-600">Root</span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-xs text-zinc-400 font-mono uppercase">{record.currency || "USD"}</TableCell>
                    <TableCell className="px-4 py-4 text-xs text-zinc-400">{record.people || 0}</TableCell>
                    <TableCell className="px-4 py-4 text-xs text-zinc-400">{record.assignAsset || 0}</TableCell>
                    <TableCell className="px-4 py-4 text-xs text-zinc-400">{record.accessories || 0}</TableCell>
                    <TableCell className="px-4 py-4 text-xs text-zinc-400">{record.components || 0}</TableCell>
                    <TableCell className="px-4 py-4 text-xs text-zinc-400">{record.consumables || 0}</TableCell>
                    <TableCell className="px-4 py-4 text-xs text-zinc-500 italic max-w-[200px] truncate">{record.address}</TableCell>
                    <TableCell className="px-4 py-4 text-xs text-zinc-400">{record.city}</TableCell>
                    <TableCell className="px-4 py-4 text-xs text-zinc-400">{record.state}</TableCell>
                    <TableCell className="px-4 py-4 text-xs text-zinc-400">{record.country}</TableCell>
                    <TableCell className="px-4 py-4 text-xs text-zinc-400">{record.zip}</TableCell>
                    <TableCell className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => router.push(`/locations/${record.id}/edit`)}
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
              {records.length === 0 && (
                <TableRow className="border-white/10">
                  <TableCell className="px-4 py-12 text-center text-sm text-zinc-500" colSpan={15}>
                    {loading ? "Loading..." : "No locations found."}
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
          title="Delete Location"
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
