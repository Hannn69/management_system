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
      const timer = setTimeout(() => {
        setConfirmText("");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const isConfirmValid = confirmText.trim().toLowerCase() === "delete";

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-md border-gray-200 bg-white p-0 shadow-sm">
        <div className="flex flex-col">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900 tracking-tight">
                  {title}
                </DialogTitle>
                <DialogDescription className="mt-1 text-gray-500 text-sm leading-relaxed">
                  {description || `Are you sure you want to delete ${itemName ? `"${itemName}"` : 'this item'}? This action cannot be undone.`}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="px-6 py-4 space-y-3 bg-gray-50 border-y border-gray-100">
            <label className="text-xs font-semibold text-gray-500">
              Type <span className="text-rose-600 font-mono">delete</span> to confirm
            </label>
            <div className="relative">
              <Trash2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
              <input
                className="w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
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
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-sm font-bold text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-all active:scale-95"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button
              type="button"
              disabled={!isConfirmValid || loading}
              onClick={onConfirm}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold text-white  transition-all active:scale-95 ${
                isConfirmValid && !loading
                  ? "bg-rose-600 hover:bg-rose-700 shadow-sm"
                  : "bg-rose-300 cursor-not-allowed"
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
