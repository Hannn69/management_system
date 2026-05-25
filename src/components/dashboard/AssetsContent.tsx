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
import { DataTableToolbar } from "@/components/admin/DataTableToolbar";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { 
  Package, 
  Copy, 
  Edit2, 
  Trash, 
  Eye,
  Image as ImageIcon, 
  Tag, 
  Barcode, 
  Cpu, 
  Box, 
  User, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  ArrowLeftRight, 
  ClipboardCheck,
} from "lucide-react";

const accentClasses = [
  "from-emerald-400 to-teal-500",
  "from-cyan-400 to-sky-500",
  "from-indigo-400 to-blue-500",
  "from-amber-400 to-orange-500",
];

interface AssetsContentProps {
  title?: string;
  subtitle?: string;
  categoryFilter?: "deployed" | "ready" | "pending" | "undeployable" | "byod" | "archive" | "requestable" | "audit" | "checkin" | "all";
}

interface AssetRecord {
  id: number;
  slug: string;
  assetTag: string;
  name: string;
  serial: string;
  model: string;
  category: string;
  status: string;
  checkedOutTo: string | null;
  location: string;
  purchaseCost: number;
  currentValue: number;
  image?: string;
  accent?: string;
}

export function AssetsContent({ 
  title = "Assets", 
  subtitle = "Inventory",
  categoryFilter = "all" 
}: AssetsContentProps) {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  const [search, setSearch] = useState("");
  const [records, setRecords] = useState<AssetRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<AssetRecord | null>(null);
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
      // Mock delete logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRecords(prev => prev.filter(r => r.id !== itemToDelete.id));
      setItemToDelete(null);
    } catch {
      setError("Failed to delete asset.");
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
      // Add categoryFilter if it exists in the component props
      if (categoryFilter && categoryFilter !== "all") {
        params.append("category", categoryFilter);
      }

      const res = await fetch(`${apiBase}/assets?${params}`, { credentials: "include" });
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
  }, [apiBase, page, limit, sort, order, search, categoryFilter]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  return (
    <main className="px-6 pb-6 pt-5">
      <div className="mx-auto w-full max-w-full flex flex-1 flex-col gap-6">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-[#6e8a99]">{subtitle}</p>
          <h2 className="text-3xl font-bold text-foreground">{title}</h2>
        </div>

        <DataTableToolbar 
          search={search}
          onSearchChange={setSearch}
          viewType={viewType}
          onViewToggle={setViewType}
          onCreateClick={() => router.push("/assets/create")}
          onRefreshClick={loadRecords}
          showAdvancedSearch={true}
          sortOrder={order as "asc" | "desc"}
          onSortOrderChange={(newOrder) => {
            setSort("createdAt");
            setOrder(newOrder);
          }}
        />

        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#111216] shadow-sm dark:shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]">
          <Table className="min-w-[1800px]">
            <TableHeader className="bg-slate-50 dark:bg-white/5 sticky top-0 z-10">
              <TableRow className="border-zinc-200 dark:border-white/10 hover:bg-transparent">
                <TableHead onClick={() => setSort("assetTag")} className="px-4 py-3 text-zinc-600 dark:text-zinc-100 font-bold uppercase tracking-widest text-[10px] cursor-pointer hover:text-cyan-500 transition-colors w-[150px]">Asset Tag</TableHead>
                <TableHead onClick={() => setSort("name")} className="px-4 py-3 text-zinc-600 dark:text-zinc-100 font-bold uppercase tracking-widest text-[10px] cursor-pointer hover:text-cyan-500 transition-colors min-w-[200px]">Asset Name</TableHead>
                <TableHead className="px-4 py-3 text-zinc-600 dark:text-zinc-100 font-bold uppercase tracking-widest text-[10px] text-center w-[80px]">Image</TableHead>
                <TableHead onClick={() => setSort("serial")} className="px-4 py-3 text-zinc-600 dark:text-zinc-100 font-bold uppercase tracking-widest text-[10px] cursor-pointer hover:text-cyan-500 transition-colors w-[150px]">Serial</TableHead>
                <TableHead className="px-4 py-3 text-zinc-600 dark:text-zinc-100 font-bold uppercase tracking-widest text-[10px] w-[150px]">Model</TableHead>
                <TableHead className="px-4 py-3 text-zinc-600 dark:text-zinc-100 font-bold uppercase tracking-widest text-[10px] w-[120px]">Category</TableHead>
                <TableHead className="px-4 py-3 text-zinc-600 dark:text-zinc-100 font-bold uppercase tracking-widest text-[10px] w-[130px]">Status</TableHead>
                <TableHead className="px-4 py-3 text-zinc-600 dark:text-zinc-100 font-bold uppercase tracking-widest text-[10px] w-[180px]">Checked Out To</TableHead>
                <TableHead className="px-4 py-3 text-zinc-600 dark:text-zinc-100 font-bold uppercase tracking-widest text-[10px] w-[150px]">Location</TableHead>
                <TableHead onClick={() => setSort("purchaseCost")} className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-100 font-bold uppercase tracking-widest text-[10px] cursor-pointer hover:text-cyan-500 transition-colors w-[130px]">Purchase Cost</TableHead>
                <TableHead className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-100 font-bold uppercase tracking-widest text-[10px] w-[130px]">Current Value</TableHead>
                <TableHead className="px-4 py-3 text-center text-zinc-600 dark:text-zinc-100 font-bold uppercase tracking-widest text-[10px] w-[150px]">Checkin/Checkout</TableHead>
                <TableHead className="w-[180px] px-4 py-3 text-right text-zinc-600 dark:text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-zinc-200 dark:divide-white/5">
              {decoratedRecords.map((record) => (
                <TableRow 
                  key={record.id} 
                  className="border-zinc-200 dark:border-white/5 transition-colors hover:bg-zinc-50 dark:hover:bg-white/[0.03]"
                >
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Barcode className="h-3.5 w-3.5 text-zinc-500" />
                      <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">{record.assetTag}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${record.accent} text-black shadow-lg`}>
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-700 dark:text-zinc-100">{record.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center justify-center">
                      {record.image ? (
                        <img src={record.image} alt={record.name} className="h-10 w-10 rounded-xl object-cover ring-1 ring-zinc-200 dark:ring-white/10" />
                      ) : (
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10`}>
                          <ImageIcon className="h-5 w-5 text-zinc-400 dark:text-zinc-600" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-600" />
                      <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">{record.serial}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Box className="h-3.5 w-3.5 text-indigo-500" />
                      <span className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">{record.model}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Tag className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">{record.category}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {record.checkedOutTo ? (
                        <span className="inline-flex rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 border border-blue-500/20">
                          Deployed
                        </span>
                      ) : (
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          record.status === "Ready to Deploy" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" :
                          record.status === "Broken - Not Fixable" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20" :
                          record.status === "Pending" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20" :
                          record.status === "Archive" ? "bg-zinc-500/30 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-white/5" :
                          record.status === "Lost/Stolen" ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20" :
                          record.status === "Out of Diagnostic" ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20" :
                          record.status === "Out for Repair" ? "bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20" :
                          "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-white/5"
                        }`}>
                          {record.status}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-xs text-zinc-600 dark:text-zinc-300">
                    <div className="flex items-center gap-2">
                      {record.checkedOutTo ? (
                        <>
                          <User className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                          <span>{record.checkedOutTo}</span>
                        </>
                      ) : (
                        <span className="text-zinc-400 dark:text-zinc-600">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                      <MapPin className="h-3.5 w-3.5 text-rose-500" />
                      <span>{record.location}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 text-sm font-bold text-zinc-700 dark:text-zinc-200 font-mono">
                      <DollarSign className="h-3 w-3 text-zinc-400 dark:text-zinc-500" />
                      {record.purchaseCost.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      <TrendingUp className="h-3 w-3 text-emerald-500/50" />
                      {record.currentValue.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center">
                    {record.checkedOutTo ? (
                      <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all active:scale-95 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/20">
                        <ArrowLeftRight className="h-3.5 w-3.5" />
                        Checkin
                      </button>
                    ) : record.status === "Ready to Deploy" ? (
                      <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all active:scale-95 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600/20 border border-emerald-500/20">
                        <ArrowLeftRight className="h-3.5 w-3.5" />
                        Checkout
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-tighter italic">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        onClick={() => router.push(`/assets/${record.slug}`)}
                        className="p-2 rounded-xl text-zinc-400 dark:text-zinc-500 hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all active:scale-90" 
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 rounded-xl text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/10 hover:text-foreground dark:hover:text-white transition-all active:scale-90" title="Clone Item">
                        <Copy className="h-4 w-4" />
                      </button>
                      <button className="p-2 rounded-xl text-zinc-400 dark:text-zinc-500 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-90" title="Audit">
                        <ClipboardCheck className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => router.push(`/assets/${record.slug}/edit`)}
                        className="p-2 rounded-xl text-zinc-400 dark:text-zinc-500 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all active:scale-90" 
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => setItemToDelete(record)}
                        className="p-2 rounded-xl text-zinc-400 dark:text-zinc-500 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-all active:scale-90" 
                        title="Delete"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {decoratedRecords.length === 0 && (
                <TableRow className="border-zinc-200 dark:border-white/10">
                  <TableCell className="px-4 py-12 text-center text-sm text-zinc-500" colSpan={13}>
                    {loading ? "Loading..." : "No assets found."}
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
          title="Delete Asset"
          itemName={itemToDelete?.name}
          loading={deleteLoading}
        />

        <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 px-4 py-3 text-xs text-zinc-600 dark:text-zinc-300 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 dark:text-zinc-400">Rows per page</span>
            <select
              className="rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 px-2 py-1 text-xs text-zinc-700 dark:text-zinc-200"
              value={limit}
              onChange={(e) => { setPage(1); setLimit(Number(e.target.value)); }}
            >
              {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-zinc-500 dark:text-zinc-400">
              {total === 0 ? "0-0" : `${(page - 1) * limit + 1}-${Math.min(page * limit, total)}`} of {total}
            </span>
            <div className="flex items-center gap-1">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 text-zinc-500 disabled:opacity-30"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                &lt;
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-600 text-white shadow-lg">
                {page}
              </button>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 text-zinc-700 dark:text-zinc-200 disabled:opacity-30"
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
