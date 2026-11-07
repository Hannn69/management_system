"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { Activity, FileText, Save, Tag, X } from "lucide-react";

function CreateStatusLabelContentInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const { push } = useToast();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    type: "Pending",
    notes: "",
  });

  const handleBack = () => {
    if (returnTo) {
      router.push(returnTo);
    } else {
      router.push("/status-labels");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiBase}/status-labels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create status label");
      }

      push("Status label created successfully!", "success");
      handleBack();
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMsg);
      push(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mx-auto w-full max-w-[1380px] flex flex-col gap-6">
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
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">
                    Status Name
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                    <input
                      required
                      type="text"
                      placeholder="e.g. Out for Repair, In Stock"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all shadow-inner"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">
                    Status Type
                  </label>
                  <div className="relative">
                    <Activity className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                    <select
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all shadow-inner appearance-none"
                      value={form.type}
                      onChange={(e) =>
                        setForm({ ...form, type: e.target.value })
                      }
                    >
                      <option value="Deployable">Deployable</option>
                      <option value="Undeployable">Undeployable</option>
                      <option value="Archived">Archived</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">
                    Notes
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 h-4 w-4 text-gray-500" />
                    <textarea
                      rows={4}
                      placeholder="Status label description..."
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all shadow-inner resize-none"
                      value={form.notes}
                      onChange={(e) =>
                        setForm({ ...form, notes: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-500 hover:bg-gray-100 hover:text-foreground transition-all shadow-sm active:scale-95"
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
              <span>{loading ? "Saving..." : "Save Status Label"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CreateStatusLabelContent() {
  return (
    <Suspense fallback={null}>
      <CreateStatusLabelContentInner />
    </Suspense>
  );
}
