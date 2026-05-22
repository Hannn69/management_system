"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { Activity, Zap, Loader2, CheckCircle2 } from "lucide-react";

export function StatusLabelsSeeder() {
  const { push } = useToast();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  const [loading, setLoading] = useState(false);

  const labels = [
    { name: "Ready to Deploy", type: "Deployable", notes: "Asset is fully functional and ready for assignment." },
    { name: "Pending", type: "Pending", notes: "Asset status is currently being determined." },
    { name: "Out for Diagnostics", type: "Pending", notes: "Asset is being evaluated for technical issues." },
    { name: "Out of Repair", type: "Deployable", notes: "Asset has returned from repair and is functional." },
    { name: "Broken - Not Fixable", type: "Undeployable", notes: "Asset is damaged beyond repair." },
    { name: "Lost/Stolen", type: "Archived", notes: "Asset is missing from inventory." },
    { name: "Archive", type: "Archived", notes: "Asset is kept for records but not in active use." },
  ];

  const handleSeed = async () => {
    setLoading(true);
    try {
      let created = 0;
      for (const label of labels) {
        const res = await fetch(`${apiBase}/status-labels`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(label),
          credentials: "include",
        });
        if (res.ok) created++;
      }
      push(`Successfully generated ${created} custom status labels!`, "success");
    } catch (err) {
      push("Failed to generate some labels", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[32px] border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#111216] p-8 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 shadow-inner">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Generate Custom Status Labels</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-md">
              Populate your system with your specific workflow: Ready to Deploy, Diagnostics, Repair, and Archives.
            </p>
          </div>
        </div>

        <button
          onClick={handleSeed}
          disabled={loading}
          className="group relative flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-900/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Zap className="h-5 w-5 animate-bounce" />
          )}
          <span>{loading ? "Generating..." : "Gen My Status Labels"}</span>
        </button>
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {labels.map((l, i) => (
          <div key={i} className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-white/[0.02] text-[9px] font-bold uppercase tracking-wider text-zinc-500 text-center">
            {l.name}
          </div>
        ))}
      </div>
    </div>
  );
}
