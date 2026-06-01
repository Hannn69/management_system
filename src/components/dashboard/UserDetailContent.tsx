"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Edit2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import { ApiUserRecord, getUserFullName } from "@/lib/users";

type UserDetailRecord = ApiUserRecord & {
  createdAt?: string;
  updatedAt?: string;
};

export function UserDetailContent() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [record, setRecord] = useState<UserDetailRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    if (!params.id) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/users/${params.id}`, {
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to fetch user.");
      }

      const data = await res.json();
      setRecord(data.record || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch user.");
      setRecord(null);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (loading) {
    return (
      <div className="flex h-[420px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !record) {
    return (
      <main className="px-6 pb-6 pt-5">
        <div className="mx-auto flex w-full max-w-[1380px] flex-col gap-6">
          <button
            type="button"
            onClick={() => router.push("/users")}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </button>
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6 text-sm text-rose-300">
            {error || "User not found."}
          </div>
        </div>
      </main>
    );
  }

  const companyName =
    typeof record.company === "string"
      ? record.company
      : record.company?.name || "Not assigned";
  const locationName =
    typeof record.location === "string"
      ? record.location
      : record.location?.name || "Not assigned";

  return (
    <main className="px-6 pb-6 pt-5">
      <div className="mx-auto flex w-full max-w-[1380px] flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => router.push("/users")}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </button>
          <button
            type="button"
            onClick={() => router.push(`/users/${record.id}/edit`)}
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            <Edit2 className="h-4 w-4" />
            Edit User
          </button>
        </div>

        <section className="rounded-[28px] border border-white/10 bg-[#111216] p-8 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-500 text-black shadow-lg">
                <User className="h-8 w-8" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-zinc-500">
                  User Profile
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  {getUserFullName(record)}
                </h2>
                <p className="mt-1 text-sm text-zinc-400">@{record.username}</p>
              </div>
            </div>
            <span
              className={`inline-flex w-fit items-center rounded-xl border px-3 py-1.5 text-xs font-bold ${
                record.loginEnabled
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                  : "border-zinc-500/20 bg-zinc-500/10 text-zinc-400"
              }`}
            >
              <ShieldCheck className="mr-1.5 h-4 w-4" />
              {record.loginEnabled ? "Login Enabled" : "Login Disabled"}
            </span>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <DetailCard
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              value={record.email}
            />
            <DetailCard
              icon={<Phone className="h-4 w-4" />}
              label="Phone"
              value={record.phoneNumber || record.phone || "Not provided"}
            />
            <DetailCard
              icon={<User className="h-4 w-4" />}
              label="Display Name"
              value={record.displayName || "Not provided"}
            />
            <DetailCard
              icon={<Building2 className="h-4 w-4" />}
              label="Company"
              value={companyName}
            />
            <DetailCard
              icon={<MapPin className="h-4 w-4" />}
              label="Location"
              value={locationName}
            />
            <DetailCard
              icon={<ShieldCheck className="h-4 w-4" />}
              label="User ID"
              value={String(record.id)}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function DetailCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
        <span className="text-cyan-400">{icon}</span>
        {label}
      </div>
      <p className="mt-3 break-words text-sm font-medium text-zinc-100">
        {value}
      </p>
    </div>
  );
}
