"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Tag, 
  Factory, 
  Truck, 
  MapPin, 
  Users, 
  Activity,
  ArrowLeft, 
  Edit2, 
  Globe,
  Mail,
  Phone,
  Printer,
  FileText,
  Image as ImageIcon,
  Building2,
  User,
  Layers
} from "lucide-react";

interface SettingsDetailContentProps {
  slug: string;
  type: "categories" | "manufacturers" | "suppliers" | "locations" | "departments" | "status-labels";
}

export function SettingsDetailContent({ slug, type }: SettingsDetailContentProps) {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const entityConfig = {
    categories: { label: "Category", icon: Tag, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    manufacturers: { label: "Manufacturer", icon: Factory, color: "text-rose-500", bg: "bg-rose-500/10" },
    suppliers: { label: "Supplier", icon: Truck, color: "text-blue-500", bg: "bg-blue-500/10" },
    locations: { label: "Location", icon: MapPin, color: "text-cyan-500", bg: "bg-cyan-500/10" },
    departments: { label: "Department", icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    "status-labels": { label: "Status Label", icon: Activity, color: "text-amber-500", bg: "bg-amber-500/10" },
  }[type];

  const fetchRecord = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/${type}/${slug}`, { credentials: "include" });
      if (!res.ok) throw new Error(`Failed to fetch ${type} details`);
      const data = await res.json();
      setRecord(data.record);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [apiBase, slug, type]);

  useEffect(() => {
    fetchRecord();
  }, [fetchRecord]);

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className={`h-8 w-8 animate-spin rounded-full border-4 ${entityConfig.color.replace('text', 'border')} border-t-transparent`} />
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="p-12 text-center">
        <p className="text-rose-400 font-bold">{error || "Record not found"}</p>
        <button onClick={() => router.back()} className="mt-4 text-sm text-zinc-400 hover:text-white flex items-center gap-2 mx-auto">
          <ArrowLeft className="h-4 w-4" /> Go Back
        </button>
      </div>
    );
  }

  const Icon = entityConfig.icon;

  return (
    <main className="px-6 pb-12 pt-5">
      <div className="mx-auto w-full max-w-[1200px] space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 text-zinc-400 hover:text-foreground dark:hover:text-white transition-all shadow-sm"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                <Icon className={`h-3 w-3 ${entityConfig.color}`} />
                <span>{entityConfig.label} Info</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mt-1">{record.name}</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-mono tracking-tight">{record.slug}</p>
            </div>
          </div>

          <button 
            onClick={() => router.push(`/${type}/${slug}/edit`)}
            className="flex items-center gap-2 rounded-2xl bg-zinc-800 dark:bg-white text-white dark:text-black px-6 py-3 text-sm font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Edit2 className="h-4 w-4" />
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-[32px] border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#111216] p-8 shadow-sm">
              <div className="flex flex-col md:flex-row gap-8">
                <div className={`w-full md:w-48 h-48 rounded-[32px] ${entityConfig.bg} flex items-center justify-center border border-zinc-200 dark:border-white/5 overflow-hidden shadow-inner`}>
                  {record.image ? (
                    <img 
                      src={record.image} 
                      alt={record.name}
                      className="w-full h-full object-cover animate-in fade-in duration-500"
                    />
                  ) : (
                    <Icon className={`h-16 w-16 ${entityConfig.color} opacity-40`} />
                  )}
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-6">
                  {/* Category Type */}
                  {type === "categories" && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Resource Type</p>
                      <div className="flex items-center gap-2 text-foreground font-medium">
                        <Layers className="h-4 w-4 text-violet-500" />
                        {record.type}
                      </div>
                    </div>
                  )}

                  {/* Manufacturer/Supplier URLs */}
                  {(type === "manufacturers" || type === "suppliers") && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Website</p>
                      <div className="flex items-center gap-2 text-cyan-500 font-medium">
                        <Globe className="h-4 w-4" />
                        <a href={record.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{record.url || "N/A"}</a>
                      </div>
                    </div>
                  )}

                  {/* Contact Info */}
                  {(record.email || record.phone) && (
                    <>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email</p>
                        <div className="flex items-center gap-2 text-foreground font-medium">
                          <Mail className="h-4 w-4 text-emerald-500" />
                          {record.email || "N/A"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Phone</p>
                        <div className="flex items-center gap-2 text-foreground font-medium">
                          <Phone className="h-4 w-4 text-blue-500" />
                          {record.phone || "N/A"}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Dept Manager */}
                  {type === "departments" && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Department Head</p>
                      <div className="flex items-center gap-2 text-foreground font-medium">
                        <User className="h-4 w-4 text-amber-500" />
                        {record.manager?.firstName || record.managerId ? `${record.manager?.firstName || ''} ${record.manager?.lastName || ''}` : "Admin User"}
                      </div>
                    </div>
                  )}

                  {/* Company Info */}
                  {record.company && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Associated Company</p>
                      <div className="flex items-center gap-2 text-foreground font-medium">
                        <Building2 className="h-4 w-4 text-blue-500" />
                        {record.company.name}
                      </div>
                    </div>
                  )}

                  {/* Location Info */}
                  {record.location && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Primary Location</p>
                      <div className="flex items-center gap-2 text-foreground font-medium">
                        <MapPin className="h-4 w-4 text-rose-500" />
                        {record.location.name}
                      </div>
                    </div>
                  )}

                  {/* Status Type */}
                  {type === "status-labels" && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Workflow Type</p>
                      <div className="flex items-center gap-2 text-foreground font-medium uppercase tracking-tighter">
                        <Activity className="h-4 w-4 text-amber-500" />
                        {record.type}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Internal Description</p>
                <div className="flex gap-3 text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                  <FileText className="h-4 w-4 mt-0.5 shrink-0" />
                  <p>{record.notes || `No detailed notes provided for this ${entityConfig.label.toLowerCase()}.`}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <div className="rounded-[32px] border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#111216] p-8 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-6">Relation Summary</h3>
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Linked Assets</span>
                  <span className="text-2xl font-black text-foreground">{record.assets?.length ?? 0}</span>
                </div>
                
                {type === "locations" && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Child Sites</span>
                    <span className="text-2xl font-black text-foreground">{record.childLocation?.length || 0}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[32px] border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#111216] p-8 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-4">System Details</h3>
              <div className="space-y-3 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-zinc-500 uppercase font-black tracking-tighter">ID</span>
                  <span className="font-mono text-foreground font-bold">#{record.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 uppercase font-black tracking-tighter">Created</span>
                  <span className="text-foreground">{record.createdAt ? new Date(record.createdAt).toLocaleDateString() : "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
