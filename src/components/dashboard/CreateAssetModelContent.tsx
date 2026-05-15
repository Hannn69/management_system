"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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
  Upload, 
  X, 
  Save, 
  ArrowLeft 
} from "lucide-react";

export function CreateAssetModelContent() {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  const [loading, setLoading] = useState(false);
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
    requireSerialNumber: true,
  });

  const fetchData = useCallback(async () => {
    try {
      const fetchOpts = { credentials: "include" as const };
      const [catRes, mfrRes] = await Promise.all([
        fetch(`${apiBase}/categories`, fetchOpts),
        fetch(`${apiBase}/manufacturers`, fetchOpts),
      ]);

      if (catRes.ok) setCategories((await catRes.json()).records || []);
      if (mfrRes.ok) setManufacturers((await mfrRes.json()).records || []);
    } catch (err) {
      console.error("Failed to fetch dropdown data", err);
    }
  }, [apiBase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!form.name || !form.categoryId || !form.manufacturerId) {
      setError("Name, Category, and Manufacturer are required.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...form,
        categoryId: Number(form.categoryId),
        manufacturerId: Number(form.manufacturerId),
        minQty: form.minQty ? Number(form.minQty) : undefined,
        eolMonths: form.eolMonths ? Number(form.eolMonths) : undefined,
      };

      const res = await fetch(`${apiBase}/asset-models`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create asset model");
      }

      router.push("/asset-models");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="px-6 pb-6 pt-5">
      <div className="mx-auto w-full max-w-[1380px] flex flex-1 flex-col gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/asset-models")}
            className="p-2 rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-all shadow-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">Create Asset Model</h2>
            <p className="text-zinc-400 text-sm">Define a new equipment template for your inventory.</p>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-sm text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Model Name</label>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. MacBook Pro 14"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all shadow-inner"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Category</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-500" />
                      <select 
                        required
                        className="w-full rounded-2xl border border-white/10 bg-[#121212] pl-12 pr-4 py-3.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all shadow-inner appearance-none"
                        value={form.categoryId}
                        onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                      >
                        <option value="">Select category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Manufacturer</label>
                    <div className="relative">
                      <Factory className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                      <select 
                        required
                        className="w-full rounded-2xl border border-white/10 bg-[#121212] pl-12 pr-4 py-3.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all shadow-inner appearance-none"
                        value={form.manufacturerId}
                        onChange={(e) => setForm({ ...form, manufacturerId: e.target.value })}
                      >
                        <option value="">Select manufacturer</option>
                        {manufacturers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Model Number</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500" />
                    <input 
                      type="text" 
                      placeholder="Manufacturer part number"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all shadow-inner"
                      value={form.modelNumber}
                      onChange={(e) => setForm({ ...form, modelNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Min. Qty</label>
                    <div className="relative">
                      <Inbox className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500" />
                      <input 
                        type="number" 
                        placeholder="Alert threshold"
                        className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all shadow-inner"
                        value={form.minQty}
                        onChange={(e) => setForm({ ...form, minQty: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">EOL (Months)</label>
                    <div className="relative">
                      <CalendarClock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-500" />
                      <input 
                        type="number" 
                        placeholder="End of life cycle"
                        className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 transition-all shadow-inner"
                        value={form.eolMonths}
                        onChange={(e) => setForm({ ...form, eolMonths: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Model Image</label>
                  <div className="group relative h-[180px] rounded-3xl border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/[0.08] hover:border-emerald-500/30 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 overflow-hidden shadow-inner">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-zinc-200">Click or drag to upload</p>
                      <p className="text-[11px] text-zinc-500 mt-1">PNG, JPG or SVG (Max. 2MB)</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Notes / Description</label>
                  <div className="relative">
                    <ClipboardList className="absolute left-4 top-4 h-4 w-4 text-zinc-500" />
                    <textarea 
                      rows={4}
                      placeholder="Additional information about this model..."
                      className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all shadow-inner resize-none"
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 pt-2">
                   <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        id="isRequestable"
                        className="w-5 h-5 rounded-lg border-white/10 bg-white/5 text-emerald-500 focus:ring-offset-0 focus:ring-emerald-500/20"
                        checked={form.isRequestable}
                        onChange={(e) => setForm({ ...form, isRequestable: e.target.checked })}
                      />
                      <label htmlFor="isRequestable" className="text-sm font-medium text-zinc-300 cursor-pointer">Requestable</label>
                   </div>
                   <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        id="requireSerialNumber"
                        className="w-5 h-5 rounded-lg border-white/10 bg-white/5 text-emerald-500 focus:ring-offset-0 focus:ring-emerald-500/20"
                        checked={form.requireSerialNumber}
                        onChange={(e) => setForm({ ...form, requireSerialNumber: e.target.checked })}
                      />
                      <label htmlFor="requireSerialNumber" className="text-sm font-medium text-zinc-300 cursor-pointer">Req. Serial</label>
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-2">
            <button 
              type="button"
              onClick={() => router.push("/asset-models")}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/10 bg-white/5 text-sm font-bold text-zinc-400 hover:bg-white/10 hover:text-white transition-all shadow-lg active:scale-95"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-sm font-bold text-white shadow-[0_15px_35px_-10px_rgba(16,185,129,0.5)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              {loading ? (
                 <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{loading ? 'Processing...' : 'Save Asset Model'}</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
