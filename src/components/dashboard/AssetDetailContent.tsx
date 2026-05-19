"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Package, 
  Tag, 
  Cpu, 
  Box, 
  User, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  ArrowLeft, 
  Edit2, 
  History,
  FileText,
  Image as ImageIcon
} from "lucide-react";

import { AssetRecord } from "@/lib/types";

interface AssetDetailContentProps {
  slug: string;
}

export function AssetDetailContent({ slug }: AssetDetailContentProps) {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  const [record, setRecord] = useState<AssetRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecord = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/assets/${slug}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch asset details");
      const data = await res.json();
      setRecord(data.record);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [apiBase, slug]);

  useEffect(() => {
    fetchRecord();
  }, [fetchRecord]);

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="p-12 text-center">
        <p className="text-rose-400 font-bold">{error || "Asset not found"}</p>
        <button onClick={() => router.back()} className="mt-4 text-sm text-zinc-400 hover:text-white flex items-center gap-2 mx-auto">
          <ArrowLeft className="h-4 w-4" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <main className="px-6 pb-12 pt-5">
      <div className="mx-auto w-full max-w-[1400px] space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 text-zinc-400 hover:text-foreground dark:hover:text-white transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                <Package className="h-3 w-3" />
                <span>Asset Profile</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mt-1">{record.name}</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-mono tracking-tight">{record.assetTag}</p>
            </div>
          </div>

          <button 
            onClick={() => router.push(`/assets/${slug}/edit`)}
            className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Edit2 className="h-4 w-4" />
            Edit Asset
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-[32px] border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#111216] p-8 shadow-sm dark:shadow-2xl">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Image Placeholder */}
                <div className="w-full md:w-64 h-64 rounded-[24px] bg-slate-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center overflow-hidden">
                  {record.image ? (
                    <img src={record.image} alt={record.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-zinc-400">
                      <ImageIcon className="h-12 w-12 opacity-20" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">No Preview</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Serial Number</p>
                    <div className="flex items-center gap-2 text-foreground font-mono font-medium">
                      <Cpu className="h-4 w-4 text-indigo-500" />
                      {record.serial || "N/A"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Model</p>
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <Box className="h-4 w-4 text-amber-500" />
                      {typeof record.model === 'object' ? record.model?.name : record.model}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Category</p>
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <Tag className="h-4 w-4 text-rose-500" />
                      {record.category}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Location</p>
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <MapPin className="h-4 w-4 text-cyan-500" />
                      {typeof record.location === 'object' ? record.location?.name : record.location}
                    </div>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Notes</p>
                    <div className="flex gap-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      <FileText className="h-4 w-4 mt-0.5 shrink-0" />
                      {record.notes || "No additional information provided."}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* History Section */}
            <div className="rounded-[32px] border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#111216] p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                  <History className="h-5 w-5 text-indigo-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Operational History</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-2xl border border-zinc-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <div>
                      <p className="text-sm font-bold text-foreground">Asset Seeded</p>
                      <p className="text-[10px] text-zinc-400">System initialization</p>
                    </div>
                  </div>
                  <span className="text-xs text-zinc-500 font-mono">2026-05-18</span>
                </div>
                <p className="text-center text-xs text-zinc-500 py-4 italic">End of recent activity</p>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="rounded-[32px] border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#111216] p-8 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-6">Status & Ownership</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Current State</p>
                  <div className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                    record.status === "Ready to Deploy" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" :
                    "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                  }`}>
                    {record.status}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Checked Out To</p>
                  <div className="flex items-center gap-3 p-3 rounded-2xl border border-zinc-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
                    <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                      <User className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{record.checkedOutTo || "In Stock"}</p>
                      <p className="text-[10px] text-zinc-500">Owner Entity</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-200 dark:border-white/5 grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Purchase Cost</p>
                    <div className="flex items-center gap-1.5 text-lg font-black text-foreground font-mono">
                      <DollarSign className="h-4 w-4 text-emerald-500" />
                      {record.purchaseCost?.toFixed(2) || "0.00"}
                    </div>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Current Value</p>
                    <div className="flex items-center justify-end gap-1.5 text-lg font-black text-cyan-500 font-mono">
                      {record.currentValue?.toFixed(2) || record.purchaseCost?.toFixed(2) || "0.00"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#111216] p-8 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-6">Financial Dates</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Calendar className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Purchased</span>
                  </div>
                  <span className="text-xs font-mono text-foreground font-bold">2026-05-18</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs font-bold uppercase tracking-wider">Warranty</span>
                  </div>
                  <span className="text-xs font-bold text-foreground">36 Months</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Clock className="h-4 w-4 text-rose-500" />
                    <span className="text-xs font-bold uppercase tracking-wider">EOL Date</span>
                  </div>
                  <span className="text-xs font-mono text-rose-400 font-bold">2029-05-18</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
