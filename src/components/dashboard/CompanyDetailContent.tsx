"use client";

import type { ApiRecord } from "@/lib/types";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Building2, 
  Mail, 
  Phone, 
  Printer, 
  MapPin, 
  Users, 
  Package, 
  ArrowLeft, 
  Edit2, 
  FileText,
  Globe,
  Layers,
  Cpu,
  Image as ImageIcon
} from "lucide-react";

interface CompanyDetailContentProps {
  slug: string;
}

export function CompanyDetailContent({ slug }: CompanyDetailContentProps) {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  const [record, setRecord] = useState<ApiRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecord = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/companies/${slug}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch company details");
      const data = await res.json();
      setRecord(data.record);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [apiBase, slug]);

  useEffect(() => {
    fetchRecord();
  }, [fetchRecord]);

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="p-12 text-center">
        <p className="text-rose-600 font-bold">{error || "Company not found"}</p>
        <button onClick={() => router.back()} className="mt-4 text-sm text-gray-500 hover:text-gray-900 flex items-center gap-2 mx-auto">
          <ArrowLeft className="h-4 w-4" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mx-auto w-full max-w-[1400px] space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-foreground transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-500">
                <Building2 className="h-3 w-3" />
                <span>Organization Profile</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mt-1">{record.name}</h1>
              <p className="text-sm text-gray-500 font-mono tracking-tight">{record.slug}</p>
            </div>
          </div>

          <button 
            onClick={() => router.push(`/companies/${slug}/edit`)}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Edit2 className="h-4 w-4" />
            Edit Company
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Main Info Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-48 h-48 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden">
                  {record.logo ? (
                    <img src={record.logo} alt={record.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="h-16 w-16 text-gray-300" />
                  )}
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</p>
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <Mail className="h-4 w-4 text-emerald-500" />
                      {record.email || "N/A"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone Number</p>
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <Phone className="h-4 w-4 text-blue-500" />
                      {record.phone || "N/A"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Fax</p>
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <Printer className="h-4 w-4 text-blue-500" />
                      {record.fax || "N/A"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Headquarters</p>
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <Globe className="h-4 w-4 text-blue-500" />
                      Global Operations
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-10 border-t border-gray-200">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Description & Notes</p>
                <div className="flex gap-3 text-gray-600 leading-relaxed">
                  <FileText className="h-5 w-5 mt-0.5 shrink-0 text-gray-500" />
                  <p>{record.notes || "No description available for this organization."}</p>
                </div>
              </div>
            </div>

            {/* Entity Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Package className="h-4 w-4 text-emerald-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Assets</span>
                </div>
                <p className="text-2xl font-black text-foreground">{record.assets || 0}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Users</span>
                </div>
                <p className="text-2xl font-black text-foreground">0</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Sites</span>
                </div>
                <p className="text-2xl font-black text-foreground">0</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Layers className="h-4 w-4 text-blue-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Depts</span>
                </div>
                <p className="text-2xl font-black text-foreground">0</p>
              </div>
            </div>
          </div>

          {/* Activity Sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-6">Recent Records</h3>
              <div className="space-y-4">
                <p className="text-center text-xs text-gray-500 py-4 italic">No recent assets assigned to this company.</p>
              </div>
            </div>
            
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-4">Meta Data</h3>
              <div className="space-y-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Internal ID</span>
                  <span className="font-mono text-foreground">#{record.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Created On</span>
                  <span className="text-foreground">2026-05-18</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Synced</span>
                  <span className="text-foreground">Just now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
