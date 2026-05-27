"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { QuickCreateCategoryModal } from "@/components/dashboard/QuickCreateCategoryModal";
import { QuickCreateManufacturerModal } from "@/components/dashboard/QuickCreateManufacturerModal";
import { 
  Package, 
  Tag, 
  Factory, 
  Hash, 
  Inbox, 
  CalendarClock, 
  ClipboardList, 
  FileText,
  X, 
  Save, 
  Plus,
  ChevronDown
} from "lucide-react";

function CreateAssetModelContentInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const { push } = useToast();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [quickCreateCategoryOpen, setQuickCreateCategoryOpen] = useState(false);
  const [quickCreateManufacturerOpen, setQuickCreateManufacturerOpen] = useState(false);

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
    image: null as string | null,
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

  const handleBack = () => {
    if (returnTo) {
      router.push(returnTo);
    } else {
      router.push("/asset-models");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!form.name || !form.categoryId || !form.manufacturerId) {
      const errorMsg = "Name, Category, and Manufacturer are required.";
      setError(errorMsg);
      push(errorMsg, "error");
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

      push("Asset Model created successfully!", "success");
      handleBack();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setError(errorMsg);
      push(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="px-6 pb-6 pt-5">
      <div className="mx-auto w-full max-w-[1380px] flex flex-1 flex-col gap-6">
        {error && (
          <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-sm text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-[28px] border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#111216] p-8 shadow-2xl backdrop-blur-xl">
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
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all shadow-inner"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Category</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-500" />
                      <select 
                        required
                        className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-[#111216] pl-12 pr-10 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all shadow-inner appearance-none"
                        value={form.categoryId}
                        onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                      >
                        <option value="" className="bg-white dark:bg-[#111216]">Select category</option>
                        {categories.map(c => <option key={c.id} value={c.id} className="bg-white dark:bg-[#111216]">{c.name}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setQuickCreateCategoryOpen(true)}
                      className="flex items-center justify-center p-3.5 rounded-2xl bg-cyan-600/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-600/20 transition-all shadow-lg active:scale-95"
                      title="New Category"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Manufacturer</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Factory className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                      <select 
                        required
                        className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-[#111216] pl-12 pr-10 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all shadow-inner appearance-none"
                        value={form.manufacturerId}
                        onChange={(e) => setForm({ ...form, manufacturerId: e.target.value })}
                      >
                        <option value="" className="bg-white dark:bg-[#111216]">Select manufacturer</option>
                        {manufacturers.map(m => <option key={m.id} value={m.id} className="bg-white dark:bg-[#111216]">{m.name}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setQuickCreateManufacturerOpen(true)}
                      className="flex items-center justify-center p-3.5 rounded-2xl bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600/20 transition-all shadow-lg active:scale-95"
                      title="New Manufacturer"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Model Number</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500" />
                    <input 
                      type="text" 
                      placeholder="Manufacturer part number"
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all shadow-inner"
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
                        className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all shadow-inner"
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
                        className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 transition-all shadow-inner"
                        value={form.eolMonths}
                        onChange={(e) => setForm({ ...form, eolMonths: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <ImageUpload 
                    value={form.image} 
                    onChange={(val) => setForm({...form, image: val})} 
                    label="Model Image"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Notes / Description</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 h-4 w-4 text-zinc-500" />
                    <textarea 
                      rows={4}
                      placeholder="Additional information about this model..."
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all shadow-inner resize-none"
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
                        className="w-5 h-5 rounded-lg border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-emerald-500 focus:ring-offset-0 focus:ring-emerald-500/20"
                        checked={form.isRequestable}
                        onChange={(e) => setForm({ ...form, isRequestable: e.target.checked })}
                      />
                      <label htmlFor="isRequestable" className="text-sm font-medium text-zinc-600 dark:text-zinc-300 cursor-pointer">Requestable</label>
                   </div>
                   <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        id="requireSerialNumber"
                        className="w-5 h-5 rounded-lg border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-emerald-500 focus:ring-offset-0 focus:ring-emerald-500/20"
                        checked={form.requireSerialNumber}
                        onChange={(e) => setForm({ ...form, requireSerialNumber: e.target.checked })}
                      />
                      <label htmlFor="requireSerialNumber" className="text-sm font-medium text-zinc-600 dark:text-zinc-300 cursor-pointer">Req. Serial</label>
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-2">
            <button 
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-sm font-bold text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10 hover:text-foreground dark:hover:text-white transition-all shadow-lg active:scale-95"
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

        <QuickCreateCategoryModal 
          open={quickCreateCategoryOpen}
          onClose={() => setQuickCreateCategoryOpen(false)}
          onSuccess={(newCat) => {
            setCategories(prev => [newCat, ...prev]);
            setForm(prev => ({ ...prev, categoryId: newCat.id.toString() }));
          }}
        />

        <QuickCreateManufacturerModal 
          open={quickCreateManufacturerOpen}
          onClose={() => setQuickCreateManufacturerOpen(false)}
          onSuccess={(newMfr) => {
            setManufacturers(prev => [newMfr, ...prev]);
            setForm(prev => ({ ...prev, manufacturerId: newMfr.id.toString() }));
          }}
        />
      </div>
    </main>
  );
}

export function CreateAssetModelContent() {
  return (
    <Suspense fallback={null}>
      <CreateAssetModelContentInner />
    </Suspense>
  );
}
