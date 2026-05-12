"use client";

import { ToastProvider } from "@/components/ui/toast";
import { ThemeProvider } from "@/lib/ThemeProvider";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  );
}
