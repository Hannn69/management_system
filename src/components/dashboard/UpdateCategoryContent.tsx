"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { 
  Tag, 
  Layers, 
  FileCheck, 
  ShieldAlert, 
  Mail, 
  Upload, 
  FileText, 
  X, 
  Save, 
  ArrowLeft 
} from "lucide-react";

interface UpdateCategoryContentProps {
  slug: string;
}

export function UpdateCategoryContent({ slug }: UpdateCategoryContentProps) {
  const router = useRouter();
  const { push } = useToast();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    type: "Asset",
    eula: "",
    useDefaultEula: true,
    requireConfirmation: false,
    emailNotification: false,
    notes: "",
  });

  const fetchCategory = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/categories/${slug}`, { credentials: "include" });
      if (res.ok) {
        const { record } = await res.json();
        setForm({
          name: record.name || "",
          type: record.type || "Asset",
          eula: record.eula || "",
          useDefaultEula: record.useDefaultEula ?? true,
          requireConfirmation: record.requireConfirmation ?? false,
          emailNotification: record.emailNotification ?? false,
          notes: record.notes || "",
        });
      }
    } catch (err) {
      console.error("Failed to fetch category", err);
    } finally {
      setFetching(false);
    }
  }, [apiBase, slug]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiBase}/categories/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update category");
      }

      push("Category updated successfully!", "success");
      router.push("/categories");
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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="px-6 pb-6 pt-5">
      <div className="mx-auto w-full max-w-[1380px] flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/categories")}
            className="p-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10 hover:text-foreground dark:hover:text-white transition-all shadow-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Update Category</h2>
            <p className="text-zinc-400 text-sm">Modify existing resource group for {form.name}.</p>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-sm text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-[28px] border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Category Name</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Workstations, Licenses"
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all shadow-inner"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Category Type</label>
                  <div className="relative">
                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-500" />
                    <select 
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#111216] pl-12 pr-4 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all shadow-inner appearance-none"
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                    >
                      <option value="Asset" className="bg-white dark:bg-[#111216]">Asset</option>
                      <option value="Accessory" className="bg-white dark:bg-[#111216]">Accessory</option>
                      <option value="Consumable" className="bg-white dark:bg-[#111216]">Consumable</option>
                      <option value="Component" className="bg-white dark:bg-[#111216]">Component</option>
                      <option value="License" className="bg-white dark:bg-[#111216]">License</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="useDefaultEula"
                      className="w-5 h-5 rounded-lg border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-emerald-500"
                      checked={form.useDefaultEula}
                      onChange={(e) => setForm({ ...form, useDefaultEula: e.target.checked })}
                    />
                    <label htmlFor="useDefaultEula" className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Use default EULA</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="requireConfirmation"
                      className="w-5 h-5 rounded-lg border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-emerald-500"
                      checked={form.requireConfirmation}
                      onChange={(e) => setForm({ ...form, requireConfirmation: e.target.checked })}
                    />
                    <label htmlFor="requireConfirmation" className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Require check-in confirmation</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="emailNotification"
                      className="w-5 h-5 rounded-lg border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-emerald-500"
                      checked={form.emailNotification}
                      onChange={(e) => setForm({ ...form, emailNotification: e.target.checked })}
                    />
                    <label htmlFor="emailNotification" className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Send email notification</label>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Category Image</label>
                  <div className="group relative h-[140px] rounded-3xl border-2 border-dashed border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/[0.08] hover:border-emerald-500/30 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 overflow-hidden shadow-inner">
                    <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="h-5 w-5 text-emerald-400" />
                    </div>
                    <p className="text-xs font-bold text-zinc-500 dark:text-zinc-200">Update Image</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Notes</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 h-4 w-4 text-zinc-500" />
                    <textarea 
                      rows={3}
                      placeholder="Category description..."
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all shadow-inner resize-none"
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-2">
            <button 
              type="button"
              onClick={() => router.push("/categories")}
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
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
