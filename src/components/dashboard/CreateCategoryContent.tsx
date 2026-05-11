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
  ArrowLeft,
  ChevronDown
} from "lucide-react";

export function CreateCategoryContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/categories");
    }, 1000);
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
            <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">Add New Category</h2>
            <p className="text-zinc-400 text-sm">Classify your assets and define specific licensing and notification rules.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
              
              {/* Left Column: Core Identity & EULA */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Category Name</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500" />
                    <input required type="text" placeholder="e.g. Laptops, Software, Furniture" className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Category Type</label>
                  <div className="relative">
                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-500" />
                    <select className="w-full rounded-2xl border border-white/10 bg-[#1a1b1e] pl-12 pr-10 py-3.5 text-sm text-zinc-100 appearance-none focus:outline-none">
                      <option>Select Type</option>
                      <option>Asset</option>
                      <option>Accessory</option>
                      <option>Consumable</option>
                      <option>Component</option>
                      <option>License</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Category EULA</label>
                  <div className="relative">
                    <FileCheck className="absolute left-4 top-4 h-4 w-4 text-zinc-600" />
                    <textarea rows={8} placeholder="Enter specific End User License Agreement for this category..." className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-zinc-100 focus:outline-none resize-none" />
                  </div>
                </div>
              </div>

              {/* Right Column: Workflow Options & Media */}
              <div className="space-y-6">
                <div className="space-y-4 p-6 rounded-[28px] border border-white/10 bg-white/[0.02]">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">Agreement Rules</h3>
                  
                  <label className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group">
                    <div className="mt-1">
                      <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-500/20" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-200 group-hover:text-white">Use Default EULA</p>
                      <p className="text-[11px] text-zinc-500">Use the primary default EULA instead of category-specific terms.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group">
                    <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center">
                      <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-500/20" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-200 group-hover:text-white">Require Confirmation</p>
                      <p className="text-[11px] text-zinc-500">Require users to confirm acceptance of assets in this category.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group">
                    <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center">
                      <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-500/20" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-200 group-hover:text-white">Email Notifications</p>
                      <p className="text-[11px] text-zinc-500">Send email to user upon checkin/checkout of items in this category.</p>
                    </div>
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Category Image</label>
                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5">
                    <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                      <Upload className="h-5 w-5 text-zinc-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-zinc-400 mb-2 font-medium">Select category icon...</p>
                      <button type="button" className="px-4 py-1.5 rounded-lg border border-white/10 bg-white/5 text-[11px] font-bold text-zinc-200 hover:bg-white/10 transition-all">
                        Select File...
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Notes</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 h-4 w-4 text-zinc-600" />
                    <textarea rows={4} placeholder="Internal classification notes..." className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-zinc-100 focus:outline-none resize-none" />
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
              className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-sm font-bold text-white shadow-[0_15px_35px_-10px_rgba(79,70,229,0.5)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
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
