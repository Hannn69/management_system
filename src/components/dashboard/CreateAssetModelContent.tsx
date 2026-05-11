"use client";

import { useState } from "react";
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
  FileText, 
  UserCheck, 
  Upload, 
  X, 
  Save, 
  ArrowLeft,
  Plus,
  ChevronDown
} from "lucide-react";

export function CreateAssetModelContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/asset-models");
    }, 1000);
  };

  return (
    <main className="px-6 pb-6 pt-5">
      <div className="mx-auto w-full max-w-[1380px] flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/asset-models")}
            className="p-2 rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-all shadow-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">Register Asset Model</h2>
            <p className="text-zinc-400 text-sm">Define a template for new assets, including manufacturer and depreciation rules.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
              
              {/* Left Column: Model Identity & Classification */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Asset Model Name</label>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500" />
                    <input required type="text" placeholder="e.g. MacBook Pro M3, ThinkPad X1" className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Category</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500" />
                      <select className="w-full rounded-2xl border border-white/10 bg-[#1a1b1e] pl-12 pr-10 py-3.5 text-sm text-zinc-100 appearance-none focus:outline-none">
                        <option>Select Category</option>
                        <option>Laptops</option>
                        <option>Monitors</option>
                        <option>Printers</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                    </div>
                    <button type="button" className="p-3.5 rounded-2xl border border-white/10 bg-white/5 text-amber-500 hover:bg-amber-500/10 transition-all">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Manufacturer</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Factory className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-500" />
                      <select className="w-full rounded-2xl border border-white/10 bg-[#1a1b1e] pl-12 pr-10 py-3.5 text-sm text-zinc-100 appearance-none focus:outline-none">
                        <option>Select Manufacturer</option>
                        <option>Apple</option>
                        <option>Dell</option>
                        <option>HP</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                    </div>
                    <button type="button" className="p-3.5 rounded-2xl border border-white/10 bg-white/5 text-amber-500 hover:bg-amber-500/10 transition-all">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Model Number</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input type="text" placeholder="Model No." className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none" />
                  </div>
                </div>
              </div>

              {/* Right Column: Inventory & Request Rules */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Depreciation</label>
                    <div className="relative">
                      <TrendingDown className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                      <select className="w-full rounded-2xl border border-white/10 bg-[#1a1b1e] pl-12 pr-10 py-3.5 text-sm text-zinc-100 appearance-none focus:outline-none">
                        <option>No Depreciation</option>
                        <option>Computer Hardware (20%)</option>
                        <option>Office Equipment (10%)</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Min. QTY</label>
                    <div className="relative">
                      <Inbox className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                      <input type="number" placeholder="0" className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-zinc-100 focus:outline-none" />
                    </div>
                    {/* Tick box below Min QTY */}
                    <label className="flex items-center gap-3 cursor-pointer group mt-3 ml-1">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                        <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 text-amber-600 focus:ring-amber-500/20" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Barcode className="h-3.5 w-3.5 text-zinc-500" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 group-hover:text-zinc-200 transition-colors">Require Serial Number</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">EOL (End of Life)</label>
                    <div className="relative">
                      <CalendarClock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                      <input type="number" placeholder="Months" className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-zinc-100 focus:outline-none" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">Months</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Fieldset</label>
                    <div className="relative">
                      <ClipboardList className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                      <select className="w-full rounded-2xl border border-white/10 bg-[#1a1b1e] pl-12 pr-10 py-3.5 text-sm text-zinc-100 appearance-none focus:outline-none">
                        <option>None</option>
                        <option>Computer Fieldset</option>
                        <option>Mobile Phone Fieldset</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Model Image</label>
                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5">
                    <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                      <Upload className="h-5 w-5 text-zinc-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-zinc-400 mb-2 font-medium">Select model photo...</p>
                      <button type="button" className="px-4 py-1.5 rounded-lg border border-white/10 bg-white/5 text-[11px] font-bold text-zinc-200 hover:bg-white/10 transition-all">
                        Select File...
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Notes</label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 h-4 w-4 text-zinc-600" />
                <textarea rows={3} placeholder="Technical specifications, model variations or other info..." className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-zinc-100 focus:outline-none resize-none" />
              </div>
              {/* Tick box below Notes */}
              <label className="flex items-center gap-3 cursor-pointer group pt-2 ml-1">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                  <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 text-amber-600 focus:ring-amber-500/20" />
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="h-3.5 w-3.5 text-zinc-500" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 group-hover:text-zinc-200 transition-colors">Users may request this model</span>
                </div>
              </label>
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
              className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 text-sm font-bold text-white shadow-[0_15px_35px_-10px_rgba(217,119,6,0.5)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
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
