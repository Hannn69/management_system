"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import {
  ArrowLeft,
  AtSign,
  Building2,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import {
  emptyUserForm,
  mapUserToForm,
  SelectOption,
  UserFormState,
} from "@/lib/users";

export function EditUserContent() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { push } = useToast();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companies, setCompanies] = useState<SelectOption[]>([]);
  const [locations, setLocations] = useState<SelectOption[]>([]);
  const [form, setForm] = useState<UserFormState>(emptyUserForm);

  const passwordMismatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  const loadUser = useCallback(async () => {
    if (!params.id) {
      return;
    }

    setFetching(true);
    setError(null);

    try {
      const [userRes, companiesRes, locationsRes] = await Promise.all([
        fetch(`/api/users/${params.id}`, {
          credentials: "include",
          cache: "no-store",
        }),
        fetch(`${apiBase}/companies`, {
          credentials: "include",
          cache: "no-store",
        }),
        fetch(`${apiBase}/locations`, {
          credentials: "include",
          cache: "no-store",
        }),
      ]);

      if (!userRes.ok) {
        const data = await userRes.json().catch(() => ({}));
        throw new Error(data.message || "Failed to fetch user.");
      }

      const userData = await userRes.json();
      setForm(mapUserToForm(userData.record));

      if (companiesRes.ok) {
        const data = await companiesRes.json();
        setCompanies(data.records || []);
      }

      if (locationsRes.ok) {
        const data = await locationsRes.json();
        setLocations(data.records || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch user.");
    } finally {
      setFetching(false);
    }
  }, [apiBase, params.id]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const updateField = (name: keyof UserFormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const canSubmit = useMemo(
    () =>
      !loading &&
      !passwordMismatch &&
      Boolean(form.firstName && form.lastName && form.email && form.username),
    [form, loading, passwordMismatch]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!params.id || passwordMismatch) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload: Record<string, string | number | boolean | undefined> = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        username: form.username.trim(),
        displayName: form.displayName.trim() || undefined,
        phoneNumber: form.phoneNumber.trim() || undefined,
        companyId: form.companyId ? Number(form.companyId) : undefined,
        locationId: form.locationId ? Number(form.locationId) : undefined,
        loginEnabled: form.loginEnabled,
      };

      if (form.password) {
        payload.password = form.password;
      }

      const res = await fetch(`/api/users/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to update user.");
      }

      push("User updated successfully!", "success");
      router.push("/users");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update user.";
      setError(message);
      push(message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="px-6 pb-6 pt-5">
      <div className="mx-auto flex w-full max-w-[1380px] flex-col gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/users")}
            className="rounded-xl border border-zinc-200 bg-zinc-100 p-2 text-zinc-400 shadow-lg transition-all hover:bg-zinc-200 hover:text-foreground dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Update User
            </h2>
            <p className="text-sm text-zinc-400">
              Edit the user record and save your changes.
            </p>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-6 pb-12">
          <section className="rounded-[28px] border border-zinc-200 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-[#111216]">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-500">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-500">
                  User Profile
                </p>
                <h2 className="mt-1 text-xl font-semibold text-foreground">
                  User Details
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-500" />
                    <input required type="text" className="w-full rounded-2xl border border-zinc-200 bg-zinc-100 py-3.5 pl-12 pr-4 text-sm text-foreground shadow-inner transition-all focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-white/10 dark:bg-white/5" value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
                    <input required type="text" className="w-full rounded-2xl border border-zinc-200 bg-zinc-100 py-3.5 pl-12 pr-4 text-sm text-foreground shadow-inner transition-all focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5" value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-500" />
                    <input required type="email" className="w-full rounded-2xl border border-zinc-200 bg-zinc-100 py-3.5 pl-12 pr-4 text-sm text-foreground shadow-inner transition-all focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-white/10 dark:bg-white/5" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-500" />
                    <input type="tel" className="w-full rounded-2xl border border-zinc-200 bg-zinc-100 py-3.5 pl-12 pr-4 text-sm text-foreground shadow-inner transition-all focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-white/10 dark:bg-white/5" value={form.phoneNumber} onChange={(e) => updateField("phoneNumber", e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Username
                  </label>
                  <div className="relative">
                    <AtSign className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-500" />
                    <input required type="text" className="w-full rounded-2xl border border-zinc-200 bg-zinc-100 py-3.5 pl-12 pr-4 text-sm text-foreground shadow-inner transition-all focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-white/10 dark:bg-white/5" value={form.username} onChange={(e) => updateField("username", e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Display Name
                  </label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-500" />
                    <input type="text" className="w-full rounded-2xl border border-zinc-200 bg-zinc-100 py-3.5 pl-12 pr-4 text-sm text-foreground shadow-inner transition-all focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-white/10 dark:bg-white/5" value={form.displayName} onChange={(e) => updateField("displayName", e.target.value)} />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="ml-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                      Company
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-500" />
                      <select className="w-full appearance-none rounded-2xl border border-zinc-200 bg-zinc-100 py-3.5 pl-12 pr-10 text-sm text-foreground shadow-inner transition-all focus:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-white/10 dark:bg-[#111216]" value={form.companyId} onChange={(e) => updateField("companyId", e.target.value)}>
                        <option value="">Select company</option>
                        {companies.map((company) => (
                          <option key={company.id} value={company.id}>
                            {company.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="ml-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
                      <select className="w-full appearance-none rounded-2xl border border-zinc-200 bg-zinc-100 py-3.5 pl-12 pr-10 text-sm text-foreground shadow-inner transition-all focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-[#111216]" value={form.locationId} onChange={(e) => updateField("locationId", e.target.value)}>
                        <option value="">Select location</option>
                        {locations.map((location) => (
                          <option key={location.id} value={location.id}>
                            {location.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    </div>
                  </div>
                </div>

                <label className="flex items-center gap-3 pt-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-white/10 bg-white/5" checked={form.loginEnabled} onChange={(e) => updateField("loginEnabled", e.target.checked)} />
                  <span className="text-sm text-zinc-400">Login Enabled</span>
                </label>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-zinc-200 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-[#111216]">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-500">
                  Optional Password Reset
                </p>
                <h2 className="mt-1 text-xl font-semibold text-foreground">
                  Update Credentials
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-2">
                <label className="ml-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-500" />
                  <input type={showPassword ? "text" : "password"} placeholder="Leave blank to keep current password" className="w-full rounded-2xl border border-zinc-200 bg-zinc-100 py-3.5 pl-12 pr-12 text-sm text-foreground shadow-inner transition-all placeholder:text-zinc-400 focus:border-rose-500/50 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-zinc-600" value={form.password} onChange={(e) => updateField("password", e.target.value)} />
                  <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-foreground dark:hover:text-white">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-500" />
                  <input type={showConfirmPassword ? "text" : "password"} placeholder="Repeat new password" className={`w-full rounded-2xl bg-zinc-100 py-3.5 pl-12 pr-12 text-sm text-foreground shadow-inner transition-all placeholder:text-zinc-400 focus:outline-none focus:ring-2 dark:bg-white/5 dark:placeholder:text-zinc-600 ${passwordMismatch ? "border border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : "border border-zinc-200 focus:border-violet-500/50 focus:ring-violet-500/20 dark:border-white/10"}`} value={form.confirmPassword} onChange={(e) => updateField("confirmPassword", e.target.value)} />
                  <button type="button" onClick={() => setShowConfirmPassword((prev) => !prev)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-foreground dark:hover:text-white">
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordMismatch ? (
                  <p className="ml-1 text-xs text-rose-400">
                    Password and confirm password do not match.
                  </p>
                ) : null}
              </div>
            </div>
          </section>

          <div className="flex items-center justify-end gap-4 pt-2">
            <button type="button" onClick={() => router.push("/users")} className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-100 px-6 py-3 text-sm font-bold text-zinc-500 shadow-lg transition-all hover:bg-zinc-200 hover:text-foreground active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white">
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button type="submit" disabled={!canSubmit} className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-3 text-sm font-bold text-white shadow-[0_15px_35px_-10px_rgba(16,185,129,0.5)] transition-all hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100">
              {loading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Save className="h-4 w-4" />}
              <span>{loading ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
