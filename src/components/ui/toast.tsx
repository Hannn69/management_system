"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type ToastItem = {
  id: string;
  message: string;
  variant?: "success" | "error";
};

type ToastContextValue = {
  push: (message: string, variant?: ToastItem["variant"]) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push = useCallback((message: string, variant: ToastItem["variant"]) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, variant }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  useEffect(() => {
    const handler = () => push("Task has been created successfully.", "success");
    window.addEventListener("task:created", handler);
    return () => window.removeEventListener("task:created", handler);
  }, [push]);

  useEffect(() => {
    const handler = () => push("Task has been updated successfully.", "success");
    window.addEventListener("task:updated", handler);
    return () => window.removeEventListener("task:updated", handler);
  }, [push]);

  useEffect(() => {
    const handler = () => push("Task has been deleted successfully.", "success");
    window.addEventListener("task:deleted", handler);
    return () => window.removeEventListener("task:deleted", handler);
  }, [push]);

  useEffect(() => {
    const handler = () =>
      push("Space has been created successfully.", "success");
    window.addEventListener("space:created", handler);
    return () => window.removeEventListener("space:created", handler);
  }, [push]);

  useEffect(() => {
    const handler = () =>
      push("Space has been updated successfully.", "success");
    window.addEventListener("space:updated", handler);
    return () => window.removeEventListener("space:updated", handler);
  }, [push]);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-6 top-6 z-[120] flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-lg border px-4 py-3 text-sm font-medium shadow-lg ${
              toast.variant === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
            role="status"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
