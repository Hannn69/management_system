"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Layout from "@/components/layout/layout";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname === "/" || pathname.startsWith("/auth/");
  const [checkingSession, setCheckingSession] = useState(!isAuthPage);

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      if (!isAuthPage) {
        setCheckingSession(true);
      }

      try {
        const res = await fetch("/api/auth/session", {
          credentials: "include",
          cache: "no-store",
        });

        if (res.ok) {
          if (isAuthPage) {
            router.replace("/dashboard");
          }
          return;
        }

        if (!isAuthPage) {
          router.replace("/");
        }
      } catch {
        if (!isAuthPage) {
          router.replace("/");
        }
        return;
      } finally {
        if (active) {
          setCheckingSession(false);
        }
      }
    };

    checkSession();

    return () => {
      active = false;
    };
  }, [isAuthPage, router, pathname]);

  if (isAuthPage) {
    return <>{children}</>;
  }

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return <Layout>{children}</Layout>;
}
