"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export function CreateCategoryContent() {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiBase}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create category");
      }

      router.push("/categories");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="px-6 pb-6 pt-5">
      <div className="mx-auto w-full max-w-[1380px] flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/categories")}
            className="p-2 rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-all shadow-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">Create New Category</h2>
            <p className="text-zinc-400 text-sm">Organize your assets and resources into logical groups.</p>
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
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Category Name</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Workstations, Licenses"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all shadow-inner"
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
                      className="w-full rounded-2xl border border-white/10 bg-[#121212] pl-12 pr-4 py-3.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all shadow-inner appearance-none"
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                    >
                      <option value="Asset">Asset</option>
                      <option value="Accessory">Accessory</option>
                      <option value="Consumable">Consumable</option>
                      <option value="Component">Component</option>
                      <option value="License">License</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="useDefaultEula"
                      className="w-5 h-5 rounded-lg border-white/10 bg-white/5 text-emerald-500"
                      checked={form.useDefaultEula}
                      onChange={(e) => setForm({ ...form, useDefaultEula: e.target.checked })}
                    />
                    <label htmlFor="useDefaultEula" className="text-sm font-medium text-zinc-300">Use default EULA</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="requireConfirmation"
                      className="w-5 h-5 rounded-lg border-white/10 bg-white/5 text-emerald-500"
                      checked={form.requireConfirmation}
                      onChange={(e) => setForm({ ...form, requireConfirmation: e.target.checked })}
                    />
                    <label htmlFor="requireConfirmation" className="text-sm font-medium text-zinc-300">Require check-in confirmation</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="emailNotification"
                      className="w-5 h-5 rounded-lg border-white/10 bg-white/5 text-emerald-500"
                      checked={form.emailNotification}
                      onChange={(e) => setForm({ ...form, emailNotification: e.target.checked })}
                    />
                    <label htmlFor="emailNotification" className="text-sm font-medium text-zinc-300">Send email notification</label>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Category Image</label>
                  <div className="group relative h-[140px] rounded-3xl border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/[0.08] hover:border-emerald-500/30 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 overflow-hidden shadow-inner">
                    <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="h-5 w-5 text-emerald-400" />
                    </div>
                    <p className="text-xs font-bold text-zinc-200">Upload Image</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Notes</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 h-4 w-4 text-zinc-500" />
                    <textarea 
                      rows={3}
                      placeholder="Category description..."
                      className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all shadow-inner resize-none"
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
              <span>{loading ? 'Adding...' : 'Save Category'}</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
