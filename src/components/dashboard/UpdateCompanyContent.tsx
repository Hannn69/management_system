"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { 
  Building2, 
  Phone, 
  Printer, 
  Mail, 
  FileText, 
  X, 
  Save, 
  ArrowLeft 
} from "lucide-react";

interface UpdateCompanyContentProps {
  companyId: string | null;
}

export function UpdateCompanyContent({ companyId }: UpdateCompanyContentProps) {
  const router = useRouter();
  const { push } = useToast();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    fax: "",
    email: "",
    notes: "",
    logo: null as string | null,
  });

  const fetchCompany = useCallback(async () => {
    if (!companyId) return;
    try {
      const res = await fetch(`${apiBase}/companies/${companyId}`, { credentials: "include" });
      if (res.ok) {
        const { record } = await res.json();
        setFormData({
          name: record.name || "",
          phone: record.phone || "",
          fax: record.fax || "",
          email: record.email || "",
          notes: record.notes || "",
          logo: record.logo || null,
        });
      }
    } catch (err) {
      console.error("Failed to fetch company", err);
    } finally {
      setFetching(false);
    }
  }, [apiBase, companyId]);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiBase}/companies/${companyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update company");
      }

      push("Company updated successfully!", "success");
      router.push("/companies");
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
    <div className="space-y-6">
      <div className="mx-auto w-full max-w-[1380px] flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/companies")}
            className="p-2 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-foreground transition-all shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Update Company</h2>
            <p className="text-gray-500 text-sm">Edit the company details and save your changes.</p>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-sm text-rose-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Company Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                    <input 
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter company legal name"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                    <input 
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-xl border border-gray-200 bg-gray-100 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Fax Number</label>
                  <div className="relative">
                    <Printer className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                    <input 
                      type="tel"
                      name="fax"
                      value={formData.fax}
                      onChange={handleInputChange}
                      placeholder="Fax contact number"
                      className="w-full rounded-xl border border-gray-200 bg-gray-100 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="contact@company.com"
                      className="w-full rounded-xl border border-gray-200 bg-gray-100 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all shadow-inner"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <ImageUpload 
                    value={formData.logo} 
                    onChange={(val) => setFormData({...formData, logo: val})} 
                    label="Company Logo"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Note / Description</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 h-4 w-4 text-gray-500" />
                    <textarea 
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Additional information about the company..."
                      className="w-full rounded-xl border border-gray-200 bg-gray-100 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all shadow-inner resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-2">
            <button 
              type="button"
              onClick={() => router.push("/companies")}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 bg-gray-100 text-sm font-bold text-gray-500 hover:bg-gray-200 hover:text-foreground transition-all shadow-sm active:scale-95"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-blue-600 text-sm font-bold text-white shadow-sm hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
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
    </div>
  );
}
