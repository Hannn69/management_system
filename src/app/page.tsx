"use client";

// Login page modelled on the MOC portal login (demo-nominee.moc.gov.kh/en/portal/login):
// gradient brand panel on the left, centered "Welcome" form on the right.
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LoaderCircle, Lock, LogIn, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const GRID_PATTERN =
  "url(\"data:image/svg+xml,%3Csvg width='72' height='72' viewBox='0 0 72 72' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.04'%3E%3Cpath d='M36 0v72M0 36h72'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";

const AAS_ERRORS: Record<string, string> = {
  aas_not_configured: "AAS sign-in is not configured on this server.",
  aas_unavailable: "Could not reach AAS. Please try again.",
};

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // AAS errors come back as /?error=<code>; read them after mount (the page is prerendered).
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("error");
    if (code && AAS_ERRORS[code]) setError(AAS_ERRORS[code]);
  }, []);

  const handleAasLogin = () => {
    window.location.href = "/api/auth/aas/login";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim(),
          password,
          rememberMe,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || data.message || "Incorrect email or password.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Incorrect email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(147,197,253,0.18),transparent_34%),radial-gradient(circle_at_25%_75%,rgba(59,130,246,0.16),transparent_40%),radial-gradient(circle_at_85%_25%,rgba(37,99,235,0.18),transparent_34%)]" />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: GRID_PATTERN }} />

        <div className="relative z-10 flex h-full flex-col px-12 py-16 text-white">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/moc-logo.png"
              alt="Ministry of Commerce"
              width={120}
              height={120}
              className="object-contain"
            />
            <div>
              <h1 className="text-4xl font-extrabold leading-tight">ក្រសួងពាណិជ្ជកម្ម</h1>
              <p className="mt-1 text-lg font-semibold text-blue-100">Ministry Of Commerce</p>
            </div>
          </div>

          <h2 className="mt-10 text-4xl font-semibold leading-relaxed">
            Asset, Inventory and Operations Management System
          </h2>

          <p className="mt-auto text-sm text-blue-200/70">
            © 2026 Ministry of Commerce. All rights reserved by Ministry of Commerce
          </p>
        </div>

        <div className="absolute -top-16 -right-10 h-48 w-48 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute -bottom-16 left-8 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      {/* Form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/moc-logo.png"
              alt="Ministry of Commerce"
              width={72}
              height={72}
              className="mb-3 object-contain"
            />
            <p className="text-lg font-bold text-slate-900">ក្រសួងពាណិជ្ជកម្ម</p>
            <p className="text-sm font-semibold text-slate-600">Ministry Of Commerce</p>
          </div>

          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold text-slate-900">Welcome</h2>
            <p className="text-slate-600">Logon to the Asset, Inventory and Operations Management System</p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="mb-6 w-full border-slate-300"
            onClick={handleAasLogin}
            disabled={loading}
          >
            <ShieldCheck className="h-4 w-4" />
            Login with AAS Officer Account
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="Enter your email address"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Remember me
            </label>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white hover:from-blue-600 hover:via-blue-500 hover:to-blue-400"
            >
              {loading ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
