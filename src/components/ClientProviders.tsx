"use client";

import { ToastProvider } from "@/components/ui/toast";
import { ThemeProvider } from "@/lib/ThemeProvider";
import "@/lib/auth-fetch";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  );
}
