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
import { AlertTriangle, Trash2, X } from "lucide-react";

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  itemName?: string;
  loading?: boolean;
}

export function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  loading = false,
}: DeleteConfirmDialogProps) {
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    if (open) {
      setConfirmText("");
    }
  }, [open]);

  const isConfirmValid = confirmText.trim().toLowerCase() === "delete";

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-md border-white/10 bg-[#111216] p-0 shadow-2xl">
        <div className="flex flex-col">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 shadow-inner">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white tracking-tight">
                  {title}
                </DialogTitle>
                <DialogDescription className="mt-1 text-zinc-400 text-sm leading-relaxed">
                  {description || `Are you sure you want to delete ${itemName ? `"${itemName}"` : 'this item'}? This action cannot be undone.`}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="px-6 py-4 space-y-3 bg-white/[0.02] border-y border-white/5">
            <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-500 ml-1">
              Type <span className="text-rose-400 font-mono">delete</span> to confirm
            </label>
            <div className="relative">
              <Trash2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
              <input
                className="w-full rounded-xl border border-white/10 bg-[#1a1b1e] pl-11 pr-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all shadow-inner"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="delete"
                autoFocus
              />
            </div>
          </div>

          <DialogFooter className="p-6 pt-4 flex flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-bold text-zinc-400 hover:bg-white/10 hover:text-white transition-all active:scale-95"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button
              type="button"
              disabled={!isConfirmValid || loading}
              onClick={onConfirm}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95 ${
                isConfirmValid && !loading
                  ? "bg-rose-600 hover:bg-rose-500 shadow-[0_10px_25px_-10px_rgba(225,29,72,0.5)]"
                  : "bg-rose-900/20 text-rose-300/30 cursor-not-allowed border border-rose-500/10"
              }`}
            >
              {loading ? (
                 <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              <span>{loading ? "Deleting..." : "Delete Item"}</span>
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
