"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AddPeopleModalProps = {
  open: boolean;
  spaceId: string;
  spaceName?: string;
  onClose: () => void;
  onInvited?: () => void;
};

const roleOptions = ["Member", "Administrator", "Viewer"];

export function AddPeopleModal({
  open,
  spaceId,
  spaceName,
  onClose,
  onInvited,
}: AddPeopleModalProps) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
  const [emails, setEmails] = useState("");
  const [role, setRole] = useState(roleOptions[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setEmails("");
      setRole(roleOptions[0]);
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  const handleInvite = async () => {
    const trimmed = emails.trim();
    if (!trimmed) {
      setError("Email is required.");
      return;
    }
    const firstEmail = trimmed.split(/[,\s]+/).filter(Boolean)[0];
    if (!firstEmail) {
      setError("Email is required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase}/space/${spaceId}/invite`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: firstEmail,
          role:
            role === "Administrator"
              ? "admin"
              : role === "Viewer"
                ? "viewer"
                : "member",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to invite.");
      }
      onInvited?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to invite.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-lg p-0">
        <div className="flex flex-col">
          <DialogHeader className="border-b border-gray-200 px-6 py-4">
            <DialogTitle>
              Add people to {spaceName ?? "this space"}
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              Names or emails <span className="text-rose-700">*</span>
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4 text-sm text-gray-600">
            <div className="flex flex-col gap-4">
              <input
                className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-900"
                placeholder="e.g., Maria, maria@company.com"
                value={emails}
                onChange={(event) => setEmails(event.target.value)}
              />

              <div>
                <p className="text-xs text-gray-500">or add from</p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {["Google", "Slack", "Microsoft"].map((provider) => (
                    <button
                      key={provider}
                      type="button"
                      className="rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-xs text-gray-800 hover:bg-gray-200"
                    >
                      {provider}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500">
                  Role <span className="text-rose-700">*</span>
                </label>
                <select
                  className="mt-2 w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-900"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                >
                  {roleOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>

              <p className="text-xs text-gray-500">
                This site is protected by reCAPTCHA and the Google Privacy
                Policy and Terms of Service apply.
              </p>
            </div>
            {error ? <p className="mt-3 text-xs text-rose-700">{error}</p> : null}
          </div>

          <DialogFooter className="border-t border-gray-200 px-6 py-4 text-xs text-gray-500 sm:items-center sm:justify-end">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-lg border border-gray-200 px-4 py-2 text-xs text-gray-600 hover:bg-gray-200"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-lg bg-blue-500 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleInvite}
                disabled={submitting}
              >
                {submitting ? "Adding..." : "Add"}
              </button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
