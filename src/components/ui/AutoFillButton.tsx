"use client";

import { Wand2 } from "lucide-react";

export function AutoFillButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-2 rounded-2xl border border-violet-500/20 bg-violet-600/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 transition-all hover:bg-violet-600/20 active:scale-95"
      >
        <Wand2 className="h-4 w-4" />
        Auto fill
      </button>
    </div>
  );
}
