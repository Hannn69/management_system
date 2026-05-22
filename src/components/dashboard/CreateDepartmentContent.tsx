"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { QuickCreateLocationModal } from "@/components/dashboard/QuickCreateLocationModal";
import { QuickCreateUserModal } from "@/components/dashboard/QuickCreateUserModal";
import { 
  Users, 
  Building2, 
  Phone, 
  User, 
  MapPin, 
  FileText, 
  X, 
  Save, 
  ArrowLeft,
  Plus,
  ChevronDown
} from "lucide-react";

export function CreateDepartmentContent() {
  const router = useRouter();
  const { push } = useToast();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quickCreateLocationOpen, setQuickCreateLocationOpen] = useState(false);
  const [quickCreateUserOpen, setQuickCreateUserOpen] = useState(false);

  const [companies, setCompanies] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);

  const [form, setForm] = useState({
    name: "",
    companyId: "",
    locationId: "",
    managerId: "",
    phone: "",
    notes: "",
    image: null as string | null,
  });

  const fetchData = useCallback(async () => {
    try {
      const fetchOpts = { credentials: "include" as const };
      const [compRes, locRes, userRes] = await Promise.all([
        fetch(`${apiBase}/companies`, fetchOpts),
        fetch(`${apiBase}/locations`, fetchOpts),
        fetch(`${apiBase}/users`, fetchOpts),
      ]);

      if (compRes.ok) setCompanies((await compRes.json()).records || []);
      if (locRes.ok) setLocations((await locRes.json()).records || []);
      if (userRes.ok) setManagers((await userRes.json()).records || []);
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

    try {
      const payload = {
        ...form,
        companyId: form.companyId ? Number(form.companyId) : undefined,
        locationId: form.locationId ? Number(form.locationId) : undefined,
        managerId: form.managerId ? Number(form.managerId) : undefined,
      };

      const res = await fetch(`${apiBase}/departments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create department");
      }

      push("Department created successfully!", "success");
      router.push("/departments");
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
      <div className="mx-auto w-full max-w-[1380px] flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/departments")}
            className="p-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10 hover:text-foreground dark:hover:text-white transition-all shadow-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Create New Department</h2>
            <p className="text-zinc-400 text-sm">Organize your team and resources within a business unit.</p>
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
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Department Name</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Engineering, Sales"
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all shadow-inner"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Company</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                    <select 
                      required
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-[#111216] pl-12 pr-10 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all shadow-inner appearance-none"
                      value={form.companyId}
                      onChange={(e) => setForm({ ...form, companyId: e.target.value })}
                    >
                      <option value="" className="bg-white dark:bg-[#111216]">Select company</option>
                      {companies.map(c => <option key={c.id} value={c.id} className="bg-white dark:bg-[#111216]">{c.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Location</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-500" />
                      <select 
                        className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-[#111216] pl-12 pr-10 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 transition-all shadow-inner appearance-none"
                        value={form.locationId}
                        onChange={(e) => setForm({ ...form, locationId: e.target.value })}
                      >
                        <option value="" className="bg-white dark:bg-[#111216]">Select location</option>
                        {locations.map(l => <option key={l.id} value={l.id} className="bg-white dark:bg-[#111216]">{l.name}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setQuickCreateLocationOpen(true)}
                      className="flex items-center justify-center p-3.5 rounded-2xl bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600/20 transition-all shadow-lg active:scale-95"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Department Manager</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-500" />
                      <select 
                        className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-[#111216] pl-12 pr-10 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all shadow-inner appearance-none"
                        value={form.managerId}
                        onChange={(e) => setForm({ ...form, managerId: e.target.value })}
                      >
                        <option value="" className="bg-white dark:bg-[#111216]">Select manager</option>
                        {managers.map(m => (
                          <option key={m.id} value={m.id} className="bg-white dark:bg-[#111216]">
                            {m.firstName || m.username || m.email} {m.lastName || ""}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setQuickCreateUserOpen(true)}
                      className="flex items-center justify-center p-3.5 rounded-2xl bg-orange-600/10 text-orange-400 border border-orange-500/20 hover:bg-orange-600/20 transition-all shadow-lg active:scale-95"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input 
                      type="tel" 
                      placeholder="Direct phone line"
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all shadow-inner"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Notes</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 h-4 w-4 text-zinc-500" />
                    <textarea 
                      rows={4}
                      placeholder="Additional information about the department..."
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all shadow-inner resize-none"
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    ></textarea>
                  </div>
                </div>

                <ImageUpload 
                  value={form.image} 
                  onChange={(val) => setForm({...form, image: val})} 
                  label="Department Image" 
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-2">
            <button 
              type="button"
              onClick={() => router.push("/departments")}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-sm font-bold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10 hover:text-foreground dark:hover:text-white transition-all shadow-lg active:scale-95"
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
              <span>{loading ? 'Processing...' : 'Save Department'}</span>
            </button>
          </div>
        </form>

        <QuickCreateLocationModal 
          open={quickCreateLocationOpen}
          onClose={() => setQuickCreateLocationOpen(false)}
          companies={companies}
          onSuccess={(newLoc) => {
            setLocations(prev => [newLoc, ...prev]);
            setForm(prev => ({ ...prev, locationId: newLoc.id.toString() }));
          }}
        />

        <QuickCreateUserModal 
          open={quickCreateUserOpen}
          onClose={() => setQuickCreateUserOpen(false)}
          companies={companies}
          locations={locations}
          onSuccess={(newUser) => {
            setManagers(prev => [newUser, ...prev]);
            setForm(prev => ({ ...prev, managerId: newUser.id.toString() }));
          }}
        />
      </div>
    </main>
  );
}
