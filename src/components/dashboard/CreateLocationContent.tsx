"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { QuickCreateLocationModal } from "@/components/dashboard/QuickCreateLocationModal";
import { QuickCreateUserModal } from "@/components/dashboard/QuickCreateUserModal";
import { 
  MapPin, 
  ChevronDown, 
  Building2, 
  User, 
  Phone, 
  Printer, 
  Coins, 
  Home, 
  Globe2, 
  Milestone, 
  FileText, 
  X, 
  Save, 
  ArrowLeft,
  Plus
} from "lucide-react";

export function CreateLocationContent() {
  const router = useRouter();
  const { push } = useToast();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [quickCreateUserOpen, setQuickCreateUserOpen] = useState(false);

  const [companies, setCompanies] = useState<any[]>([]);
  const [parentLocations, setParentLocations] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);

  // Currency & Conversion Logic
  const [activeCurrency, setActiveCurrency] = useState("USD"); // Internal baseline
  const [currencyPlaceholder, setCurrencyPlaceholder] = useState("e.g. KHR");
  const [currencySymbol, setCurrencySymbol] = useState("");

  const [form, setForm] = useState({
    name: "",
    parentId: "",
    managerId: "",
    companyId: "",
    phone: "",
    currency: "", 
    address: "",
    address2: "",
    city: "",
    state: "", // Province
    country: "Cambodia",
    zip: "",
    notes: "",
    image: null as string | null,
  });

  const fetchData = useCallback(async () => {
    try {
      const fetchOpts = { credentials: "include" as const };
      const [compRes, locRes, userRes] = await Promise.all([
        fetch(`${apiBase}/companies`, fetchOpts),
        fetch(`${apiBase}/locations`, fetchOpts),
        fetch(`${apiBase}/auth/users`, fetchOpts),
      ]);

      if (compRes.ok) setCompanies((await compRes.json()).records || []);
      if (locRes.ok) setParentLocations((await locRes.json()).records || []);
      if (userRes.ok) setManagers((await userRes.json()).records || []);
    } catch (err) {
      console.error("Failed to fetch dropdown data", err);
    }
  }, [apiBase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCurrencySelection = (newCurrency: string) => {
    if (!newCurrency) return;
    
    const currentVal = parseFloat(form.currency);
    
    // 1. Perform Conversion if numeric value is present
    if (!isNaN(currentVal)) {
      let converted = currentVal;
      if (activeCurrency === "USD" && newCurrency === "KHR") {
        converted = currentVal * 4000;
      } else if (activeCurrency === "KHR" && newCurrency === "USD") {
        converted = currentVal / 4000;
      }
      // Round to 2 decimal places if USD, or whole number if KHR
      const finalVal = newCurrency === "KHR" ? Math.round(converted).toString() : converted.toFixed(2);
      setForm(prev => ({ ...prev, currency: finalVal }));
    } else {
      // If empty, just clear to show placeholder as requested ("dont fill")
      setForm(prev => ({ ...prev, currency: "" }));
    }

    // 2. Update UI Indicators
    setCurrencyPlaceholder(newCurrency);
    setCurrencySymbol(newCurrency === "USD" ? "$" : "៛");
    setActiveCurrency(newCurrency);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const finalCurrency = form.currency || (currencyPlaceholder !== "e.g. KHR" ? currencyPlaceholder : "");
      
      const payload = {
        ...form,
        currency: finalCurrency,
        companyId: form.companyId ? Number(form.companyId) : undefined,
        parentId: form.parentId ? Number(form.parentId) : undefined,
        managerId: form.managerId ? Number(form.managerId) : undefined,
      };

      const res = await fetch(`${apiBase}/locations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create location");
      }

      push("Location created successfully!", "success");
      router.push("/locations");
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
            onClick={() => router.push("/locations")}
            className="p-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10 hover:text-foreground transition-all shadow-lg active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Create New Location</h2>
            <p className="text-zinc-400 text-sm">Define a physical or logical site for your inventory management.</p>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-sm text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 pb-12">
          <div className="rounded-[28px] border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#111216] p-8 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Location Name</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Headquarters"
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all shadow-inner"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Parent Location</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500/50" />
                      <select 
                        className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-[#111216] pl-12 pr-10 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all shadow-inner appearance-none"
                        value={form.parentId}
                        onChange={(e) => setForm({ ...form, parentId: e.target.value })}
                      >
                        <option value="" className="bg-white dark:bg-[#111216]">Select Parent Location</option>
                        {parentLocations.map(l => <option key={l.id} value={l.id} className="bg-white dark:bg-[#111216]">{l.name}</option>)}
                      </select>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setQuickCreateOpen(true)}
                      className="flex items-center justify-center p-3.5 rounded-2xl bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600/20 transition-all shadow-lg active:scale-95"
                      title="New Location"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Manager</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-500" />
                      <select 
                        className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-[#111216] pl-12 pr-10 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all shadow-inner appearance-none"
                        value={form.managerId}
                        onChange={(e) => setForm({ ...form, managerId: e.target.value })}
                      >
                        <option value="" className="bg-white dark:bg-[#111216]">Select Manager</option>
                        {managers.map(m => (
                          <option key={m.id} value={m.id} className="bg-white dark:bg-[#111216]">
                            {m.firstName || m.username || m.email} {m.lastName || ""}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setQuickCreateUserOpen(true)}
                      className="flex items-center justify-center p-3.5 rounded-2xl bg-orange-600/10 text-orange-400 border border-orange-500/20 hover:bg-orange-600/20 transition-all shadow-lg active:scale-95"
                      title="New Manager"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Company</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                    <select 
                      required
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-[#111216] pl-12 pr-4 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all shadow-inner appearance-none"
                      value={form.companyId}
                      onChange={(e) => setForm({ ...form, companyId: e.target.value })}
                    >
                      <option value="" className="bg-white dark:bg-[#111216]">Select Company</option>
                      {companies.map(c => <option key={c.id} value={c.id} className="bg-white dark:bg-[#111216]">{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500" />
                    <input 
                      type="tel" 
                      placeholder="Site phone"
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all shadow-inner"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Currency</label>
                  <div className="space-y-3">
                    <div className="relative">
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                      <Coins className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500/50" />
                      <select 
                        className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-[#111216] pl-12 pr-10 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all shadow-inner appearance-none"
                        value={activeCurrency}
                        onChange={(e) => handleCurrencySelection(e.target.value)}
                      >
                        <option value="">Quick Select Suggestions...</option>
                        <option value="KHR">KHR - Cambodian Riel</option>
                        <option value="USD">USD - US Dollar</option>
                      </select>
                    </div>

                    <div className="relative">
                      <Coins className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500" />
                      <input 
                        type="text" 
                        placeholder={currencyPlaceholder}
                        className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-12 py-3.5 text-sm text-foreground placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all shadow-inner"
                        value={form.currency}
                        onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })}
                      />
                      {currencySymbol && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-bold text-amber-500 pointer-events-none animate-in fade-in zoom-in duration-300">
                          {currencySymbol}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Address</label>
                  <div className="space-y-3">
                    <div className="relative">
                      <Home className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-500" />
                      <input 
                        type="text" 
                        placeholder="Address Line 1"
                        className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 transition-all shadow-inner"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 border border-rose-500/30 rounded-full flex items-center justify-center">
                        <div className="h-1 w-1 bg-rose-500/30 rounded-full" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Address Line 2"
                        className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 transition-all shadow-inner"
                        value={form.address2}
                        onChange={(e) => setForm({ ...form, address2: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">City</label>
                    <div className="relative">
                      <Globe2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-500" />
                      <input 
                        type="text" 
                        placeholder="e.g. Phnom Penh"
                        className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all shadow-inner"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Province</label>
                    <div className="relative">
                      <Milestone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                      <input 
                        type="text" 
                        placeholder="Province"
                        className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all shadow-inner"
                        value={form.state}
                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Country</label>
                  <div className="relative">
                    <Globe2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-500" />
                    <input 
                      type="text" 
                      placeholder="e.g. Cambodia"
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all shadow-inner"
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Internal Notes</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 h-4 w-4 text-zinc-500" />
                    <textarea 
                      placeholder="Any additional information..."
                      rows={3}
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 focus:border-zinc-500/50 transition-all shadow-inner resize-none"
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Location Image</label>
                  <ImageUpload 
                    value={form.image}
                    onChange={(url) => setForm({ ...form, image: url })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-2">
            <button 
              type="button"
              onClick={() => router.push("/locations")}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-sm font-bold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10 hover:text-foreground transition-all shadow-lg active:scale-90"
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
              <span>{loading ? 'Processing...' : 'Save Location'}</span>
            </button>
          </div>
        </form>

        <QuickCreateLocationModal 
          open={quickCreateOpen}
          onClose={() => setQuickCreateOpen(false)}
          companies={companies}
          onSuccess={(newLoc) => {
            setParentLocations(prev => [newLoc, ...prev]);
            setForm(prev => ({ ...prev, parentId: newLoc.id.toString() }));
          }}
        />

        <QuickCreateUserModal 
          open={quickCreateUserOpen}
          onClose={() => setQuickCreateUserOpen(false)}
          companies={companies}
          locations={parentLocations}
          onSuccess={(newUser) => {
            setManagers(prev => [newUser, ...prev]);
            setForm(prev => ({ ...prev, managerId: newUser.id.toString() }));
          }}
        />
      </div>
    </main>
  );
}
