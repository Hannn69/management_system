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
import { RecordGrid, display } from "@/components/admin/RecordGrid";
import { ListFilters, type FilterField, type FilterValues } from "@/components/admin/ListFilters";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { Package, Copy, Edit2, Trash, Image as ImageIcon, Tag, Hash, TrendingDown, ClipboardList, Eye } from "lucide-react";

import { AssetModelRecord } from "@/lib/types";

const accentClasses = [
  "from-amber-400 to-orange-500",
  "from-yellow-400 to-amber-500",
  "from-orange-400 to-red-500",
  "from-rose-400 to-pink-500",
];

const FILTER_FIELDS: FilterField[] = [
  { key: "categoryId", label: "Category", source: "categories" },
  { key: "manufacturerId", label: "Manufacturer", source: "manufacturers" },
];

export function AssetModelsContent() {
  const router = useRouter();
  const { push } = useToast();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterValues>({});
  const [records, setRecords] = useState<AssetModelRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<AssetModelRecord | null>(null);
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
      const res = await fetch(`${apiBase}/asset-models/${itemToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete asset model");
      }

      setRecords(prev => prev.filter(r => r.id !== itemToDelete.id));
      setItemToDelete(null);
      push("Asset Model deleted successfully!", "success");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete asset model.";
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

      Object.entries(filters).forEach(([key, value]) => value && params.set(key, value));


      const res = await fetch(`${apiBase}/asset-models?${params}`, { credentials: "include" });
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
  }, [apiBase, page, limit, sort, order, search, filters]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  return (
    <div className="space-y-6">
      <div className="mx-auto w-full max-w-full flex flex-1 flex-col gap-6">
        <DataTableToolbar 
          search={search}
          onSearchChange={setSearch}
          viewType={viewType}
          onViewToggle={setViewType}
          onCreateClick={() => router.push("/asset-models/create")}
          onRefreshClick={loadRecords}
          showAdvancedSearch={true}
          sortOrder={order as "asc" | "desc"}
          onSortOrderChange={(newOrder) => {
            setSort("createdAt");
            setOrder(newOrder);
          }}
        />
        <ListFilters
          fields={FILTER_FIELDS}
          values={filters}
          onChange={(next) => {
            setFilters(next);
            setPage(1);
          }}
        />

        {viewType === "grid" ? (
          <RecordGrid
            loading={loading}
            cards={decoratedRecords.map((record) => ({
              key: record.id,
              title: record.name,
              subtitle: display(record.modelNo, ""),
              image: record.image,
              badge: record.category ? { label: display(record.category) } : undefined,
              stats: [
                { label: "Assets", value: display(record.assets, "0") },
                { label: "Assigned", value: display(record.assigned, "0") },
                { label: "Remaining", value: display(record.remaining, "0") },
                { label: "Min qty", value: display(record.minQty) },
              ],
              onView: () => router.push(`/asset-models/${record.id}`),
              onEdit: () => router.push(`/asset-models/${record.id}/edit`),
              onDelete: () => setItemToDelete(record),
            }))}
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <Table className="min-w-[2200px]">
              <TableHeader className="bg-gray-50 sticky top-0 z-10">
                <TableRow className="border-gray-200 hover:bg-transparent">
                  <TableHead onClick={() => setSort("name")} className="px-4 py-3 text-gray-500 text-xs font-semibold cursor-pointer hover:text-amber-500">Name</TableHead>
                  <TableHead className="px-4 py-3 text-gray-500 text-xs font-semibold text-center">Image</TableHead>
                  <TableHead onClick={() => setSort("modelNumber")} className="px-4 py-3 text-gray-500 text-xs font-semibold cursor-pointer hover:text-amber-500">Model No.</TableHead>
                  <TableHead className="px-4 py-3 text-center text-gray-500 text-xs font-semibold">Min Qty</TableHead>
                  <TableHead className="px-4 py-3 text-center text-gray-500 text-xs font-semibold">Assets</TableHead>
                  <TableHead className="px-4 py-3 text-center text-gray-500 text-xs font-semibold">Assigned</TableHead>
                  <TableHead className="px-4 py-3 text-center text-gray-500 text-xs font-semibold">Remaining</TableHead>
                  <TableHead className="px-4 py-3 text-center text-gray-500 text-xs font-semibold">% Remaining</TableHead>
                  <TableHead className="px-4 py-3 text-center text-gray-500 text-xs font-semibold">Archived</TableHead>
                  <TableHead className="px-4 py-3 text-gray-500 text-xs font-semibold">Category</TableHead>
                  <TableHead className="px-4 py-3 text-center text-gray-500 text-xs font-semibold">EOL Rate</TableHead>
                  <TableHead className="px-4 py-3 text-gray-500 text-xs font-semibold">Fieldset</TableHead>
                  <TableHead className="w-[180px] px-4 py-3 text-right text-gray-500 text-xs font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100">
                {decoratedRecords.map((record) => (
                  <TableRow 
                    key={record.id} 
                    className="border-gray-100 transition-colors hover:bg-gray-50"
                  >
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${record.accent} text-black shadow-sm`}>
                          <Package className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{record.name}</p>
                          <p className="text-[10px] text-gray-500 font-mono tracking-tight">{record.slug}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center justify-center">
                        {record.image ? (
                          <img src={record.image} alt={record.name} className="h-10 w-10 rounded-xl object-cover ring-1 ring-white/10" />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 border border-gray-200">
                            <ImageIcon className="h-5 w-5 text-gray-600" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Hash className="h-3 w-3 text-gray-600" />
                        <span className="text-xs font-mono text-gray-500">{record.modelNo}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-center">
                      <span className="inline-flex rounded-lg bg-gray-100 px-2 py-1 text-xs font-bold text-gray-500 border border-gray-200">
                        {record.minQty}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-center">
                      <span className="inline-flex rounded-lg bg-blue-500/10 px-2.5 py-1 text-xs font-bold text-blue-600 border border-blue-500/20">
                        {record.assets}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-center">
                      <span className="inline-flex rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600 border border-emerald-500/20">
                        {record.assigned}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-center">
                      <span className="inline-flex rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-600 border border-amber-500/20">
                        {record.remaining}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-center">
                      <div className="flex flex-col gap-1.5 items-center">
                        <span className={`text-[10px] font-bold ${(record.percentRemaining ?? 100) < 10 ? "text-rose-400" : "text-gray-400"}`}>
                          {record.percentRemaining}%
                        </span>
                        <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${(record.percentRemaining ?? 100) < 10 ? "bg-rose-500" : "bg-emerald-500"}`} 
                            style={{ width: `${record.percentRemaining}%` }} 
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-center">
                      <span className="inline-flex rounded-lg bg-gray-500/10 px-2.5 py-1 text-xs font-bold text-gray-500 border border-gray-100">
                        {record.archived}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Tag className="h-3 w-3 text-blue-500" />
                        <span className="text-xs font-medium text-gray-600">{record.category}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
                        <TrendingDown className="h-3 w-3 text-rose-500" />
                        <span>{record.eol} mo</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="h-3 w-3 text-amber-500" />
                        <span className="text-xs text-gray-500">{record.fieldset}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => router.push(`/asset-models/${record.id}`)}
                          className="p-2 rounded-xl text-gray-500 hover:bg-blue-500/10 hover:text-blue-600 transition-all active:scale-90" 
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="px-2 py-1 text-[10px] font-bold text-blue-600 hover:bg-blue-500/10 rounded-lg transition-all">New Asset</button>
                        <button className="p-2 rounded-xl text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-all active:scale-90" title="Clone Item">
                          <Copy className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => router.push(`/asset-models/${record.id}/edit`)}
                          className="p-2 rounded-xl text-gray-500 hover:bg-emerald-500/10 hover:text-emerald-600 transition-all active:scale-90" 
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => setItemToDelete(record)}
                          className="p-2 rounded-xl text-gray-500 hover:bg-rose-500/10 hover:text-rose-600 transition-all active:scale-90" 
                          title="Delete"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {decoratedRecords.length === 0 && (
                  <TableRow className="border-gray-200">
                    <TableCell className="px-4 py-12 text-center text-sm text-gray-500" colSpan={13}>
                      {loading ? "Loading..." : "No asset models found."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
  
          <DeleteConfirmDialog 
            open={!!itemToDelete}
            onClose={() => setItemToDelete(null)}
            onConfirm={handleDelete}
            title="Delete Asset Model"
            itemName={itemToDelete?.name}
            loading={deleteLoading}
          />
  
          <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-xs text-gray-600 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Rows per page</span>
              <select
                className="rounded-full border border-gray-200 bg-gray-100 px-2 py-1 text-xs text-gray-800"
                value={limit}
                onChange={(e) => { setPage(1); setLimit(Number(e.target.value)); }}
              >
                {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-500">
                {total === 0 ? "0-0" : `${(page - 1) * limit + 1}-${Math.min(page * limit, total)}`} of {total}
              </span>
              <div className="flex items-center gap-1">
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-gray-500 disabled:opacity-30"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  &lt;
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600 text-white shadow-sm">
                  {page}
                </button>
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-gray-800 disabled:opacity-30"
                  disabled={page * limit >= total}
                  onClick={() => setPage(p => p + 1)}
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
          {error && <p className="rounded-lg bg-rose-500/10 p-3 text-center text-xs text-rose-700 border border-rose-500/20">{error}</p>}
        </div>
    </div>
  );
}
