"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Box, 
  Tag, 
  Factory, 
  Hash, 
  Inbox, 
  CalendarClock, 
  ClipboardList, 
  FileText, 
  ArrowLeft, 
  Edit2, 
  Image as ImageIcon,
  CheckCircle2,
  XCircle
} from "lucide-react";

import { AssetModelRecord } from "@/lib/types";

interface AssetModelDetailContentProps {
  slug: string;
}

export function AssetModelDetailContent({ slug }: AssetModelDetailContentProps) {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  const [record, setRecord] = useState<AssetModelRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecord = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/asset-models/${slug}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch asset model details");
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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="p-12 text-center">
        <p className="text-rose-400 font-bold">{error || "Asset Model not found"}</p>
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
                <Box className="h-3 w-3" />
                <span>Model Specifications</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mt-1">{record.name}</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-mono tracking-tight">{record.slug}</p>
            </div>
          </div>

          <button 
            onClick={() => router.push(`/asset-models/${slug}/edit`)}
            className="flex items-center gap-2 rounded-2xl bg-amber-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Edit2 className="h-4 w-4" />
            Edit Model
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Main Spec Card */}
            <div className="rounded-[32px] border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#111216] p-8 shadow-sm dark:shadow-2xl">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-56 h-56 rounded-[24px] bg-slate-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center overflow-hidden">
                  {record.image ? (
                    <img src={record.image} alt={record.name} className="w-full h-full object-cover" />
                  ) : (
                    <Box className="h-16 w-16 text-zinc-300 dark:text-zinc-700" />
                  )}
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Model Number</p>
                    <div className="flex items-center gap-2 text-foreground font-mono font-medium">
                      <Hash className="h-4 w-4 text-zinc-400" />
                      {record.modelNo || "N/A"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Manufacturer</p>
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <Factory className="h-4 w-4 text-rose-500" />
                      {record.manufacturer || "Generic"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Category</p>
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <Tag className="h-4 w-4 text-indigo-500" />
                      {record.category || "Uncategorized"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Fieldset</p>
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <ClipboardList className="h-4 w-4 text-amber-500" />
                      Default Fields
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-10 border-t border-zinc-200 dark:border-white/5">
                <h4 className="text-sm font-bold text-foreground mb-4">Configuration Requirements</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-2xl border border-zinc-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
                    {record.requireSerialNumber ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <XCircle className="h-5 w-5 text-zinc-400" />}
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Requires Serial Number</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-2xl border border-zinc-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
                    {record.isRequestable ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <XCircle className="h-5 w-5 text-zinc-400" />}
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Requestable by Users</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Assets using this model */}
            <div className="rounded-[32px] border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#111216] p-8 shadow-sm">
              <h3 className="text-xl font-bold text-foreground mb-6">Inventory Items</h3>
              <p className="text-center text-sm text-zinc-500 py-12 bg-slate-50 dark:bg-white/[0.02] rounded-3xl border border-dashed border-zinc-200 dark:border-white/10">
                No active assets are currently using this model template.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[32px] border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#111216] p-8 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-6">Stock Summary</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Inbox className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Min Qty</span>
                  </div>
                  <span className="text-lg font-black text-foreground">{record.minQty || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <CalendarClock className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">EOL (Months)</span>
                  </div>
                  <span className="text-lg font-black text-rose-500">{record.eolMonths || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#111216] p-8 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-4">Technical Notes</h3>
              <div className="flex gap-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                <FileText className="h-4 w-4 mt-0.5 shrink-0 text-zinc-400" />
                <p>{record.notes || "No technical notes provided for this model."}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
