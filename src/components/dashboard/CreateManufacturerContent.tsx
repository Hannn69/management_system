"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Factory, 
  Globe, 
  LifeBuoy, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Upload, 
  FileText, 
  X, 
  Save, 
  ArrowLeft 
} from "lucide-react";

export function CreateManufacturerContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/manufacturers");
    }, 1000);
  };

  return (
    <main className="px-6 pb-6 pt-5">
      <div className="mx-auto w-full max-w-[1380px] flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/manufacturers")}
            className="p-2 rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-all shadow-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">Add New Manufacturer</h2>
            <p className="text-zinc-400 text-sm">Register a hardware or software manufacturer for asset categorization.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
              
              {/* Left Column: Core Identity & Links */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Manufacturer Name</label>
                  <div className="relative">
                    <Factory className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-500" />
                    <input required type="text" placeholder="e.g. Apple, Dell, Microsoft" className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500/20" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Website URL</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                    <input type="url" placeholder="https://www.manufacturer.com" className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Support URL</label>
                  <div className="relative">
                    <LifeBuoy className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-500" />
                    <input type="url" placeholder="https://support.manufacturer.com" className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Warranty Lookup URL</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500" />
                    <input type="url" placeholder="https://warranty.manufacturer.com" className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none" />
                  </div>
                  <p className="px-2 text-[10px] leading-normal text-zinc-500">
                    Variables <span className="text-zinc-300 font-mono">{"{LOCALE}, {SERIAL}, {MODEL_NUMBER}"}</span>, and <span className="text-zinc-300 font-mono">{"{MODEL_NAME}"}</span> may be used in your URL to have those values auto-populate when viewing assets - for example <span className="text-emerald-500/80 italic">https://checkcoverage.apple.com/{"{LOCALE}"}/{"{SERIAL}"}</span>.
                  </p>
                </div>
              </div>

              {/* Right Column: Support & Media */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Support Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                      <input type="tel" placeholder="+1..." className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-zinc-100 focus:outline-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Support Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500" />
                      <input type="email" placeholder="support@mfr.com" className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-zinc-100 focus:outline-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Manufacturer Logo</label>
                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5">
                    <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                      <Upload className="h-5 w-5 text-zinc-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-zinc-400 mb-2 font-medium">Select brand logo...</p>
                      <button type="button" className="px-4 py-1.5 rounded-lg border border-white/10 bg-white/5 text-[11px] font-bold text-zinc-200 hover:bg-white/10 transition-all">
                        Select File...
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Internal Notes</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 h-4 w-4 text-zinc-600" />
                    <textarea rows={6} placeholder="Support tiers, account managers, or other internal references..." className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-zinc-100 focus:outline-none resize-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-2">
            <button 
              type="button"
              onClick={() => router.push("/manufacturers")}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/10 bg-white/5 text-sm font-bold text-zinc-400 hover:bg-white/10 hover:text-white transition-all shadow-lg active:scale-95"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 text-sm font-bold text-white shadow-[0_15px_35px_-10px_rgba(225,29,72,0.5)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? (
                 <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{loading ? 'Adding...' : 'Save Manufacturer'}</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
