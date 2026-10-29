"use client";

import { useEffect, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ApiRecord } from "@/lib/types";

interface AssetCheckoutDialogProps {
  open: boolean;
  mode: "checkout" | "checkin";
  asset: { id: number; assetTag: string; name: string; checkedOutTo: string | null } | null;
  apiBase: string;
  onClose: () => void;
  onDone: (message: string) => void;
}

// Checking an asset out moves it to "Deployed"; checking it in returns it to "Ready to Deploy".
const STATUS_AFTER = { checkout: "Deployed", checkin: "Ready to Deploy" } as const;

export function AssetCheckoutDialog({
  open,
  mode,
  asset,
  apiBase,
  onClose,
  onDone,
}: AssetCheckoutDialogProps) {
  const [users, setUsers] = useState<ApiRecord[]>([]);
  const [statuses, setStatuses] = useState<ApiRecord[]>([]);
  const [userId, setUserId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setUserId("");
    setError(null);
    const load = async (path: string) => {
      const res = await fetch(`${apiBase}/${path}?limit=100`, { credentials: "include" });
      return res.ok ? ((await res.json()).records as ApiRecord[]) : [];
    };
    load("status-labels").then(setStatuses).catch(() => setStatuses([]));
    if (mode === "checkout") load("users").then(setUsers).catch(() => setUsers([]));
  }, [open, mode, apiBase]);

  const submit = async () => {
    if (!asset) return;
    if (mode === "checkout" && !userId) {
      setError("Choose who the asset is checked out to.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const status = statuses.find((s) => s.name === STATUS_AFTER[mode]);
      const res = await fetch(`${apiBase}/assets/${asset.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkedOutUserId: mode === "checkout" ? Number(userId) : null,
          ...(status ? { statusId: status.id } : {}),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Failed to ${mode} asset.`);
      }
      const who = users.find((u) => String(u.id) === userId)?.email;
      onDone(
        mode === "checkout"
          ? `${asset.assetTag} checked out to ${who}.`
          : `${asset.assetTag} checked in.`
      );
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${mode} asset.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-w-md p-0">
        <DialogHeader className="border-b border-zinc-200 dark:border-white/10 px-5 py-4">
          <DialogTitle>
            {mode === "checkout" ? "Check out" : "Check in"} {asset?.assetTag}
          </DialogTitle>
          <DialogDescription>
            {mode === "checkout"
              ? `Assign ${asset?.name ?? "this asset"} to a user. Its status becomes ${STATUS_AFTER.checkout}.`
              : `${asset?.name ?? "This asset"} is held by ${asset?.checkedOutTo}. Checking it in makes it ${STATUS_AFTER.checkin}.`}
          </DialogDescription>
        </DialogHeader>

        {mode === "checkout" && (
          <div className="px-5 py-4">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Check out to
            </label>
            <select
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              className="mt-2 w-full rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-4 py-3 text-sm text-foreground"
            >
              <option value="">Select user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.email}
                </option>
              ))}
            </select>
          </div>
        )}

        {error && (
          <p className="px-5 pb-2 text-sm text-rose-600 dark:text-rose-300">{error}</p>
        )}

        <DialogFooter className="border-t border-zinc-200 dark:border-white/10 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl border border-zinc-200 dark:border-white/10 px-4 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            <ArrowLeftRight className="h-4 w-4" />
            {submitting ? "Saving…" : mode === "checkout" ? "Check out" : "Check in"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
