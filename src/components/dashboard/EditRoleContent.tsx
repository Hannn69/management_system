"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { Save, ShieldCheck, X } from "lucide-react";
import { emptyRoleForm, mapRoleToForm, RoleFormState } from "@/lib/roles";

export function EditRoleContent() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { push } = useToast();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  const [form, setForm] = useState<RoleFormState>(emptyRoleForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => !loading && Boolean(form.name.trim()),
    [form.name, loading]
  );

  const loadRole = useCallback(async () => {
    if (!params.id) {
      return;
    }

    setFetching(true);
    setError(null);

    try {
      const res = await fetch(`${apiBase}/roles/${params.id}`, {
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to fetch role.");
      }

      const data = await res.json();
      setForm(mapRoleToForm(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch role.");
    } finally {
      setFetching(false);
    }
  }, [apiBase, params.id]);

  useEffect(() => {
    loadRole();
  }, [loadRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!params.id || !form.name.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiBase}/roles/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to update role.");
      }

      push("Role updated successfully!", "success");
      router.push("/roles");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update role.";
      setError(message);
      push(message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="px-6 pb-6 pt-5">
      <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-6">
        {error ? (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300">
            {error}
          </div>
        ) : null}

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
              disabled={!canSubmit}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-3 text-sm font-bold text-white shadow-[0_15px_35px_-10px_rgba(16,185,129,0.5)] transition-all hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
