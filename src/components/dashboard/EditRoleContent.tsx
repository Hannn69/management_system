"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Save, ShieldCheck, X } from "lucide-react";

const seedRoles = [
  {
    id: "1",
    name: "Asset Control",
    description: "Manage asset records, assignment, and status updates.",
  },
  {
    id: "2",
    name: "Request Review",
    description: "Review submitted requests and approve workflow changes.",
  },
  {
    id: "3",
    name: "Read Only Access",
    description: "Allow dashboard visibility without edit privileges.",
  },
];

const fallbackRole = {
  name: "",
  description: "",
};

export function EditRoleContent() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const initialRole = useMemo(
    () => seedRoles.find((role) => role.id === params.id) ?? fallbackRole,
    [params.id]
  );

  const [form, setForm] = useState(initialRole);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/roles");
  };

  return (
    <main className="px-6 pb-6 pt-5">
      <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-6">
        <form onSubmit={handleSubmit} className="space-y-6 pb-12">
          <section className="rounded-[28px] border border-zinc-200 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-[#111216]">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-500">
                  Role Information
                </p>
                <h2 className="mt-1 text-xl font-semibold text-foreground">
                  Edit Role & Permission
                </h2>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="ml-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Role Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="Admin, Editor, Viewer..."
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-100 px-4 py-3.5 text-sm text-foreground shadow-inner transition-all placeholder:text-zinc-400 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-zinc-600"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Description
                </label>
                <textarea
                  rows={6}
                  placeholder="Describe this role..."
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-100 px-4 py-3.5 text-sm text-foreground shadow-inner transition-all placeholder:text-zinc-400 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-zinc-600"
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </section>

          <div className="flex items-center justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={() => router.push("/roles")}
              className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-100 px-6 py-3 text-sm font-bold text-zinc-500 shadow-lg transition-all hover:bg-zinc-200 hover:text-foreground active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-3 text-sm font-bold text-white shadow-[0_15px_35px_-10px_rgba(16,185,129,0.5)] transition-all hover:scale-[1.02] active:scale-95"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
