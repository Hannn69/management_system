"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { QuickCreateLocationModal } from "@/components/dashboard/QuickCreateLocationModal";
import { QuickCreateUserModal } from "@/components/dashboard/QuickCreateUserModal";
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Save, 
  X, 
  Building2, 
  Barcode, 
  Cpu, 
  Box, 
  Info, 
  User, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Truck, 
  DollarSign,
  FileText,
  MousePointer2,
  Tag,
  History,
  Coins
} from "lucide-react";

interface UpdateAssetContentProps {
  id: string; // This is the slug or ID from the URL
}

export function UpdateAssetContent({ id }: UpdateAssetContentProps) {
  const router = useRouter();
  const { push } = useToast();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  
  const [isOptionalOpen, setIsOptionalOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [quickCreateUserOpen, setQuickCreateUserOpen] = useState(false);
  const [afterSaveAction, setAfterSaveAction] = useState("all-assets");
  const [error, setError] = useState<string | null>(null);

  // Currency State
  const [activeCurrency, setActiveCurrency] = useState("USD");
  const [currencySymbol, setCurrencySymbol] = useState("$");

  // Dropdown data
  const [companies, setCompanies] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [form, setForm] = useState({
    companyId: "",
    assetTag: "",
    serial: "",
    modelId: "",
    statusId: "",
    checkedOutUserId: "",
    notes: "",
    locationId: "",
    isRequestable: false,
    image: null as string | null,
    // Optional
    name: "",
    warrantyMonths: "",
    expectedCheckin: "",
    nextAuditDate: "",
    isByod: false,
    // Order Related
    orderNumber: "",
    purchaseDate: "",
    eolDate: "",
    supplierId: "",
    purchaseCost: "",
  });

  const fetchData = useCallback(async () => {
    try {
      const fetchOpts = { credentials: "include" as const };
      const [compRes, modRes, statRes, locRes, supRes, assetRes] = await Promise.all([
        fetch(`${apiBase}/companies`, fetchOpts),
        fetch(`${apiBase}/asset-models`, fetchOpts),
        fetch(`${apiBase}/status-labels`, fetchOpts),
        fetch(`${apiBase}/locations`, fetchOpts),
        fetch(`${apiBase}/suppliers`, fetchOpts),
        fetch(`${apiBase}/assets/${id}`, fetchOpts), // Fetch current asset
      ]);

      if (compRes.ok) setCompanies((await compRes.json()).records || []);
      if (modRes.ok) setModels((await modRes.json()).records || []);
      if (statRes.ok) setStatuses((await statRes.json()).records || []);
      if (locRes.ok) setLocations((await locRes.json()).records || []);
      if (supRes.ok) setSuppliers((await supRes.json()).records || []);
      
      if (assetRes.ok) {
        const { record } = await assetRes.json();
        setForm({
          companyId: record.companyId?.toString() || "",
          assetTag: record.assetTag || "",
          serial: record.serial || "",
          modelId: record.modelId?.toString() || "",
          statusId: record.statusId?.toString() || "",
          checkedOutUserId: record.checkedOutUserId?.toString() || "",
          notes: record.notes || "",
          locationId: record.locationId?.toString() || "",
          isRequestable: record.isRequestable || false,
          image: record.image || null,
          name: record.name || "",
          warrantyMonths: record.warrantyMonths?.toString() || "",
          expectedCheckin: record.expectedCheckin ? record.expectedCheckin.split("T")[0] : "",
          nextAuditDate: record.nextAuditDate ? record.nextAuditDate.split("T")[0] : "",
          isByod: record.isByod || false,
          orderNumber: record.orderNumber || "",
          purchaseDate: record.purchaseDate ? record.purchaseDate.split("T")[0] : "",
          eolDate: record.eolDate ? record.eolDate.split("T")[0] : "",
          supplierId: record.supplierId?.toString() || "",
          purchaseCost: record.purchaseCost?.toString() || "",
        });
      }

      setUsers([
        { id: 1, email: "admin@example.com" },
        { id: 4, email: "sonvirak@example.com" }
      ]);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setFetching(false);
    }
  }, [apiBase, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Currency Change & Conversion
  const handleCurrencyChange = (newCurrency: string) => {
    if (newCurrency === activeCurrency) return;

    const currentCost = parseFloat(form.purchaseCost);
    if (!isNaN(currentCost)) {
      let convertedCost = currentCost;
      if (activeCurrency === "USD" && newCurrency === "KHR") {
        convertedCost = currentCost * 4000;
      } else if (activeCurrency === "KHR" && newCurrency === "USD") {
        convertedCost = currentCost / 4000;
      }
      setForm(prev => ({ ...prev, purchaseCost: convertedCost.toFixed(2) }));
    }

    setActiveCurrency(newCurrency);
    setCurrencySymbol(newCurrency === "USD" ? "$" : "៛");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const costValue = parseFloat(form.purchaseCost);
      let finalCost = isNaN(costValue) ? undefined : costValue;
      
      const payload = {
        ...form,
        companyId: form.companyId ? Number(form.companyId) : null,
        modelId: Number(form.modelId),
        statusId: Number(form.statusId),
        locationId: form.locationId ? Number(form.locationId) : null,
        supplierId: form.supplierId ? Number(form.supplierId) : null,
        checkedOutUserId: form.checkedOutUserId ? Number(form.checkedOutUserId) : null,
        warrantyMonths: form.warrantyMonths ? Number(form.warrantyMonths) : null,
        purchaseCost: finalCost,
        purchaseDate: form.purchaseDate ? new Date(form.purchaseDate).toISOString() : null,
        expectedCheckin: form.expectedCheckin ? new Date(form.expectedCheckin).toISOString() : null,
        nextAuditDate: form.nextAuditDate ? new Date(form.nextAuditDate).toISOString() : null,
        eolDate: form.eolDate ? new Date(form.eolDate).toISOString() : null,
      };

      const res = await fetch(`${apiBase}/assets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update asset");
      }

      push("Asset updated successfully!", "success");

      // Handle navigation based on selection
      if (afterSaveAction === "all-assets") router.push("/assets");
      else if (afterSaveAction === "previous") router.back();
      else if (afterSaveAction === "view-asset") router.push(`/assets/${id}/edit`);
      else router.push("/assets"); 

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="px-6 pb-12 pt-5">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-8 flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6e8a99]">Inventory</p>
          <h2 className="text-3xl font-bold text-foreground">Update Asset</h2>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-sm text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="rounded-3xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#111216] p-8 shadow-2xl">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Building2 className="h-3 w-3" /> Company
                </label>
                <select 
                  className="rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-4 py-3 text-sm text-foreground focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  value={form.companyId}
                  onChange={(e) => setForm({...form, companyId: e.target.value})}
                >
                  <option value="" className="bg-white dark:bg-[#111216]">Select Company</option>
                  {companies.map(c => <option key={c.id} value={c.id} className="bg-white dark:bg-[#111216]">{c.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Barcode className="h-3 w-3" /> Asset Tag
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="AST-00001"
                    className="flex-1 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    value={form.assetTag}
                    onChange={(e) => setForm({...form, assetTag: e.target.value})}
                  />
                  <button 
                    type="button" 
                    onClick={() => setForm({...form, assetTag: `AST-${Date.now().toString().slice(-6)}`})}
                    className="flex items-center justify-center rounded-xl bg-cyan-600 px-4 text-white hover:bg-cyan-500 transition-colors shadow-lg active:scale-95"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Cpu className="h-3 w-3" /> Serial
                </label>
                <input 
                  type="text" 
                  placeholder="Enter serial number"
                  className="rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  value={form.serial}
                  onChange={(e) => setForm({...form, serial: e.target.value})}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Box className="h-3 w-3" /> Model
                </label>
                <div className="flex gap-2">
                  <select 
                    className="flex-1 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-4 py-3 text-sm text-foreground focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    value={form.modelId}
                    onChange={(e) => setForm({...form, modelId: e.target.value})}
                  >
                    <option value="" className="bg-white dark:bg-[#111216]">Select Model</option>
                    {models.map(m => <option key={m.id} value={m.id} className="bg-white dark:bg-[#111216]">{m.name}</option>)}
                  </select>
                  <button type="button" onClick={() => router.push("/asset-models/create?returnTo=" + window.location.pathname)} className="flex items-center gap-2 rounded-xl bg-emerald-600/10 px-4 text-xs font-bold text-emerald-400 hover:bg-emerald-600/20 border border-emerald-500/20 transition-all active:scale-95">
                    NEW
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <ShieldCheck className="h-3 w-3" /> Status
                </label>
                <div className="flex gap-2">
                  <select 
                    className="flex-1 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-4 py-3 text-sm text-foreground focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    value={form.statusId}
                    onChange={(e) => setForm({...form, statusId: e.target.value})}
                  >
                    <option value="" className="bg-white dark:bg-[#111216]">Select Status</option>
                    {statuses.map(s => <option key={s.id} value={s.id} className="bg-white dark:bg-[#111216]">{s.name}</option>)}
                  </select>
                  <button 
                    type="button" 
                    onClick={() => router.push("/status-labels/create?returnTo=" + window.location.pathname)}
                    className="flex items-center gap-2 rounded-xl bg-emerald-600/10 px-4 text-xs font-bold text-emerald-400 hover:bg-emerald-600/20 border border-emerald-500/20 transition-all active:scale-95"
                  >
                    NEW
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <User className="h-3 w-3" /> Checkout to
                </label>
                <div className="flex gap-2">
                  <select 
                    className="flex-1 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-4 py-3 text-sm text-foreground focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    value={form.checkedOutUserId}
                    onChange={(e) => setForm({...form, checkedOutUserId: e.target.value})}
                  >
                    <option value="" className="bg-white dark:bg-[#111216]">Select User</option>
                    {users.map(u => <option key={u.id} value={u.id} className="bg-white dark:bg-[#111216]">{u.email}</option>)}
                  </select>
                  <button 
                    type="button" 
                    onClick={() => setQuickCreateUserOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-emerald-600/10 px-4 text-xs font-bold text-emerald-400 hover:bg-emerald-600/20 border border-emerald-500/20 transition-all active:scale-95"
                  >
                    NEW
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <MapPin className="h-3 w-3" /> Default Location
                </label>
                <div className="flex gap-2">
                  <select 
                    className="flex-1 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-4 py-3 text-sm text-foreground focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    value={form.locationId}
                    onChange={(e) => setForm({...form, locationId: e.target.value})}
                  >
                    <option value="" className="bg-white dark:bg-[#111216]">Select Location</option>
                    {locations.map(l => <option key={l.id} value={l.id} className="bg-white dark:bg-[#111216]">{l.name}</option>)}
                  </select>
                  <button type="button" onClick={() => router.push("/locations/create?returnTo=" + window.location.pathname)} className="flex items-center gap-2 rounded-xl bg-emerald-600/10 px-4 text-xs font-bold text-emerald-400 hover:bg-emerald-600/20 border border-emerald-500/20 transition-all active:scale-95">
                    NEW
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input 
                  type="checkbox" 
                  id="requestable"
                  className="h-5 w-5 rounded-lg border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-cyan-600 focus:ring-cyan-500/50"
                  checked={form.isRequestable}
                  onChange={(e) => setForm({...form, isRequestable: e.target.checked})}
                />
                <label htmlFor="requestable" className="text-sm font-medium text-zinc-500 dark:text-zinc-300 cursor-pointer">
                  Requestable
                </label>
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <FileText className="h-3 w-3" /> Notes
                </label>
                <textarea 
                  rows={3}
                  placeholder="Enter any additional notes..."
                  className="rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all resize-none"
                  value={form.notes}
                  onChange={(e) => setForm({...form, notes: e.target.value})}
                />
              </div>

              <ImageUpload 
                value={form.image} 
                onChange={(val) => setForm({...form, image: val})} 
                className="md:col-span-2"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#111216] overflow-hidden">
            <button 
              type="button"
              onClick={() => setIsOptionalOpen(!isOptionalOpen)}
              className="flex w-full items-center justify-between px-8 py-5 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Info className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold uppercase tracking-wider text-foreground">Optional Information</span>
              </div>
              {isOptionalOpen ? <ChevronDown className="h-5 w-5 text-zinc-500" /> : <ChevronRight className="h-5 w-5 text-zinc-500" />}
            </button>
            
            {isOptionalOpen && (
              <div className="px-8 pb-8 pt-2 grid gap-6 md:grid-cols-2 border-t border-zinc-200 dark:border-white/5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <Tag className="h-3 w-3" /> Asset Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter unique name"
                    className="rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <History className="h-3 w-3" /> Warranty (months)
                  </label>
                  <input 
                    type="number" 
                    placeholder="e.g. 12"
                    className="rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    value={form.warrantyMonths}
                    onChange={(e) => setForm({...form, warrantyMonths: e.target.value})}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <Calendar className="h-3 w-3" /> Expected Checkin Date
                  </label>
                  <input 
                    type="date" 
                    className="rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-4 py-3 text-sm text-foreground focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all [color-scheme:light] dark:[color-scheme:dark]"
                    value={form.expectedCheckin}
                    onChange={(e) => setForm({...form, expectedCheckin: e.target.value})}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <Calendar className="h-3 w-3" /> Next Audit Date
                  </label>
                  <input 
                    type="date" 
                    className="rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-4 py-3 text-sm text-foreground focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all [color-scheme:light] dark:[color-scheme:dark]"
                    value={form.nextAuditDate}
                    onChange={(e) => setForm({...form, nextAuditDate: e.target.value})}
                  />
                </div>

                <div className="flex flex-col gap-1 pt-2 md:col-span-2">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="byod"
                      className="h-5 w-5 rounded-lg border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-cyan-600 focus:ring-cyan-500/50"
                      checked={form.isByod}
                      onChange={(e) => setForm({...form, isByod: e.target.checked})}
                    />
                    <label htmlFor="byod" className="text-sm font-medium text-zinc-500 dark:text-zinc-300 cursor-pointer">
                      BYOD
                    </label>
                  </div>
                  <p className="ml-8 text-[11px] text-zinc-500">This device is owned by the user</p>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#111216] overflow-hidden">
            <button 
              type="button"
              onClick={() => setIsOrderOpen(!isOrderOpen)}
              className="flex w-full items-center justify-between px-8 py-5 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  <Truck className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold uppercase tracking-wider text-foreground">Order Related Information</span>
              </div>
              {isOrderOpen ? <ChevronDown className="h-5 w-5 text-zinc-500" /> : <ChevronRight className="h-5 w-5 text-zinc-500" />}
            </button>
            
            {isOrderOpen && (
              <div className="px-8 pb-8 pt-2 grid gap-6 md:grid-cols-2 border-t border-zinc-200 dark:border-white/5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <Barcode className="h-3 w-3" /> Order Number
                  </label>
                  <input 
                    type="text" 
                    placeholder="PO-12345"
                    className="rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    value={form.orderNumber}
                    onChange={(e) => setForm({...form, orderNumber: e.target.value})}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <Calendar className="h-3 w-3" /> Purchase Date
                  </label>
                  <input 
                    type="date" 
                    className="rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-4 py-3 text-sm text-foreground focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all [color-scheme:light] dark:[color-scheme:dark]"
                    value={form.purchaseDate}
                    onChange={(e) => setForm({...form, purchaseDate: e.target.value})}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <Calendar className="h-3 w-3" /> EOL Date
                  </label>
                  <input 
                    type="date" 
                    className="rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-4 py-3 text-sm text-foreground focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all [color-scheme:light] dark:[color-scheme:dark]"
                    value={form.eolDate}
                    onChange={(e) => setForm({...form, eolDate: e.target.value})}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <Truck className="h-3 w-3" /> Supplier
                  </label>
                  <div className="flex gap-2">
                    <select 
                      className="flex-1 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-4 py-3 text-sm text-foreground focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                      value={form.supplierId}
                      onChange={(e) => setForm({...form, supplierId: e.target.value})}
                    >
                      <option value="" className="bg-white dark:bg-[#111216]">Select Supplier</option>
                      {suppliers.map(s => <option key={s.id} value={s.id} className="bg-white dark:bg-[#111216]">{s.name}</option>)}
                    </select>
                    <button type="button" onClick={() => router.push("/suppliers/create?returnTo=" + window.location.pathname)} className="flex items-center gap-2 rounded-xl bg-emerald-600/10 px-4 text-xs font-bold text-emerald-400 hover:bg-emerald-600/20 border border-emerald-500/20 transition-all active:scale-95">
                      NEW
                    </button>

                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <DollarSign className="h-3 w-3" /> Purchase Cost
                  </label>
                  <div className="flex flex-col gap-3">
                    <div className="relative">
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                      <Coins className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500/50" />
                      <select 
                        className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-[#111216] pl-12 pr-10 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all shadow-inner appearance-none"
                        value={activeCurrency}
                        onChange={(e) => handleCurrencyChange(e.target.value)}
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="KHR">KHR - Cambodian Riel</option>
                      </select>
                    </div>

                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 font-bold text-lg">{currencySymbol}</span>
                      <input 
                        type="number" 
                        step="0.01"
                        placeholder={activeCurrency}
                        className="w-full rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-10 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                        value={form.purchaseCost}
                        onChange={(e) => setForm({...form, purchaseCost: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6 items-end mt-4">
            <div className="flex flex-col gap-2 w-full md:w-64">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                <MousePointer2 className="h-3 w-3" /> After Saving
              </label>
              <select 
                className="rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                value={afterSaveAction}
                onChange={(e) => setAfterSaveAction(e.target.value)}
              >
                <option value="previous" className="bg-white dark:bg-[#111216]">Go to previous page</option>
                <option value="all-assets" className="bg-white dark:bg-[#111216]">Return to all assets</option>
                <option value="view-asset" className="bg-white dark:bg-[#111216]">Go to Asset</option>
                <option value="view-model" className="bg-white dark:bg-[#111216]">Go to Asset Model</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={() => router.back()}
                className="flex items-center gap-2 rounded-2xl bg-zinc-100 dark:bg-white/5 px-8 py-3 text-sm font-bold text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-white/10 hover:bg-zinc-200 dark:hover:bg-white/10 transition-all active:scale-95"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-2xl bg-cyan-600 px-10 py-3 text-sm font-bold text-white shadow-[0_20px_40px_-10px_rgba(8,145,178,0.3)] hover:bg-cyan-500 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Update Asset
              </button>
            </div>
          </div>
        </form>

        <QuickCreateUserModal 
          open={quickCreateUserOpen}
          onClose={() => setQuickCreateUserOpen(false)}
          companies={companies}
          locations={locations}
          onSuccess={(newUser: any) => {
            setUsers(prev => [newUser, ...prev]);
            setForm(prev => ({ ...prev, checkedOutUserId: newUser.id.toString() }));
          }}
        />
      </div>
    </main>
  );
}
