"use client";

import { useEffect, useRef, useState } from "react";
import { CreateTaskModal } from "@/components/dashboard/CreateTaskModal";

type DashboardHeaderProps = {
  title: string;
  defaultSpace?: string;
  lockSpace?: boolean;
};

const utilityItems = ["Alerts", "Calendar", "Exports"];

export function DashboardHeader({
  title,
  defaultSpace,
  lockSpace,
}: DashboardHeaderProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  return (
    <>
      <header className="px-6 pt-6">
        <div className="mx-auto w-full max-w-[1380px]">
          <div className="rounded-[28px] border border-white/7 bg-[#121e28] px-6 py-5 shadow-[0_30px_70px_-38px_rgba(0,0,0,0.78)]">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6f8c9c]">
                Control Center
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-white">
                {title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-[#7d97a6]">
                Track operational status, recent requests, and resource health
                from one shared workspace.
              </p>
            </div>

            <div className="flex flex-col gap-3 xl:items-end">
              <div className="flex flex-wrap items-center gap-2">
                {utilityItems.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="rounded-full border border-white/8 bg-[#17242d] px-4 py-2 text-sm font-medium text-[#b7cad5] transition hover:border-white/16 hover:bg-[#1d2c36] hover:text-white"
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center overflow-hidden rounded-full border border-white/8 bg-[#17242d] pr-2">
                  <input
                    className="w-[290px] bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-[#7893a2] focus:outline-none"
                    placeholder="Search records, people, or requests"
                    type="text"
                  />
                  <button
                    type="button"
                    className="rounded-full bg-[#2ca6a4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white"
                  >
                    Find
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setCreateOpen(true)}
                  className="rounded-full bg-[#2f6df6] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_35px_-22px_rgba(47,109,246,0.55)] transition hover:bg-[#255fe0]"
                >
                  Create Record
                </button>

                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    className="flex items-center gap-3 rounded-full border border-white/8 bg-[#17242d] px-2 py-1.5 text-left shadow-sm"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#12344d] text-xs font-bold text-white">
                      AU
                    </span>
                    <span className="pr-2 text-sm font-medium text-[#c0d1db]">
                      Admin User
                    </span>
                  </button>

                  {menuOpen ? (
                    <div className="absolute right-0 top-14 z-50 w-52 rounded-2xl border border-white/8 bg-[#17242d] p-2 shadow-[0_25px_60px_-35px_rgba(0,0,0,0.75)]">
                      <button
                        type="button"
                        className="block w-full rounded-xl px-3 py-2 text-left text-sm text-[#d3dee5] hover:bg-[#20303b]"
                        onClick={() => setMenuOpen(false)}
                      >
                        Profile
                      </button>
                      <button
                        type="button"
                        className="block w-full rounded-xl px-3 py-2 text-left text-sm text-[#d3dee5] hover:bg-[#20303b]"
                        onClick={() => setMenuOpen(false)}
                      >
                        Workspace Settings
                      </button>
                    </div>
                  ) : null}
                </div>
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
