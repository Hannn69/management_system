"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ImageUpload } from "@/components/ui/ImageUpload";
import {
  Building2,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  User,
  Users,
  X,
} from "lucide-react";

const departmentOptions = [
  "Administration",
  "Finance",
  "Human Resources",
  "IT Support",
  "Operations",
  "Procurement",
];

const seedUsers = [
  {
    id: "1",
    profilePicture: null,
    fullNameEn: "Sonvirak Kim",
    fullNameKh: "",
    gender: "Male",
    phoneNumber: "012 345 678",
    generalDepartment: "Corporate Services",
    department: "Administration",
    office: "Head Office",
    currentRole: "Asset Control",
    email: "sonvirak@management.local",
    password: "password123",
    confirmPassword: "password123",
  },
  {
    id: "2",
    profilePicture: null,
    fullNameEn: "Dara Sok",
    fullNameKh: "",
    gender: "Female",
    phoneNumber: "086 222 111",
    generalDepartment: "Operations",
    department: "Operations",
    office: "Branch Office",
    currentRole: "Request Review",
    email: "dara.sok@management.local",
    password: "password123",
    confirmPassword: "password123",
  },
];

const fallbackUser = {
  profilePicture: null as string | null,
  fullNameEn: "",
  fullNameKh: "",
  gender: "",
  phoneNumber: "",
  generalDepartment: "",
  department: "",
  office: "",
  currentRole: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function EditUserContent() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const initialUser = useMemo(
    () => seedUsers.find((user) => user.id === params.id) ?? fallbackUser,
    [params.id]
  );

  const [form, setForm] = useState(initialUser);

  const passwordMismatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordMismatch) {
      return;
    }
    router.push("/users");
  };

  return (
    <main className="px-6 pb-6 pt-5">
      <div className="mx-auto flex w-full max-w-[1380px] flex-col gap-6">
        <form onSubmit={handleSubmit} className="space-y-6 pb-12">
          <section className="rounded-[28px] border border-zinc-200 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-[#111216]">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-500">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-500">
                  Personal Information
                </p>
                <h2 className="mt-1 text-xl font-semibold text-foreground">
                  User Profile Details
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-5">
                <ImageUpload
                  value={form.profilePicture}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, profilePicture: value }))
                  }
                  label="Profile Picture"
                />

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Full Name in English
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-500" />
                    <input
                      required
                      type="text"
                      placeholder="e.g. Sok Dara"
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-100 py-3.5 pl-12 pr-4 text-sm text-foreground shadow-inner transition-all placeholder:text-zinc-400 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-zinc-600"
                      value={form.fullNameEn}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          fullNameEn: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Full Name in Khmer
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
                    <input
                      type="text"
                      placeholder="Khmer full name"
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-100 py-3.5 pl-12 pr-4 text-sm text-foreground shadow-inner transition-all placeholder:text-zinc-400 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-zinc-600"
                      value={form.fullNameKh}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          fullNameKh: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Gender
                  </label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-500" />
                    <select
                      className="w-full appearance-none rounded-2xl border border-zinc-200 bg-zinc-100 py-3.5 pl-12 pr-10 text-sm text-foreground shadow-inner transition-all focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-white/10 dark:bg-[#111216]"
                      value={form.gender}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, gender: e.target.value }))
                      }
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-500" />
                    <input
                      type="tel"
                      placeholder="e.g. 012 345 678"
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-100 py-3.5 pl-12 pr-4 text-sm text-foreground shadow-inner transition-all placeholder:text-zinc-400 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-zinc-600"
                      value={form.phoneNumber}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          phoneNumber: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    General Department
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-500" />
                    <input
                      type="text"
                      placeholder="e.g. Corporate Services"
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-100 py-3.5 pl-12 pr-4 text-sm text-foreground shadow-inner transition-all placeholder:text-zinc-400 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-zinc-600"
                      value={form.generalDepartment}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          generalDepartment: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Department
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-500" />
                    <select
                      className="w-full appearance-none rounded-2xl border border-zinc-200 bg-zinc-100 py-3.5 pl-12 pr-10 text-sm text-foreground shadow-inner transition-all focus:border-rose-500/50 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-white/10 dark:bg-[#111216]"
                      value={form.department}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          department: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select department</option>
                      {departmentOptions.map((department) => (
                        <option key={department} value={department}>
                          {department}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Office
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-500" />
                    <input
                      type="text"
                      placeholder="e.g. Head Office"
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-100 py-3.5 pl-12 pr-4 text-sm text-foreground shadow-inner transition-all placeholder:text-zinc-400 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-zinc-600"
                      value={form.office}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, office: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Current Role
                  </label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-500" />
                    <input
                      type="text"
                      placeholder="e.g. Inventory Supervisor"
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-100 py-3.5 pl-12 pr-4 text-sm text-foreground shadow-inner transition-all placeholder:text-zinc-400 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-zinc-600"
                      value={form.currentRole}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          currentRole: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-zinc-200 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-[#111216]">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-500">
                  Security Information
                </p>
                <h2 className="mt-1 text-xl font-semibold text-foreground">
                  Login Credentials
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-500" />
                    <input
                      required
                      type="email"
                      placeholder="e.g. user@company.com"
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-100 py-3.5 pl-12 pr-4 text-sm text-foreground shadow-inner transition-all placeholder:text-zinc-400 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-zinc-600"
                      value={form.email}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-500" />
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-100 py-3.5 pl-12 pr-12 text-sm text-foreground shadow-inner transition-all placeholder:text-zinc-400 focus:border-rose-500/50 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-zinc-600"
                      value={form.password}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-foreground dark:hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-500" />
                    <input
                      required
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      className={`w-full rounded-2xl bg-zinc-100 py-3.5 pl-12 pr-12 text-sm text-foreground shadow-inner transition-all placeholder:text-zinc-400 focus:outline-none focus:ring-2 dark:bg-white/5 dark:placeholder:text-zinc-600 ${
                        passwordMismatch
                          ? "border border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                          : "border border-zinc-200 focus:border-violet-500/50 focus:ring-violet-500/20 dark:border-white/10"
                      }`}
                      value={form.confirmPassword}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-foreground dark:hover:text-white"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {passwordMismatch ? (
                    <p className="ml-1 text-xs text-rose-400">
                      Password and confirm password do not match.
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

          <div className="flex items-center justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={() => router.push("/users")}
              className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-100 px-6 py-3 text-sm font-bold text-zinc-500 shadow-lg transition-all hover:bg-zinc-200 hover:text-foreground active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              disabled={passwordMismatch}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-3 text-sm font-bold text-white shadow-[0_15px_35px_-10px_rgba(16,185,129,0.5)] transition-all hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
