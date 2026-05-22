"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { 
  Truck, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Link as LinkIcon, 
  FileText, 
  X, 
  Save, 
  ArrowLeft,
  Milestone,
  Globe2
} from "lucide-react";

interface UpdateSupplierContentProps {
  slug: string;
}

export function UpdateSupplierContent({ slug }: UpdateSupplierContentProps) {
  const router = useRouter();
  const { push } = useToast();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    contactName: "",
    phone: "",
    email: "",
    url: "",
    address: "",
    city: "",
    state: "", // Province
    notes: "",
    image: null as string | null,
  });

  const fetchSupplier = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/suppliers/${slug}`, { credentials: "include" });
      if (res.ok) {
        const { record } = await res.json();
        setForm({
          name: record.name || "",
          contactName: record.contactName || "",
          phone: record.phone || "",
          email: record.email || "",
          url: record.url || "",
          address: record.address || "",
          city: record.city || "",
          state: record.state || "",
          notes: record.notes || "",
          image: record.image || null,
        });
      }
    } catch (err) {
      console.error("Failed to fetch supplier", err);
    } finally {
      setFetching(false);
    }
  }, [apiBase, slug]);

  useEffect(() => {
    fetchSupplier();
  }, [fetchSupplier]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiBase}/suppliers/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update supplier");
      }

      push("Supplier updated successfully!", "success");
      router.push("/suppliers");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setError(errorMsg);
      push(errorMsg, "error");
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
            onClick={() => router.push("/suppliers")}
            className="p-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10 hover:text-foreground transition-all shadow-lg active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Update Supplier</h2>
            <p className="text-zinc-400 text-sm">Modify information for {form.name}.</p>
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
              
              {/* Left Column: Primary Details */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Supplier Name</label>
                  <div className="relative">
                    <Truck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                    <input 
                      required
                      type="text" 
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Amazon Business, CDW"
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Contact Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-500" />
                    <input 
                      type="text" 
                      name="contactName"
                      value={form.contactName}
                      onChange={handleChange}
                      placeholder="Primary contact person"
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                    <input 
                      type="tel" 
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Business phone"
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500" />
                    <input 
                      type="email" 
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="sales@supplier.com"
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Website URL</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-500" />
                    <input 
                      type="url" 
                      name="url"
                      value={form.url}
                      onChange={handleChange}
                      placeholder="https://www.supplier.com"
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 transition-all shadow-inner"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Address & Media */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 h-4 w-4 text-zinc-500" />
                    <textarea 
                      rows={2}
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Street address..."
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all shadow-inner resize-none"
                    ></textarea>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">City</label>
                    <div className="relative">
                      <Globe2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-500" />
                      <input 
                        type="text" 
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="e.g. Phnom Penh"
                        className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all shadow-inner"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Province</label>
                    <div className="relative">
                      <Milestone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                      <input 
                        type="text" 
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        placeholder="Province"
                        className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Internal Notes</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 h-4 w-4 text-zinc-500" />
                    <textarea 
                      rows={3}
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      placeholder="Additional information about the supplier..."
                      className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all shadow-inner resize-none"
                    ></textarea>
                  </div>
                </div>

                <ImageUpload 
                  value={form.image} 
                  onChange={(val) => setForm({...form, image: val})} 
                  label="Supplier Image" 
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-2">
            <button 
              type="button"
              onClick={() => router.push("/suppliers")}
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
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
