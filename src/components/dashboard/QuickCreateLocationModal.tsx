"use client";

import { useState } from "react";
import { 
  X, 
  Save, 
  MapPin, 
  Building2, 
  Globe2, 
  Milestone,
  ChevronDown
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";

interface QuickCreateLocationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (newLocation: any) => void;
  companies: any[];
}

export function QuickCreateLocationModal({ open, onClose, onSuccess, companies }: QuickCreateLocationModalProps) {
  const { push } = useToast();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    companyId: "",
    city: "",
    state: "", // Province
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        companyId: form.companyId ? Number(form.companyId) : undefined,
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

      const { record } = await res.json();
      push("Location created successfully!", "success");
      onSuccess(record);
      onClose();
      // Reset form
      setForm({ name: "", companyId: "", city: "", state: "" });
    } catch (err) {
      push(err instanceof Error ? err.message : "An error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#111216] border-white/10 p-0 overflow-hidden rounded-[28px]">
        <div className="p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <MapPin className="h-5 w-5" />
              </div>
              Quick Create Location
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Enter the location details below to create a new location.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Location Name</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Storage A"
                  className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
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
                  className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-[#111216] pl-12 pr-10 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all appearance-none"
                  value={form.companyId}
                  onChange={(e) => setForm({ ...form, companyId: e.target.value })}
                >
                  <option value="" className="bg-[#111216]">Select Company</option>
                  {companies.map(c => <option key={c.id} value={c.id} className="bg-[#111216]">{c.name}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">City</label>
                <div className="relative">
                  <Globe2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-500" />
                  <input 
                    type="text" 
                    placeholder="Phnom Penh"
                    className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all"
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
                    className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button 
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-2xl border border-white/10 bg-white/5 text-sm font-bold text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-emerald-600 text-sm font-bold text-white shadow-lg hover:bg-emerald-500 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Create
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
