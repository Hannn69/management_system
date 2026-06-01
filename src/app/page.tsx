"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || data.message || "Incorrect email or password.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Incorrect email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0c141c] px-4 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(44,166,164,0.2),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_30%),linear-gradient(180deg,#0a1219_0%,#101a23_52%,#0d151d_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <section className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-[#101923]/90 shadow-[0_40px_100px_-35px_rgba(0,0,0,0.9)] backdrop-blur xl:grid-cols-[1.08fr_0.92fr]">
        <div className="hidden border-r border-white/6 bg-[linear-gradient(160deg,rgba(20,39,55,0.98)_0%,rgba(25,56,79,0.96)_52%,rgba(31,89,98,0.92)_100%)] p-10 xl:flex xl:flex-col xl:justify-between">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12 text-sm font-black tracking-[0.24em] text-white">
              MS
            </div>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.34em] text-white/62">
              Asset Control
            </p>
            <h1 className="mt-4 max-w-md text-4xl font-semibold leading-tight text-white">
              Secure access to your management workspace.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/76">
              Track inventory, manage requests, and stay on top of operations
              from one focused command center.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[28px] border border-white/10 bg-black/10 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.24em] text-white/50">
                Live Overview
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">Unified Asset Visibility</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-white/10 bg-white/6 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/45">Monitoring</p>
                <p className="mt-2 text-lg font-semibold text-white">Devices, licenses, teams</p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/6 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/45">Security</p>
                <p className="mt-2 text-lg font-semibold text-white">Cookie-based session auth</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-8 sm:px-10 sm:py-12">
          <div className="w-full max-w-md">
            <div className="xl:hidden">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1f5962] text-sm font-black tracking-[0.24em] text-white">
                MS
              </div>
              <h1 className="mt-6 text-3xl font-semibold text-white">
                Sign in to Management System
              </h1>
              <p className="mt-3 text-sm leading-6 text-[#89a2b1]">
                Use your workspace credentials to continue to the dashboard.
              </p>
            </div>

            <div className="hidden xl:block">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#6f8a9a]">
                Welcome Back
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-white">Sign in</h2>
              <p className="mt-3 text-sm leading-6 text-[#89a2b1]">
                Enter your email and password to access the asset management dashboard.
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#c7d4dc]">Email</span>
                <div className="flex items-center gap-3 rounded-[20px] border border-white/10 bg-[#16232d] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition focus-within:border-[#43d3cf]/70 focus-within:ring-2 focus-within:ring-[#43d3cf]/20">
                  <Mail className="h-4 w-4 text-[#6f8a9a]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#6f8a9a]"
                    placeholder="you@company.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-[#c7d4dc]">Password</span>
                </div>
                <div className="flex items-center gap-3 rounded-[20px] border border-white/10 bg-[#16232d] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition focus-within:border-[#43d3cf]/70 focus-within:ring-2 focus-within:ring-[#43d3cf]/20">
                  <LockKeyhole className="h-4 w-4 text-[#6f8a9a]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#6f8a9a]"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="rounded-full p-1 text-[#7b95a5] transition hover:bg-white/5 hover:text-white"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    disabled
                    className="text-sm font-medium text-[#43d3cf]/60"
                  >
                    Forgot Password?
                  </button>
                </div>
              </label>

              {error ? (
                <div className="rounded-[20px] border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-[20px] bg-[#2ca6a4] px-4 py-3.5 text-sm font-bold text-white shadow-[0_18px_40px_-18px_rgba(44,166,164,0.75)] transition hover:bg-[#258e8c] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
