"use client";

import type { ApiRecord } from "@/lib/types";
import { useState } from "react";
import { 
  X, 
  Save, 
  Factory,
  Globe2
} from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface QuickCreateManufacturerModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (manufacturer: ApiRecord) => void;
}

export function QuickCreateManufacturerModal({ open, onClose, onSuccess }: QuickCreateManufacturerModalProps) {
  const { push } = useToast();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/manufacturers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to create manufacturer");

      const manufacturer = await res.json();
      push("Manufacturer created successfully!", "success");
      onSuccess(manufacturer);
      setName("");
      onClose();
    } catch (err) {
      push("Failed to create manufacturer", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
      <div className="w-full max-w-md scale-100 rounded-xl border border-gray-200 bg-white p-8 shadow-sm animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
              <Factory className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-foreground">New Manufacturer</h3>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 hover:bg-gray-100 transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Manufacturer Name</label>
            <div className="relative">
              <Globe2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-500/50" />
              <input 
                autoFocus
                required
                type="text" 
                placeholder="e.g. Apple, Dell, Logitech"
                className="w-full rounded-xl border border-gray-200 bg-gray-100 pl-12 pr-4 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-gray-200 bg-gray-100 text-sm font-bold text-gray-500 hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading || !name}
              className="flex-[2] flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-600 text-sm font-bold text-white shadow-sm shadow-orange-900/20 hover:bg-orange-500 transition-all disabled:opacity-50"
            >
              {loading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="h-4 w-4" />}
              <span>Create Manufacturer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
