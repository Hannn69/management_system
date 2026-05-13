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
  ChevronDown, 
  MoreHorizontal, 
  Search, 
  Package, 
  Copy, 
  Edit2, 
  Trash, 
  Image as ImageIcon, 
  Tag, 
  Hash, 
  Barcode, 
  Cpu, 
  Box, 
  Info, 
  User, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  ArrowLeftRight, 
  ClipboardCheck,
  History,
  Check
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

export function AssetsContent({ 
  title = "Assets", 
  subtitle = "Inventory",
  categoryFilter = "all" 
}: AssetsContentProps) {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
  const [search, setSearch] = useState("");
  const [records, setRecords] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("assetTag");
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

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setDeleteLoading(true);
    try {
      // Mock delete logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRecords(prev => prev.filter(r => r.id !== itemToDelete.id));
      setItemToDelete(null);
    } catch (err) {
      setError("Failed to delete asset.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const loadRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Mock data for development with various statuses
      const allRecords = [
        { id: 1, assetTag: "AST-00124", name: "MacBook Pro 14", image: null, serial: "C02G1234Q05F", model: "MacBook Pro 14", category: "Laptops", status: "Deployed", checkedOutTo: "John Doe", location: "New York Office", purchaseCost: 2499.00, currentValue: 2100.00, requestable: true, byod: false, nextAudit: "2026-05-01", expectedCheckin: "2026-05-10" },
        { id: 2, assetTag: "AST-00125", name: "Dell XPS 15", image: null, serial: "5X7Y2Z1", model: "Dell XPS 15", category: "Laptops", status: "Ready to Deploy", checkedOutTo: null, location: "London Studio", purchaseCost: 1899.00, currentValue: 1650.00, requestable: true, byod: false, nextAudit: "2026-08-15", expectedCheckin: null },
        { id: 3, assetTag: "AST-00126", name: "iPhone 13 Pro", image: null, serial: "F8Y6H5J4K3L2", model: "iPhone 13 Pro", category: "Phones", status: "Deployed", checkedOutTo: "Sarah Chen", location: "Tokyo Branch", purchaseCost: 1099.00, currentValue: 850.00, requestable: false, byod: true, nextAudit: "2026-04-20", expectedCheckin: "2026-05-05" },
        { id: 4, assetTag: "AST-00127", name: "Samsung Odyssey G7", image: null, serial: "SAM-G7-123456", model: "Odyssey G7", category: "Monitors", status: "Broken - Not Fixable", checkedOutTo: null, location: "Berlin Hub", purchaseCost: 799.00, currentValue: 150.00, requestable: false, byod: false, nextAudit: "2026-01-01", expectedCheckin: null },
        { id: 5, assetTag: "AST-00128", name: "Logitech MX Master 3", image: null, serial: "LOGI-MX3-987", model: "MX Master 3", category: "Peripherals", status: "Pending", checkedOutTo: null, location: "Remote", purchaseCost: 99.00, currentValue: 75.00, requestable: true, byod: false, nextAudit: "2026-10-10", expectedCheckin: null },
        { id: 6, assetTag: "AST-00129", name: "iPad Air", image: null, serial: "DLXG123456", model: "iPad Air 5", category: "Tablets", status: "Archive", checkedOutTo: null, location: "Warehouse", purchaseCost: 599.00, currentValue: 100.00, requestable: false, byod: false, nextAudit: "2025-12-12", expectedCheckin: null },
        { id: 7, assetTag: "AST-00130", name: "User Phone", image: null, serial: "USER-998877", model: "Pixel 6", category: "Phones", status: "Lost/Stolen", checkedOutTo: "Mike Ross", location: "Remote", purchaseCost: 0.00, currentValue: 0.00, requestable: false, byod: true, nextAudit: "2026-06-01", expectedCheckin: null },
        { id: 8, assetTag: "AST-00131", name: "Network Switch", image: null, serial: "CISCO-123", model: "Cisco Catalyst", category: "Network", status: "Out of Diagnostic", checkedOutTo: null, location: "Data Center", purchaseCost: 4500.00, currentValue: 4200.00, requestable: false, byod: false, nextAudit: "2026-07-01", expectedCheckin: null },
        { id: 9, assetTag: "AST-00132", name: "Laser Printer", image: null, serial: "HP-LJ-445", model: "HP LaserJet", category: "Printers", status: "Out for Repair", checkedOutTo: null, location: "Office A", purchaseCost: 450.00, currentValue: 300.00, requestable: true, byod: false, nextAudit: "2026-09-01", expectedCheckin: null },
      ];
      
      let filtered = [...allRecords];

      // Apply category filtering
      if (categoryFilter === "deployed") {
        filtered = filtered.filter(r => r.status === "Deployed");
      } else if (categoryFilter === "ready") {
        filtered = filtered.filter(r => r.status === "Ready to Deploy");
      } else if (categoryFilter === "pending") {
        filtered = filtered.filter(r => r.status === "Pending");
      } else if (categoryFilter === "undeployable") {
        filtered = filtered.filter(r => r.status === "Broken - Not Fixable" || r.status === "Lost/Stolen");
      } else if (categoryFilter === "byod") {
        filtered = filtered.filter(r => r.byod === true);
      } else if (categoryFilter === "archive") {
        filtered = filtered.filter(r => r.status === "Archive");
      } else if (categoryFilter === "requestable") {
        filtered = filtered.filter(r => r.requestable === true);
      } else if (categoryFilter === "audit") {
        filtered = filtered.filter(r => new Date(r.nextAudit) < new Date("2026-05-13"));
      } else if (categoryFilter === "checkin") {
        filtered = filtered.filter(r => r.expectedCheckin && new Date(r.expectedCheckin) < new Date("2026-05-13"));
      }

      if (search.trim()) {
        const s = search.toLowerCase();
        filtered = filtered.filter(r => 
          r.name.toLowerCase().includes(s) || 
          r.assetTag.toLowerCase().includes(s) || 
          r.serial.toLowerCase().includes(s)
        );
      }

      filtered.sort((a, b) => {
        const valA = (a as any)[sort] || "";
        const valB = (b as any)[sort] || "";
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
  }, [search, page, limit, sort, order, categoryFilter]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  return (
    <main className="px-6 pb-6 pt-5">
      <div className="mx-auto w-full max-w-full flex flex-1 flex-col gap-6">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6e8a99]">{subtitle}</p>
          <h2 className="text-3xl font-bold text-white">{title}</h2>
        </div>

        <DataTableToolbar 
          search={search}
          onSearchChange={setSearch}
          viewType={viewType}
          onViewToggle={setViewType}
          onCreateClick={() => router.push("/assets/create")}
          onRefreshClick={loadRecords}
          showAdvancedSearch={true}
        />

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#111216] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]">
          <Table className="min-w-[2400px]">
            <TableHeader className="bg-white/5 sticky top-0 z-10">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Asset Tag</TableHead>
                <TableHead className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Asset Name</TableHead>
                <TableHead className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px] text-center">Image</TableHead>
                <TableHead className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Serial</TableHead>
                <TableHead className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Model</TableHead>
                <TableHead className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Category</TableHead>
                <TableHead className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Status</TableHead>
                <TableHead className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Checked Out To</TableHead>
                <TableHead className="px-4 py-3 text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Location</TableHead>
                <TableHead className="px-4 py-3 text-right text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Purchase Cost</TableHead>
                <TableHead className="px-4 py-3 text-right text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Current Value</TableHead>
                <TableHead className="px-4 py-3 text-center text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Checkin/Checkout</TableHead>
                <TableHead className="w-[180px] px-4 py-3 text-right text-zinc-100 font-bold uppercase tracking-widest text-[10px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-white/5">
              {decoratedRecords.map((record) => (
                <TableRow 
                  key={record.id} 
                  className="border-white/5 transition-colors hover:bg-white/[0.03]"
                >
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Barcode className="h-3.5 w-3.5 text-zinc-500" />
                      <span className="text-xs font-mono font-bold text-cyan-400">{record.assetTag}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${record.accent} text-black shadow-lg`}>
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-100">{record.name}</p>
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
                      <Cpu className="h-3.5 w-3.5 text-zinc-600" />
                      <span className="text-xs font-mono text-zinc-400">{record.serial}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Box className="h-3.5 w-3.5 text-indigo-500" />
                      <span className="text-xs text-zinc-300 font-medium">{record.model}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Tag className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-xs text-zinc-400">{record.category}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {record.checkedOutTo ? (
                        <span className="inline-flex rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-400 border border-blue-500/20">
                          Deployed
                        </span>
                      ) : (
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          record.status === "Ready to Deploy" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          record.status === "Broken - Not Fixable" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                          record.status === "Pending" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                          record.status === "Archive" ? "bg-zinc-500/30 text-zinc-400 border border-white/5" :
                          record.status === "Lost/Stolen" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" :
                          record.status === "Out of Diagnostic" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" :
                          record.status === "Out for Repair" ? "bg-violet-500/10 text-violet-400 border border-violet-500/20" :
                          "bg-zinc-500/10 text-zinc-400 border border-white/5"
                        }`}>
                          {record.status}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-xs text-zinc-300">
                    <div className="flex items-center gap-2">
                      {record.checkedOutTo ? (
                        <>
                          <User className="h-3.5 w-3.5 text-indigo-400" />
                          <span>{record.checkedOutTo}</span>
                        </>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <MapPin className="h-3.5 w-3.5 text-rose-500" />
                      <span>{record.location}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 text-sm font-bold text-zinc-200 font-mono">
                      <DollarSign className="h-3 w-3 text-zinc-500" />
                      {record.purchaseCost.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 text-sm font-bold text-emerald-400 font-mono">
                      <TrendingUp className="h-3 w-3 text-emerald-500/50" />
                      {record.currentValue.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center">
                    {record.checkedOutTo ? (
                      <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all active:scale-95 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20">
                        <ArrowLeftRight className="h-3.5 w-3.5" />
                        Checkin
                      </button>
                    ) : record.status === "Ready to Deploy" ? (
                      <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all active:scale-95 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-600/20 border border-emerald-500/20">
                        <ArrowLeftRight className="h-3.5 w-3.5" />
                        Checkout
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter italic">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button className="p-2 rounded-xl text-zinc-500 hover:bg-white/10 hover:text-white transition-all active:scale-90" title="Clone Item">
                        <Copy className="h-4 w-4" />
                      </button>
                      <button className="p-2 rounded-xl text-zinc-500 hover:bg-indigo-500/10 hover:text-indigo-400 transition-all active:scale-90" title="Audit">
                        <ClipboardCheck className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => router.push(`/assets/edit/${record.id}`)}
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
