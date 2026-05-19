"use client";

import { useState } from "react";
import { CreateTaskModal } from "@/components/dashboard/CreateTaskModal";

type DashboardHeaderProps = {
  title: string;
  defaultSpace?: string;
  lockSpace?: boolean;
};

export function DashboardHeader({
  title,
  defaultSpace,
  lockSpace,
}: DashboardHeaderProps) {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <header className="px-6 pt-6">
        <div className="mx-auto w-full max-w-[1380px]">
          <div className="rounded-[28px] border border-zinc-200 dark:border-white/8 bg-white dark:bg-[#121e28] px-6 py-5 shadow-sm dark:shadow-[0_30px_70px_-38px_rgba(0,0,0,0.78)]">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500 dark:text-[#6f8c9c]">
                  Control Center
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-foreground">
                  {title}
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-[#7d97a6]">
                  Track operational status, recent requests, and resource health
                  from one shared workspace.
                </p>
              </div>

              <div className="flex flex-col gap-3 xl:items-end">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center overflow-hidden rounded-full border border-zinc-200 dark:border-white/8 bg-slate-50 dark:bg-[#17242d] pr-2 shadow-inner">
                    <input
                      className="w-[290px] bg-transparent px-4 py-2.5 text-sm text-foreground placeholder:text-zinc-400 dark:placeholder:text-[#7893a2] focus:outline-none"
                      placeholder="Search records, people, or requests"
                      type="text"
                    />
                    <button
                      type="button"
                      className="rounded-full bg-emerald-600 dark:bg-[#2ca6a4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:opacity-90 transition-opacity"
                    >
                      Find
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCreateOpen(true)}
                    className="rounded-full bg-blue-600 dark:bg-[#2f6df6] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_-10px_rgba(37,99,235,0.4)] dark:shadow-[0_18px_35px_-22px_rgba(47,109,246,0.55)] transition-all hover:scale-[1.02] active:scale-95"
                  >
                    Create Record
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <CreateTaskModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        defaultSpace={defaultSpace}
        lockSpace={lockSpace}
      />
    </>
  );
}
