"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

// Lands here after the AAS identity provider redirects back with ?code=...&state=....
// Exchanges those for a local session, the same way the password login does.
function OauthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRun = useRef(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const providerError = searchParams.get("error");
    if (providerError) {
      setErrorMessage(searchParams.get("error_description") || providerError);
      return;
    }

    const code = searchParams.get("code");
    const state = searchParams.get("state");
    if (!code || !state) {
      setErrorMessage("Missing sign-in details from AAS. Please try again.");
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/auth/aas/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ code, state }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "AAS sign-in failed. Please try again.");
        }
        router.replace("/dashboard");
        router.refresh();
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : "AAS sign-in failed. Please try again.");
      }
    })();
  }, [router, searchParams]);

  if (errorMessage) {
    return (
      <div className="w-full max-w-md text-center">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
        <Link href="/" className="mt-6 inline-block text-sm font-medium text-blue-700 hover:underline">
          Back to login
        </Link>
      </div>
    );
  }

  return <p className="text-slate-500">Signing you in…</p>;
}

export default function AuthCallbackPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-8">
      <Suspense fallback={<p className="text-slate-500">Signing you in…</p>}>
        <OauthCallbackHandler />
      </Suspense>
    </div>
  );
}
