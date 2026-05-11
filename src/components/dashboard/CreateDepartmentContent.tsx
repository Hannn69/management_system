"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Building2, 
  Phone, 
  Printer, 
  User, 
  MapPin, 
  Upload, 
  FileText, 
  X, 
  Save, 
  ArrowLeft,
  Plus,
  ChevronDown
} from "lucide-react";

export function CreateDepartmentContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/departments");
    }, 1000);
  };

  return (
    <main className="px-6 pb-6 pt-5">
      <div className="mx-auto w-full max-w-[1380px] flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/departments")}
            className="p-2 rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-all shadow-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">Register New Department</h2>
            <p className="text-zinc-400 text-sm">Create a new department and assign its organizational hierarchy.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              
              {/* Left Column: Department Identity */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Department Name</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-500" />
                    <input required type="text" placeholder="e.g. Quality Assurance, Human Resources" className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all shadow-inner" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Company</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500" />
                    <select className="w-full rounded-2xl border border-white/10 bg-[#1a1b1e] pl-12 pr-10 py-3.5 text-sm text-zinc-100 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                      <option>Select Company</option>
                      <option>Tech Corp</option>
                      <option>Nexus Industries</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-500" />
                      <input type="tel" placeholder="+1..." className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Fax</label>
                    <div className="relative">
                      <Printer className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                      <input type="tel" placeholder="Fax..." className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Governance & Media */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Department Manager</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                      <select className="w-full rounded-2xl border border-white/10 bg-[#1a1b1e] pl-12 pr-10 py-3.5 text-sm text-zinc-100 appearance-none focus:outline-none">
                        <option>Select Manager</option>
                        <option>Alice Johnson</option>
                        <option>Bob Wilson</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                    </div>
                    <button type="button" className="p-3.5 rounded-2xl border border-white/10 bg-white/5 text-emerald-500 hover:bg-emerald-500/10 transition-all">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Default Location</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-500" />
                      <select className="w-full rounded-2xl border border-white/10 bg-[#1a1b1e] pl-12 pr-10 py-3.5 text-sm text-zinc-100 appearance-none focus:outline-none">
                        <option>Select Location</option>
                        <option>New York Office</option>
                        <option>London Studio</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                    </div>
                    <button type="button" className="p-3.5 rounded-2xl border border-white/10 bg-white/5 text-emerald-500 hover:bg-emerald-500/10 transition-all">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Department Logo / Image</label>
                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5">
                    <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                      <Upload className="h-5 w-5 text-zinc-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-zinc-400 mb-2 font-medium">Select photo...</p>
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
                <textarea rows={3} placeholder="Additional department notes, hierarchy details or instructions..." className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-zinc-100 focus:outline-none resize-none" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-2">
            <button 
              type="button"
              onClick={() => router.push("/departments")}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/10 bg-white/5 text-sm font-bold text-zinc-400 hover:bg-white/10 hover:text-white transition-all shadow-lg active:scale-95"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-sm font-bold text-white shadow-[0_15px_35px_-10px_rgba(139,92,246,0.5)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? (
                 <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{loading ? 'Processing...' : 'Save Department'}</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
