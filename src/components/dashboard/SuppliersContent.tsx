"use client";

import type { ApiRecord } from "@/lib/types";
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
import { Truck, Edit2, Trash, Image as ImageIcon, Eye } from "lucide-react";

const accentClasses = [
  "from-blue-400 to-blue-500",
  "from-blue-400 to-blue-500",
  "from-blue-400 to-blue-600",
  "from-blue-400 to-blue-500",
];

const FILTER_FIELDS: FilterField[] = [];

export function SuppliersContent() {
  const router = useRouter();
  const { push } = useToast();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterValues>({});
  const [records, setRecords] = useState<ApiRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ApiRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewType, setViewType] = useState<"list" | "grid">("list");

  const decoratedRecords = useMemo(() => {
    return records.map((record, index): ApiRecord & { accent: string } => ({
      ...record,
      accent: accentClasses[index % accentClasses.length],
    }));
  }, [records]);

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`${apiBase}/suppliers/${itemToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete supplier");
      }
      setRecords(prev => prev.filter(r => r.id !== itemToDelete.id));
      setItemToDelete(null);
      push("Supplier deleted successfully!", "success");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete supplier.";
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


      const res = await fetch(`${apiBase}/suppliers?${params}`, { credentials: "include" });
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
          onCreateClick={() => router.push("/suppliers/create")}
          onRefreshClick={loadRecords}
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
              subtitle: display(record.url, ""),
              image: record.image,
              stats: [
                { label: "Assets", value: display(record.assets, "0") },
                { label: "City", value: display(record.city) },
                { label: "State", value: display(record.state) },
              ],
              onView: () => router.push(`/suppliers/${record.id}`),
              onEdit: () => router.push(`/suppliers/${record.id}/edit`),
              onDelete: () => setItemToDelete(record),
            }))}
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <Table className="min-w-[1800px]">
              <TableHeader className="bg-gray-50 sticky top-0 z-10">
                <TableRow className="border-gray-200 hover:bg-transparent">
                  <TableHead onClick={() => setSort("name")} className="px-4 py-3 text-gray-500 text-xs font-semibold cursor-pointer hover:text-blue-600">Name</TableHead>
                  <TableHead className="px-4 py-3 text-gray-500 text-xs font-semibold text-center">Image</TableHead>
                  <TableHead className="px-4 py-3 text-center text-gray-500 text-xs font-semibold">Assets</TableHead>
                  <TableHead className="px-4 py-3 text-center text-gray-500 text-xs font-semibold">Accessories</TableHead>
                  <TableHead className="px-4 py-3 text-center text-gray-500 text-xs font-semibold">Licenses</TableHead>
                  <TableHead className="px-4 py-3 text-center text-gray-500 text-xs font-semibold">Components</TableHead>
                  <TableHead className="px-4 py-3 text-center text-gray-500 text-xs font-semibold">Consumables</TableHead>
                  <TableHead onClick={() => setSort("url")} className="px-4 py-3 text-gray-500 text-xs font-semibold cursor-pointer hover:text-blue-600">URL</TableHead>
                  <TableHead className="px-4 py-3 text-gray-500 text-xs font-semibold">Address</TableHead>
                  <TableHead onClick={() => setSort("city")} className="px-4 py-3 text-center text-gray-500 text-xs font-semibold cursor-pointer hover:text-blue-600">City</TableHead>
                  <TableHead className="px-4 py-3 text-center text-gray-500 text-xs font-semibold">State</TableHead>
                  <TableHead className="w-[100px] px-4 py-3 text-right text-gray-500 text-xs font-semibold">Actions</TableHead>
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
                          <Truck className="h-5 w-5" />
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
                    <TableCell className="px-4 py-4 text-center">
                      <span className="inline-flex rounded-lg bg-blue-500/10 px-2.5 py-1 text-xs font-bold text-blue-600 border border-blue-500/20">
                        {record.assets}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-center">
                      <span className="inline-flex rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-600 border border-amber-500/20">
                        {record.accessories}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-center">
                      <span className="inline-flex rounded-lg bg-blue-500/10 px-2.5 py-1 text-xs font-bold text-blue-600 border border-blue-500/20">
                        {record.licenses}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-center">
                      <span className="inline-flex rounded-lg bg-blue-500/10 px-2.5 py-1 text-xs font-bold text-blue-600 border border-blue-500/20">
                        {record.components}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-center">
                      <span className="inline-flex rounded-lg bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-600 border border-rose-500/20">
                        {record.consumables}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-xs font-medium text-blue-600">
                      <a href={record.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{record.url}</a>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-xs text-gray-500 italic">{record.address}</TableCell>
                    <TableCell className="px-4 py-4 text-center text-xs text-gray-500">{record.city}</TableCell>
                    <TableCell className="px-4 py-4 text-center text-xs text-gray-500">{record.state}</TableCell>
                    <TableCell className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => router.push(`/suppliers/${record.id}`)}
                          className="p-2 rounded-xl text-gray-500 hover:bg-blue-500/10 hover:text-blue-600 transition-all active:scale-90" 
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => router.push(`/suppliers/${record.id}/edit`)}
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
                    <TableCell className="px-4 py-12 text-center text-sm text-gray-500" colSpan={12}>
                      {loading ? "Loading..." : "No suppliers found."}
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
          title="Delete Supplier"
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
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
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
