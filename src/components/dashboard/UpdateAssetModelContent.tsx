"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { 
  Package, 
  Tag, 
  Factory, 
  Hash, 
  TrendingDown, 
  Inbox, 
  Barcode, 
  CalendarClock, 
  ClipboardList, 
  FileText, 
  UserCheck, 
  Upload, 
  X, 
  Save, 
  ArrowLeft,
  Plus,
  ChevronDown
} from "lucide-react";

interface UpdateAssetModelContentProps {
  id: string; // This is the slug
}

export function UpdateAssetModelContent({ id }: UpdateAssetModelContentProps) {
  const router = useRouter();
  const { push } = useToast();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [categories, setCategories] = useState<any[]>([]);
  const [manufacturers, setManufacturers] = useState<any[]>([]);

  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    manufacturerId: "",
    modelNumber: "",
    minQty: "",
    eolMonths: "",
    notes: "",
    isRequestable: false,
    requireSerialNumber: false,
  });

  const fetchData = useCallback(async () => {
    try {
      const fetchOpts = { credentials: "include" as const };
      const [catRes, mfrRes, modelRes] = await Promise.all([
        fetch(`${apiBase}/categories`, fetchOpts),
        fetch(`${apiBase}/manufacturers`, fetchOpts),
        fetch(`${apiBase}/asset-models/${id}`, fetchOpts),
      ]);

      if (catRes.ok) setCategories((await catRes.json()).records || []);
      if (mfrRes.ok) setManufacturers((await mfrRes.json()).records || []);
      
      if (modelRes.ok) {
        const { record } = await modelRes.json();
        setForm({
          name: record.name || "",
          categoryId: record.categoryId?.toString() || "",
          manufacturerId: record.manufacturerId?.toString() || "",
          modelNumber: record.modelNumber || "",
          minQty: record.minQty?.toString() || "",
          eolMonths: record.eolMonths?.toString() || "",
          notes: record.notes || "",
          isRequestable: record.isRequestable || false,
          requireSerialNumber: record.requireSerialNumber || false,
        });
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setFetching(false);
    }
  }, [apiBase, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...form,
        categoryId: Number(form.categoryId),
        manufacturerId: Number(form.manufacturerId),
        minQty: form.minQty ? Number(form.minQty) : null,
        eolMonths: form.eolMonths ? Number(form.eolMonths) : null,
      };

      const res = await fetch(`${apiBase}/asset-models/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update asset model");
      }

      push("Asset Model updated successfully!", "success");
      router.push("/asset-models");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setError(errorMsg);
      push(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="px-6 pb-6 pt-5">
      <div className="mx-auto w-full max-w-[1380px] flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/asset-models")}
            className="p-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10 hover:text-foreground dark:hover:text-white transition-all shadow-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Update Asset Model</h2>
            <p className="text-zinc-400 text-sm">Modify existing asset model template for {form.name}.</p>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-sm text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-[28px] border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Name</label>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500" />
                    <input 
                      required 
                      type="text" 
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. MacBook Pro M3, ThinkPad X1" 
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Category</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500" />
                      <select 
                        required
                        name="categoryId"
                        value={form.categoryId}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#111216] pl-12 pr-10 py-3.5 text-sm text-foreground appearance-none focus:outline-none"
                      >
                        <option value="" className="bg-white dark:bg-[#111216]">Select Category</option>
                        {categories.map(c => <option key={c.id} value={c.id} className="bg-white dark:bg-[#111216]">{c.name}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                    </div>
                    <button type="button" onClick={() => router.push("/categories/create")} className="p-3.5 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-amber-500 hover:bg-amber-500/10 transition-all">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Manufacturer</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Factory className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-500" />
                      <select 
                        required
                        name="manufacturerId"
                        value={form.manufacturerId}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#111216] pl-12 pr-10 py-3.5 text-sm text-foreground appearance-none focus:outline-none"
                      >
                        <option value="" className="bg-white dark:bg-[#111216]">Select Manufacturer</option>
                        {manufacturers.map(m => <option key={m.id} value={m.id} className="bg-white dark:bg-[#111216]">{m.name}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                    </div>
                    <button type="button" onClick={() => router.push("/manufacturers/create")} className="p-3.5 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-amber-500 hover:bg-amber-500/10 transition-all">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Model Number</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input 
                      type="text" 
                      name="modelNumber"
                      value={form.modelNumber}
                      onChange={handleChange}
                      placeholder="Model No." 
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Min. QTY</label>
                    <div className="relative">
                      <Inbox className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                      <input 
                        type="number" 
                        name="minQty"
                        value={form.minQty}
                        onChange={handleChange}
                        placeholder="0" 
                        className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground focus:outline-none" 
                      />
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer group mt-3 ml-1">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                        <input 
                          type="checkbox" 
                          name="requireSerialNumber"
                          checked={form.requireSerialNumber}
                          onChange={handleChange}
                          className="w-4 h-4 rounded border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-amber-600 focus:ring-amber-500/20" 
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Barcode className="h-3.5 w-3.5 text-zinc-500" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 group-hover:text-foreground dark:group-hover:text-zinc-200 transition-colors">Require Serial Number</span>
                      </div>
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">EOL (End of Life)</label>
                    <div className="relative">
                      <CalendarClock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                      <input 
                        type="number" 
                        name="eolMonths"
                        value={form.eolMonths}
                        onChange={handleChange}
                        placeholder="Months" 
                        className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground focus:outline-none" 
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-tighter">Months</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Update Model Image</label>
                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5">
                    <div className="h-12 w-12 rounded-xl bg-zinc-200 dark:bg-white/5 flex items-center justify-center border border-zinc-300 dark:border-white/10 overflow-hidden">
                      <Upload className="h-5 w-5 text-zinc-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2 font-medium">Select new photo...</p>
                      <button type="button" className="px-4 py-1.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-[11px] font-bold text-foreground dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-white/10 transition-all">
                        Select File...
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Notes</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 h-4 w-4 text-zinc-600" />
                    <textarea 
                      rows={3} 
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      placeholder="Technical specifications, model variations or other info..." 
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground focus:outline-none resize-none" 
                    />
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer group pt-2 ml-1">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                      <input 
                        type="checkbox" 
                        name="isRequestable"
                        checked={form.isRequestable}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-amber-600 focus:ring-amber-500/20" 
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-3.5 w-3.5 text-zinc-500" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 group-hover:text-foreground dark:group-hover:text-zinc-200 transition-colors">Users may request this model</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-2">
            <button 
              type="button"
              onClick={() => router.push("/asset-models")}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-sm font-bold text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10 hover:text-foreground dark:hover:text-white transition-all shadow-lg active:scale-95"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 text-sm font-bold text-white shadow-[0_15px_35px_-10px_rgba(217,119,6,0.5)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? (
                 <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{loading ? 'Updating...' : 'Update Asset Model'}</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
