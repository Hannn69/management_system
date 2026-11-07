"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { AssetCheckoutDialog } from "@/components/dashboard/AssetCheckoutDialog";
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
import { 
  Package, 
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
} from "lucide-react";

const accentClasses = [
  "from-emerald-400 to-blue-500",
  "from-blue-400 to-blue-500",
  "from-blue-400 to-blue-500",
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

const FILTER_FIELDS: FilterField[] = [
  { key: "statusId", label: "Status", source: "status-labels" },
  { key: "categoryId", label: "Category", source: "categories" },
  { key: "locationId", label: "Location", source: "locations" },
  { key: "companyId", label: "Company", source: "companies" },
  { key: "supplierId", label: "Supplier", source: "suppliers" },
];

export function AssetsContent({ 
  title = "Assets", 
  subtitle = "Inventory",
  categoryFilter = "all" 
}: AssetsContentProps) {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  const { push } = useToast();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterValues>({});
  const [records, setRecords] = useState<AssetRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<AssetRecord | null>(null);
  const [checkAction, setCheckAction] = useState<{ mode: "checkout" | "checkin"; record: AssetRecord } | null>(null);
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
      const res = await fetch(`${apiBase}/assets/${itemToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete asset");
      }

      setRecords(prev => prev.filter(r => r.id !== itemToDelete.id));
      setItemToDelete(null);
      push("Asset deleted successfully!", "success");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete asset.";
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
      // Add categoryFilter if it exists in the component props
      if (categoryFilter && categoryFilter !== "all") {
        params.append("category", categoryFilter);
      }

      Object.entries(filters).forEach(([key, value]) => value && params.set(key, value));


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
  }, [apiBase, page, limit, sort, order, search, categoryFilter, filters]);

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
          onCreateClick={() => router.push("/assets/create")}
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
              title: record.name || record.assetTag,
              subtitle: record.assetTag,
              image: record.image,
              badge: record.status ? { label: record.status } : undefined,
              stats: [
                { label: "Category", value: display(record.category) },
                { label: "Model", value: display(record.model) },
                { label: "Location", value: display(record.location) },
                { label: "Checked out to", value: display(record.checkedOutTo) },
              ],
              onView: () => router.push(`/assets/${record.slug}`),
              onEdit: () => router.push(`/assets/${record.slug}/edit`),
              onDelete: () => setItemToDelete(record),
            }))}
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <Table className="min-w-[1800px]">
              <TableHeader className="bg-gray-50 sticky top-0 z-10">
                <TableRow className="border-gray-200 hover:bg-transparent">
                  <TableHead onClick={() => setSort("assetTag")} className="px-4 py-3 text-gray-600 text-xs font-semibold cursor-pointer hover:text-blue-600 transition-colors w-[150px]">Asset Tag</TableHead>
                  <TableHead onClick={() => setSort("name")} className="px-4 py-3 text-gray-600 text-xs font-semibold cursor-pointer hover:text-blue-600 transition-colors min-w-[200px]">Asset Name</TableHead>
                  <TableHead className="px-4 py-3 text-gray-600 text-xs font-semibold text-center w-[80px]">Image</TableHead>
                  <TableHead onClick={() => setSort("serial")} className="px-4 py-3 text-gray-600 text-xs font-semibold cursor-pointer hover:text-blue-600 transition-colors w-[150px]">Serial</TableHead>
                  <TableHead className="px-4 py-3 text-gray-600 text-xs font-semibold w-[150px]">Model</TableHead>
                  <TableHead className="px-4 py-3 text-gray-600 text-xs font-semibold w-[120px]">Category</TableHead>
                  <TableHead className="px-4 py-3 text-gray-600 text-xs font-semibold w-[130px]">Status</TableHead>
                  <TableHead className="px-4 py-3 text-gray-600 text-xs font-semibold w-[180px]">Checked Out To</TableHead>
                  <TableHead className="px-4 py-3 text-gray-600 text-xs font-semibold w-[150px]">Location</TableHead>
                  <TableHead onClick={() => setSort("purchaseCost")} className="px-4 py-3 text-right text-gray-600 text-xs font-semibold cursor-pointer hover:text-blue-600 transition-colors w-[130px]">Purchase Cost</TableHead>
                  <TableHead className="px-4 py-3 text-right text-gray-600 text-xs font-semibold w-[130px]">Current Value</TableHead>
                  <TableHead className="px-4 py-3 text-center text-gray-600 text-xs font-semibold w-[150px]">Checkin/Checkout</TableHead>
                  <TableHead className="w-[180px] px-4 py-3 text-right text-gray-600 text-xs font-semibold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-200">
                {decoratedRecords.map((record) => (
                  <TableRow 
                    key={record.id} 
                    className="border-gray-200 transition-colors hover:bg-gray-50"
                  >
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Barcode className="h-3.5 w-3.5 text-gray-500" />
                        <span className="text-xs font-mono font-bold text-blue-600">{record.assetTag}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${record.accent} text-black shadow-sm`}>
                          <Package className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-700">{record.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center justify-center">
                        {record.image ? (
                          <img src={record.image} alt={record.name} className="h-10 w-10 rounded-xl object-cover ring-1 ring-gray-200" />
                        ) : (
                          <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 border border-gray-200`}>
                            <ImageIcon className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-xs font-mono text-gray-500">{record.serial}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Box className="h-3.5 w-3.5 text-blue-500" />
                        <span className="text-xs text-gray-600 font-medium">{record.model}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Tag className="h-3.5 w-3.5 text-amber-500" />
                        <span className="text-xs text-gray-500">{record.category}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {record.checkedOutTo ? (
                          <span className="inline-flex rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600 border border-blue-500/20">
                            Deployed
                          </span>
                        ) : (
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            record.status === "Ready to Deploy" ? "bg-emerald-500/10 text-emerald-600  border border-emerald-500/20" :
                            record.status === "Broken - Not Fixable" ? "bg-rose-500/10 text-rose-600  border border-rose-500/20" :
                            record.status === "Pending" ? "bg-amber-500/10 text-amber-600  border border-amber-500/20" :
                            record.status === "Archive" ? "bg-gray-500/30 text-gray-600  border border-gray-200 " :
                            record.status === "Lost/Stolen" ? "bg-orange-500/10 text-orange-600  border border-orange-500/20" :
                            record.status === "Out of Diagnostic" ? "bg-blue-500/10 text-blue-600  border border-blue-500/20" :
                            record.status === "Out for Repair" ? "bg-blue-500/10 text-blue-600  border border-blue-500/20" :
                            "bg-gray-500/10 text-gray-600  border border-gray-200 "
                          }`}>
                            {record.status}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        {record.checkedOutTo ? (
                          <>
                            <User className="h-3.5 w-3.5 text-blue-600" />
                            <span>{record.checkedOutTo}</span>
                          </>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <MapPin className="h-3.5 w-3.5 text-rose-500" />
                        <span>{record.location}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 text-sm font-bold text-gray-700 font-mono">
                        <DollarSign className="h-3 w-3 text-gray-400" />
                        {record.purchaseCost.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 text-sm font-bold text-emerald-600 font-mono">
                        <TrendingUp className="h-3 w-3 text-emerald-500/50" />
                        {record.currentValue.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-center">
                      {record.checkedOutTo ? (
                        <button onClick={() => setCheckAction({ mode: "checkin", record })} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all active:scale-95 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border border-amber-500/20">
                          <ArrowLeftRight className="h-3.5 w-3.5" />
                          Checkin
                        </button>
                      ) : record.status === "Ready to Deploy" ? (
                        <button onClick={() => setCheckAction({ mode: "checkout", record })} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all active:scale-95 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-600/20 border border-emerald-500/20">
                          <ArrowLeftRight className="h-3.5 w-3.5" />
                          Checkout
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter italic">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => router.push(`/assets/${record.slug}`)}
                          className="p-2 rounded-xl text-gray-400 hover:bg-blue-500/10 hover:text-blue-600 transition-all active:scale-90" 
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => router.push(`/assets/${record.slug}/edit`)}
                          className="p-2 rounded-xl text-gray-400 hover:bg-emerald-500/10 hover:text-emerald-600 transition-all active:scale-90" 
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => setItemToDelete(record)}
                          className="p-2 rounded-xl text-gray-400 hover:bg-rose-500/10 hover:text-rose-600 transition-all active:scale-90" 
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
                      {loading ? "Loading..." : "No assets found."}
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
          title="Delete Asset"
          itemName={itemToDelete?.name}
          loading={deleteLoading}
        />

        <AssetCheckoutDialog
          open={!!checkAction}
          mode={checkAction?.mode ?? "checkout"}
          asset={checkAction?.record ?? null}
          apiBase={apiBase}
          onClose={() => setCheckAction(null)}
          onDone={(message) => {
            push(message, "success");
            loadRecords();
          }}
        />

        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-600 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Rows per page</span>
            <select
              className="rounded-full border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700"
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
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 disabled:opacity-30"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                &lt;
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
                {page}
              </button>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 disabled:opacity-30"
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
