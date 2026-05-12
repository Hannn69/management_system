"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Building2, 
  Phone, 
  Printer, 
  Mail, 
  FileText, 
  UploadCloud, 
  X, 
  Save, 
  ArrowLeft 
} from "lucide-react";

interface UpdateCompanyContentProps {
  companyId: string | null;
}

// Mock company data - replace with API call
const getMockCompanyData = (id: string | null) => {
  const companies: { [key: string]: any } = {
    "1": { id: 1, name: "Tech Corp", phone: "+1 (555) 123-4567", fax: "+1 (555) 123-4568", email: "contact@techcorp.com", notes: "Leading technology solutions provider" },
    "2": { id: 2, name: "Global Solutions", phone: "+1 (555) 234-5678", fax: "+1 (555) 234-5679", email: "info@globalsolutions.com", notes: "International consulting firm" },
    "3": { id: 3, name: "Future Systems", phone: "+1 (555) 345-6789", fax: "+1 (555) 345-6790", email: "support@futuresystems.com", notes: "Innovative software development" },
    "4": { id: 4, name: "Nexus Industries", phone: "+1 (555) 456-7890", fax: "+1 (555) 456-7891", email: "hello@nexus.com", notes: "Manufacturing and logistics" },
    "5": { id: 5, name: "Innovate Ltd", phone: "+1 (555) 567-8901", fax: "+1 (555) 567-8902", email: "contact@innovate.com", notes: "Research and development" },
  };

  return companies[id || "1"] || companies["1"];
};

export function UpdateCompanyContent({ companyId }: UpdateCompanyContentProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    fax: "",
    email: "",
    notes: "",
    image: null as File | null,
  });

  useEffect(() => {
    // Load company data
    const company = getMockCompanyData(companyId);
    setFormData({
      name: company.name,
      phone: company.phone,
      fax: company.fax,
      email: company.email,
      notes: company.notes,
      image: null,
    });
  }, [companyId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock save logic
    console.log("Updating company data...", formData);
    setTimeout(() => {
      setLoading(false);
      router.push("/companies");
    }, 1000);
  };

  return (
    <main className="px-6 pb-6 pt-5">
      <div className="mx-auto w-full max-w-[1380px] flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/companies")}
            className="p-2 rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-all shadow-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">Update Company</h2>
            <p className="text-zinc-400 text-sm">Edit the company details and save your changes.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Container */}
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column: Basic Info */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Company Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                    <input 
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter company legal name"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-500" />
                    <input 
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Fax Number</label>
                  <div className="relative">
                    <Printer className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                    <input 
                      type="tel"
                      name="fax"
                      value={formData.fax}
                      onChange={handleInputChange}
                      placeholder="Fax contact number"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500" />
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="contact@company.com"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all shadow-inner"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Image & Notes */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Company Logo</label>
                  <label className="group relative h-[180px] rounded-3xl border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/[0.08] hover:border-emerald-500/30 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 overflow-hidden shadow-inner">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <UploadCloud className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-zinc-200">Click or drag to upload</p>
                      <p className="text-[11px] text-zinc-500 mt-1">PNG, JPG or SVG (Max. 2MB)</p>
                    </div>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {formData.image && (
                    <p className="text-xs text-emerald-400 mt-2">✓ {formData.image.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Note / Description</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 h-4 w-4 text-zinc-500" />
                    <textarea 
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Additional information about the company..."
                      className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all shadow-inner resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-2">
            <button 
              type="button"
              onClick={() => router.push("/companies")}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/10 bg-white/5 text-sm font-bold text-zinc-400 hover:bg-white/10 hover:text-white transition-all shadow-lg active:scale-95"
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
