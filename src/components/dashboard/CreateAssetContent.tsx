"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Upload, 
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
  History
} from "lucide-react";

export function CreateAssetContent() {
  const router = useRouter();
  const [isOptionalOpen, setIsOptionalOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [afterSaveAction, setAfterSaveAction] = useState("all-assets");

  const [form, setForm] = useState({
    company: "",
    assetTag: "",
    serial: "",
    modelId: "",
    statusId: "",
    checkedOutTo: "",
    notes: "",
    locationId: "",
    requestable: false,
    image: null as File | null,
    // Optional
    assetName: "",
    warranty: "",
    expectedCheckin: "",
    nextAudit: "",
    byod: false,
    // Order Related
    orderNumber: "",
    purchaseDate: "",
    eolDate: "",
    supplierId: "",
    purchaseCost: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Saving asset:", form);
      
      // Handle navigation based on selection
      if (afterSaveAction === "all-assets") router.push("/assets");
      else if (afterSaveAction === "previous") router.back();
      // "Go to Asset" or "Go to Asset Model" would ideally use the new ID
      else router.push("/assets"); 

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="px-6 pb-12 pt-5">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-8 flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6e8a99]">Inventory</p>
          <h2 className="text-3xl font-bold text-white">Create Asset</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Main Section */}
          <div className="rounded-3xl border border-white/10 bg-[#111216] p-8 shadow-2xl">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Company */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Building2 className="h-3 w-3" /> Company
                </label>
                <select 
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  value={form.company}
                  onChange={(e) => setForm({...form, company: e.target.value})}
                >
                  <option value="" className="bg-[#111216]">Select Company</option>
                  <option value="1" className="bg-[#111216]">Tech Corp</option>
                  <option value="2" className="bg-[#111216]">Global Solutions</option>
                </select>
              </div>

              {/* Asset Tag */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Barcode className="h-3 w-3" /> Asset Tag
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="AST-00001"
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    value={form.assetTag}
                    onChange={(e) => setForm({...form, assetTag: e.target.value})}
                  />
                  <button type="button" className="flex items-center justify-center rounded-xl bg-cyan-600 px-4 text-white hover:bg-cyan-500 transition-colors shadow-lg active:scale-95">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Serial */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Cpu className="h-3 w-3" /> Serial
                </label>
                <input 
                  type="text" 
                  placeholder="Enter serial number"
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  value={form.serial}
                  onChange={(e) => setForm({...form, serial: e.target.value})}
                />
              </div>

              {/* Model */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Box className="h-3 w-3" /> Model
                </label>
                <div className="flex gap-2">
                  <select 
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    value={form.modelId}
                    onChange={(e) => setForm({...form, modelId: e.target.value})}
                  >
                    <option value="" className="bg-[#111216]">Select Model</option>
                    <option value="1" className="bg-[#111216]">MacBook Pro 14</option>
                    <option value="2" className="bg-[#111216]">Dell XPS 15</option>
                  </select>
                  <button type="button" className="flex items-center gap-2 rounded-xl bg-emerald-600/10 px-4 text-xs font-bold text-emerald-400 hover:bg-emerald-600/20 border border-emerald-500/20 transition-all active:scale-95">
                    NEW
                  </button>
                </div>
              </div>

              {/* Status */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <ShieldCheck className="h-3 w-3" /> Status
                </label>
                <div className="flex gap-2">
                  <select 
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    value={form.statusId}
                    onChange={(e) => setForm({...form, statusId: e.target.value})}
                  >
                    <option value="" className="bg-[#111216]">Select Status</option>
                    <option value="1" className="bg-[#111216]">Pending</option>
                    <option value="2" className="bg-[#111216]">Ready to Deploy</option>
                    <option value="3" className="bg-[#111216]">Archive</option>
                    <option value="4" className="bg-[#111216]">Broken - Not Fixable</option>
                    <option value="5" className="bg-[#111216]">Lost/Stolen</option>
                    <option value="6" className="bg-[#111216]">Out of Diagnostic</option>
                    <option value="7" className="bg-[#111216]">Out for Repair</option>
                  </select>
                  <button 
                    type="button" 
                    onClick={() => router.push("/status-labels/create")}
                    className="flex items-center gap-2 rounded-xl bg-emerald-600/10 px-4 text-xs font-bold text-emerald-400 hover:bg-emerald-600/20 border border-emerald-500/20 transition-all active:scale-95"
                  >
                    NEW
                  </button>
                </div>
              </div>

              {/* Checkout To */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <User className="h-3 w-3" /> Checkout to
                </label>
                <div className="flex gap-2">
                  <select 
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    value={form.checkedOutTo}
                    onChange={(e) => setForm({...form, checkedOutTo: e.target.value})}
                  >
                    <option value="" className="bg-[#111216]">Select User</option>
                    <option value="1" className="bg-[#111216]">John Doe</option>
                    <option value="2" className="bg-[#111216]">Sarah Chen</option>
                  </select>
                  <button type="button" className="flex items-center gap-2 rounded-xl bg-emerald-600/10 px-4 text-xs font-bold text-emerald-400 hover:bg-emerald-600/20 border border-emerald-500/20 transition-all active:scale-95">
                    NEW
                  </button>
                </div>
              </div>

              {/* Default Location */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <MapPin className="h-3 w-3" /> Default Location
                </label>
                <div className="flex gap-2">
                  <select 
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    value={form.locationId}
                    onChange={(e) => setForm({...form, locationId: e.target.value})}
                  >
                    <option value="" className="bg-[#111216]">Select Location</option>
                    <option value="1" className="bg-[#111216]">New York Office</option>
                    <option value="2" className="bg-[#111216]">London Studio</option>
                  </select>
                  <button type="button" className="flex items-center gap-2 rounded-xl bg-emerald-600/10 px-4 text-xs font-bold text-emerald-400 hover:bg-emerald-600/20 border border-emerald-500/20 transition-all active:scale-95">
                    NEW
                  </button>
                </div>
              </div>

              {/* Requestable */}
              <div className="flex items-center gap-3 pt-6">
                <input 
                  type="checkbox" 
                  id="requestable"
                  className="h-5 w-5 rounded-lg border-white/10 bg-white/5 text-cyan-600 focus:ring-cyan-500/50"
                  checked={form.requestable}
                  onChange={(e) => setForm({...form, requestable: e.target.checked})}
                />
                <label htmlFor="requestable" className="text-sm font-medium text-zinc-300 cursor-pointer">
                  Requestable
                </label>
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <FileText className="h-3 w-3" /> Notes
                </label>
                <textarea 
                  rows={3}
                  placeholder="Enter any additional notes..."
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all resize-none"
                  value={form.notes}
                  onChange={(e) => setForm({...form, notes: e.target.value})}
                />
              </div>

              {/* Upload Image */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Upload className="h-3 w-3" /> Upload Image
                </label>
                <div className="flex items-center gap-4">
                  <button type="button" className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-6 py-3 text-sm font-medium text-zinc-300 hover:bg-white/10 transition-all active:scale-95">
                    <Upload className="h-4 w-4" />
                    Select File...
                  </button>
                  <span className="text-xs text-zinc-500">No file selected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Optional Information Dropdown */}
          <div className="rounded-3xl border border-white/10 bg-[#111216] overflow-hidden">
            <button 
              type="button"
              onClick={() => setIsOptionalOpen(!isOptionalOpen)}
              className="flex w-full items-center justify-between px-8 py-5 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Info className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold uppercase tracking-wider text-white">Optional Information</span>
              </div>
              {isOptionalOpen ? <ChevronDown className="h-5 w-5 text-zinc-500" /> : <ChevronRight className="h-5 w-5 text-zinc-500" />}
            </button>
            
            {isOptionalOpen && (
              <div className="px-8 pb-8 pt-2 grid gap-6 md:grid-cols-2 border-t border-white/5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <Tag className="h-3 w-3" /> Asset Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter unique name"
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    value={form.assetName}
                    onChange={(e) => setForm({...form, assetName: e.target.value})}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <History className="h-3 w-3" /> Warranty (months)
                  </label>
                  <input 
                    type="number" 
                    placeholder="e.g. 12"
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    value={form.warranty}
                    onChange={(e) => setForm({...form, warranty: e.target.value})}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <Calendar className="h-3 w-3" /> Expected Checkin Date
                  </label>
                  <input 
                    type="date" 
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all [color-scheme:dark]"
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
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all [color-scheme:dark]"
                    value={form.nextAudit}
                    onChange={(e) => setForm({...form, nextAudit: e.target.value})}
                  />
                </div>

                <div className="flex flex-col gap-1 pt-2 md:col-span-2">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="byod"
                      className="h-5 w-5 rounded-lg border-white/10 bg-white/5 text-cyan-600 focus:ring-cyan-500/50"
                      checked={form.byod}
                      onChange={(e) => setForm({...form, byod: e.target.checked})}
                    />
                    <label htmlFor="byod" className="text-sm font-medium text-zinc-300 cursor-pointer">
                      BYOD
                    </label>
                  </div>
                  <p className="ml-8 text-[11px] text-zinc-500">This device is owned by the user</p>
                </div>
              </div>
            )}
          </div>

          {/* Order Related Information Dropdown */}
          <div className="rounded-3xl border border-white/10 bg-[#111216] overflow-hidden">
            <button 
              type="button"
              onClick={() => setIsOrderOpen(!isOrderOpen)}
              className="flex w-full items-center justify-between px-8 py-5 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  <Truck className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold uppercase tracking-wider text-white">Order Related Information</span>
              </div>
              {isOrderOpen ? <ChevronDown className="h-5 w-5 text-zinc-500" /> : <ChevronRight className="h-5 w-5 text-zinc-500" />}
            </button>
            
            {isOrderOpen && (
              <div className="px-8 pb-8 pt-2 grid gap-6 md:grid-cols-2 border-t border-white/5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <Barcode className="h-3 w-3" /> Order Number
                  </label>
                  <input 
                    type="text" 
                    placeholder="PO-12345"
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
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
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all [color-scheme:dark]"
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
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all [color-scheme:dark]"
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
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                      value={form.supplierId}
                      onChange={(e) => setForm({...form, supplierId: e.target.value})}
                    >
                      <option value="" className="bg-[#111216]">Select Supplier</option>
                      <option value="1" className="bg-[#111216]">Amazon Business</option>
                      <option value="2" className="bg-[#111216]">CDW</option>
                    </select>
                    <button type="button" className="flex items-center gap-2 rounded-xl bg-emerald-600/10 px-4 text-xs font-bold text-emerald-400 hover:bg-emerald-600/20 border border-emerald-500/20 transition-all active:scale-95">
                      NEW
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <DollarSign className="h-3 w-3" /> Purchase Cost
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">$</span>
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="0.00"
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-8 pr-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                      value={form.purchaseCost}
                      onChange={(e) => setForm({...form, purchaseCost: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col gap-6 items-end mt-4">
            <div className="flex flex-col gap-2 w-full md:w-64">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                <MousePointer2 className="h-3 w-3" /> After Saving
              </label>
              <select 
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                value={afterSaveAction}
                onChange={(e) => setAfterSaveAction(e.target.value)}
              >
                <option value="previous" className="bg-[#111216]">Go to previous page</option>
                <option value="all-assets" className="bg-[#111216]">Return to all assets</option>
                <option value="view-asset" className="bg-[#111216]">Go to Asset</option>
                <option value="view-model" className="bg-[#111216]">Go to Asset Model</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={() => router.back()}
                className="flex items-center gap-2 rounded-2xl bg-white/5 px-8 py-3 text-sm font-bold text-zinc-400 border border-white/10 hover:bg-white/10 transition-all active:scale-95"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-10 py-3 text-sm font-bold text-white shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] hover:bg-emerald-500 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Asset
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
