"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  MapPin, 
  ChevronDown, 
  Plus, 
  Building2, 
  User, 
  Phone, 
  Printer, 
  Coins, 
  Home, 
  Globe2, 
  FileText, 
  Upload, 
  X, 
  Save, 
  ArrowLeft 
} from "lucide-react";

interface UpdateLocationContentProps {
  id: string; // This is the slug
}

export function UpdateLocationContent({ id }: UpdateLocationContentProps) {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [companies, setCompanies] = useState<any[]>([]);
  const [parentLocations, setParentLocations] = useState<any[]>([]);

  const [form, setForm] = useState({
    name: "",
    companyId: "",
    parentId: "",
    managerId: "",
    phone: "",
    fax: "",
    currency: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    notes: "",
  });

  const fetchData = useCallback(async () => {
    try {
      const fetchOpts = { credentials: "include" as const };
      const [compRes, locsRes, currentLocRes] = await Promise.all([
        fetch(`${apiBase}/companies`, fetchOpts),
        fetch(`${apiBase}/locations`, fetchOpts),
        fetch(`${apiBase}/locations/${id}`, fetchOpts),
      ]);

      if (compRes.ok) setCompanies((await compRes.json()).records || []);
      if (locsRes.ok) setParentLocations((await locsRes.json()).records || []);
      
      if (currentLocRes.ok) {
        const { record } = await currentLocRes.json();
        setForm({
          name: record.name || "",
          companyId: record.companyId?.toString() || "",
          parentId: record.parentId?.toString() || "",
          managerId: record.managerId?.toString() || "",
          phone: record.phone || "",
          fax: record.fax || "",
          currency: record.currency || "",
          address: record.address || "",
          address2: record.address2 || "",
          city: record.city || "",
          state: record.state || "",
          country: record.country || "",
          zip: record.zip || "",
          notes: record.notes || "",
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
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...form,
        companyId: form.companyId ? Number(form.companyId) : null,
        parentId: form.parentId ? Number(form.parentId) : null,
        managerId: form.managerId ? Number(form.managerId) : null,
      };

      const res = await fetch(`${apiBase}/locations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update location");
      }

      router.push("/locations");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
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
            onClick={() => router.push("/locations")}
            className="p-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10 hover:text-foreground transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Update Location</h2>
            <p className="text-zinc-400 text-sm">Modify existing location details for {form.name}.</p>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-sm text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-[28px] border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#111216] p-8 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Location Name</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                    <input 
                      required 
                      type="text" 
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Headquarters, North Warehouse" 
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Parent Location</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <select 
                          name="parentId"
                          value={form.parentId}
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-[#1a1b1e] pl-4 pr-10 py-3.5 text-sm text-foreground appearance-none focus:outline-none"
                        >
                          <option value="" className="bg-white dark:bg-[#111216]">No Parent</option>
                          {parentLocations.map(l => <option key={l.id} value={l.id} className="bg-white dark:bg-[#111216]">{l.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                      </div>
                      <button type="button" onClick={() => router.push("/locations/create")} className="p-3.5 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-emerald-500 hover:bg-emerald-500/10 transition-all">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Manager</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <select 
                          name="managerId"
                          value={form.managerId}
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-[#1a1b1e] pl-12 pr-10 py-3.5 text-sm text-foreground appearance-none focus:outline-none"
                        >
                          <option value="" className="bg-white dark:bg-[#111216]">Select Manager</option>
                          <option value="1" className="bg-white dark:bg-[#111216]">Admin User</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                      </div>
                      <button type="button" className="p-3.5 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-emerald-500 hover:bg-emerald-500/10 transition-all">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Company</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500" />
                    <select 
                      name="companyId"
                      value={form.companyId}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-[#1a1b1e] pl-12 pr-10 py-3.5 text-sm text-foreground appearance-none focus:outline-none"
                    >
                      <option value="" className="bg-white dark:bg-[#111216]">Select Company</option>
                      {companies.map(c => <option key={c.id} value={c.id} className="bg-white dark:bg-[#111216]">{c.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-500" />
                      <input 
                        type="tel" 
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+1..." 
                        className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Fax</label>
                    <div className="relative">
                      <Printer className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                      <input 
                        type="tel" 
                        name="fax"
                        value={form.fax}
                        onChange={handleChange}
                        placeholder="Fax..." 
                        className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Location Currency</label>
                  <div className="relative">
                    <Coins className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500" />
                    <input 
                      type="text" 
                      name="currency"
                      value={form.currency}
                      onChange={handleChange}
                      placeholder="USD, EUR, GBP..." 
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Address</label>
                  <div className="space-y-3 p-4 rounded-2xl border-2 border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-white/[0.02]">
                    <div className="relative">
                      <Home className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                      <input 
                        type="text" 
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Street Address 1" 
                        className="w-full rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-2.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-all" 
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 border border-zinc-600 rounded-sm" />
                      <input 
                        type="text" 
                        name="address2"
                        value={form.address2}
                        onChange={handleChange}
                        placeholder="Street Address 2 / Suite / Floor" 
                        className="w-full rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-2.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-all" 
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">City</label>
                    <input 
                      type="text" 
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="City" 
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">State / Province</label>
                    <input 
                      type="text" 
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="State" 
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Country</label>
                    <input 
                      type="text" 
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      placeholder="Country"
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Zip / Postal Code</label>
                    <input 
                      type="text" 
                      name="zip"
                      value={form.zip}
                      onChange={handleChange}
                      placeholder="Zip" 
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Upload Image</label>
                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5">
                    <div className="h-12 w-12 rounded-xl bg-zinc-200 dark:bg-white/5 flex items-center justify-center border border-zinc-200 dark:border-white/10 overflow-hidden">
                      <Upload className="h-5 w-5 text-zinc-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-zinc-400 mb-2 font-medium">Update location photo...</p>
                      <button type="button" className="px-4 py-1.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-[11px] font-bold text-zinc-500 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-white/10 transition-all">
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
                <textarea 
                  rows={3} 
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Additional location notes or instructions..." 
                  className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none resize-none shadow-inner" 
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-2">
            <button 
              type="button"
              onClick={() => router.push("/locations")}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-sm font-bold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10 hover:text-foreground transition-all shadow-lg active:scale-95"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-sm font-bold text-white shadow-[0_15px_35px_-10px_rgba(16,185,129,0.5)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? (
                 <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{loading ? 'Updating...' : 'Update Location'}</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
