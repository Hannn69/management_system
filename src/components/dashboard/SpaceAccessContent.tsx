"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AddPeopleModal } from "@/components/dashboard/AddPeopleModal";

type AccessMember = {
  id: number;
  email: string;
  role: string;
  isOwner?: boolean;
};

type AccessInvite = {
  id: number;
  email: string;
  status: string;
};

type SpaceAccessContentProps = {
  spaceId: string;
  spaceName?: string;
};

export function SpaceAccessContent({
  spaceId,
  spaceName,
}: SpaceAccessContentProps) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<AccessMember[]>([]);
  const [invites, setInvites] = useState<AccessInvite[]>([]);
  const [accessType, setAccessType] = useState("Open");
  const [search, setSearch] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [cancelingInviteId, setCancelingInviteId] = useState<number | null>(
    null
  );
  const [isOwner, setIsOwner] = useState(false);
  const [roleMenuId, setRoleMenuId] = useState<number | null>(null);
  const [busyMemberId, setBusyMemberId] = useState<number | null>(null);
  const [confirmRemoveId, setConfirmRemoveId] = useState<number | null>(null);
  const [confirmRemoveInput, setConfirmRemoveInput] = useState("");

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return members;
    }
    return members.filter(
      (member) =>
        member.email.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query)
    );
  }, [members, search]);

  useEffect(() => {
    let active = true;
    const loadAccess = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${apiBase}/space/${spaceId}/access`, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to load access.");
        }
        const data = await res.json();
        if (!active) {
          return;
        }
        const owner = data.owner
          ? [
              {
                id: data.owner.id,
                email: data.owner.email,
                role: data.owner.role ?? "Administrator",
                isOwner: true,
              },
            ]
          : [];
        const restMembers = Array.isArray(data.members) ? data.members : [];
        setMembers([
          ...owner,
          ...restMembers.map((member: AccessMember) => ({
            ...member,
            isOwner: false,
          })),
        ]);
        setInvites(Array.isArray(data.invites) ? data.invites : []);
        setAccessType(data.space?.access ?? "Open");
        setIsOwner(Boolean(data.isOwner));
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    loadAccess();
    return () => {
      active = false;
    };
  }, [apiBase, spaceId]);

  const handleInvite = async () => {
    const email = inviteEmail.trim();
    if (!email) {
      setInviteError("Email is required.");
      return;
    }
    setInviting(true);
    setInviteError(null);
    try {
      const res = await fetch(`${apiBase}/space/${spaceId}/invite`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to invite.");
      }
      setInviteEmail("");
      // reload
      const accessRes = await fetch(`${apiBase}/space/${spaceId}/access`, {
        credentials: "include",
      });
      if (accessRes.ok) {
        const accessData = await accessRes.json();
        const owner = accessData.owner
          ? [
              {
                id: accessData.owner.id,
                email: accessData.owner.email,
                role: accessData.owner.role ?? "Administrator",
              },
            ]
          : [];
        const restMembers = Array.isArray(accessData.members)
          ? accessData.members
          : [];
        setMembers([...owner, ...restMembers]);
        setInvites(
          Array.isArray(accessData.invites) ? accessData.invites : []
        );
        setAccessType(accessData.space?.access ?? "Open");
      }
    } catch (err) {
      setInviteError(err instanceof Error ? err.message : "Failed to invite.");
    } finally {
      setInviting(false);
    }
  };

  const handleCancelInvite = async (inviteId: number) => {
    if (!inviteId) {
      return;
    }
    setCancelingInviteId(inviteId);
    setInviteError(null);
    try {
      const res = await fetch(`${apiBase}/space/invite/cancel`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to cancel invite.");
      }
      await refreshAccess();
    } catch (err) {
      setInviteError(
        err instanceof Error ? err.message : "Failed to cancel invite."
      );
    } finally {
      setCancelingInviteId(null);
    }
  };

  const handleUpdateRole = async (memberId: number, role: string) => {
    if (!memberId || !role) {
      return;
    }
    setBusyMemberId(memberId);
    setInviteError(null);
    try {
      const res = await fetch(`${apiBase}/space/member/role`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spaceId, memberId, role }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to update role.");
      }
      await refreshAccess();
      setRoleMenuId(null);
    } catch (err) {
      setInviteError(
        err instanceof Error ? err.message : "Failed to update role."
      );
    } finally {
      setBusyMemberId(null);
    }
  };

  const handleRemoveMember = async (memberId: number) => {
    if (!memberId) {
      return;
    }
    setConfirmRemoveId(memberId);
    setConfirmRemoveInput("");
  };

  const handleConfirmRemove = async () => {
    if (!confirmRemoveId) {
      return;
    }
    if (confirmRemoveInput.trim().toLowerCase() !== "remove") {
      setInviteError("Type REMOVE to confirm.");
      return;
    }
    const memberId = confirmRemoveId;
    setBusyMemberId(memberId);
    setInviteError(null);
    try {
      const res = await fetch(`${apiBase}/space/member/remove`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spaceId, memberId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to remove member.");
      }
      await refreshAccess();
    } catch (err) {
      setInviteError(
        err instanceof Error ? err.message : "Failed to remove member."
      );
    } finally {
      setBusyMemberId(null);
      setConfirmRemoveId(null);
    }
  };

  const refreshAccess = async () => {
    try {
      const accessRes = await fetch(`${apiBase}/space/${spaceId}/access`, {
        credentials: "include",
      });
      if (accessRes.ok) {
        const accessData = await accessRes.json();
        const owner = accessData.owner
          ? [
              {
                id: accessData.owner.id,
                email: accessData.owner.email,
                role: accessData.owner.role ?? "Administrator",
                isOwner: true,
              },
            ]
          : [];
        const restMembers = Array.isArray(accessData.members)
          ? accessData.members
          : [];
        setMembers([
          ...owner,
          ...restMembers.map((member: AccessMember) => ({
            ...member,
            isOwner: false,
          })),
        ]);
        setInvites(
          Array.isArray(accessData.invites) ? accessData.invites : []
        );
        setAccessType(accessData.space?.access ?? "Open");
        setIsOwner(Boolean(accessData.isOwner));
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs text-gray-500">
          Spaces / {spaceName ?? "Space"} / Space settings
        </p>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-gray-900">Access</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-lg bg-blue-500 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-400"
              onClick={() => setAddOpen(true)}
              disabled={!isOwner}
            >
              Add people
            </button>
            <button
              type="button"
              className="rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-200"
              disabled={!isOwner}
            >
              Manage roles
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-black/40 p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Space access
              </p>
              <p className="mt-2 text-sm text-gray-600">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-gray-200 text-xs text-gray-500">
                  i
                </span>{" "}
                This space has 1 role
              </p>
            </div>
            <button
              type="button"
              className="rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-xs text-gray-800 hover:bg-gray-200"
              disabled={!isOwner}
            >
              Change space access
            </button>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-100 px-4 py-3">
            <div className="text-sm font-semibold text-gray-900">
              {accessType}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Anyone with access can search for, view, create and edit this
              space&apos;s issues.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <button className="text-blue-700">Current users</button>
            <button className="text-gray-500">
              Access requests{" "}
              <span className="ml-2 rounded-full border border-gray-200 px-2 py-0.5 text-[10px] text-gray-600">
                0
              </span>
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-600 sm:max-w-[320px]">
              <Search className="h-4 w-4 text-gray-500" />
              <input
                className="w-full bg-transparent text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none"
                placeholder="Search roles"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-xs text-gray-800">
                Roles
              </div>
              {isOwner ? (
                <input
                  className="rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-xs text-gray-800"
                  placeholder="Invite by email"
                  value={inviteEmail}
                  onChange={(event) => setInviteEmail(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleInvite();
                    }
                  }}
                />
              ) : (
                <div className="rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-xs text-gray-500">
                  Invite by email
                </div>
              )}
            </div>
          </div>

          {inviteError ? (
            <p className="text-xs text-rose-700">{inviteError}</p>
          ) : null}

          <div className="overflow-visible rounded-xl border border-gray-200">
            <div className="grid grid-cols-[1.5fr_2fr_1fr_1fr] gap-2 border-b border-gray-200 bg-gray-100 px-4 py-3 text-xs uppercase tracking-[0.22em] text-gray-500">
              <span>Name</span>
              <span>Email</span>
              <span>Role</span>
              <span>Action</span>
            </div>
            {loading ? (
              <div className="px-4 py-6 text-sm text-gray-500">
                Loading access...
              </div>
            ) : null}
            {!loading && !filteredMembers.length ? (
              <div className="px-4 py-6 text-sm text-gray-500">
                No users found.
              </div>
            ) : null}
            {filteredMembers.map((member) => (
              <div
                key={`${member.id}-${member.email}`}
                className="grid grid-cols-[1.5fr_2fr_1fr_1fr] gap-2 border-b border-gray-200 px-4 py-3 text-sm text-gray-800"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/20 text-xs text-rose-700">
                    {member.email.slice(0, 1).toUpperCase()}
                  </span>
                  <span>{member.email.split("@")[0]}</span>
                  {member.isOwner ? (
                    <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                      Owner
                    </span>
                  ) : null}
                </div>
                <div>{member.email}</div>
                <div>{member.role}</div>
                {member.isOwner ? (
                  <span className="text-xs text-gray-500">—</span>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <button
                        type="button"
                        className="rounded-full border border-blue-400/40 bg-blue-500/10 px-3 py-1 text-xs text-blue-700 hover:bg-blue-500/20"
                        disabled={!isOwner}
                        aria-label="Change role"
                        onClick={() =>
                          setRoleMenuId((prev) =>
                            prev === member.id ? null : member.id
                          )
                        }
                      >
                        Role
                      </button>
                      {roleMenuId === member.id ? (
                        <div className="absolute right-0 z-20 mt-2 w-32 rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
                          {[
                            { label: "Administrator", value: "admin" },
                            { label: "Member", value: "member" },
                            { label: "Viewer", value: "viewer" },
                          ].map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              className="flex w-full items-center rounded-md px-2 py-1 text-xs text-gray-800 hover:bg-gray-200"
                              onClick={() =>
                                handleUpdateRole(member.id, option.value)
                              }
                              disabled={busyMemberId === member.id}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      className="rounded-full border border-rose-400/40 bg-rose-500/10 px-3 py-1 text-xs text-rose-700 hover:bg-rose-500/20"
                      disabled={!isOwner || busyMemberId === member.id}
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      {busyMemberId === member.id ? "Removing..." : "Remove"}
                    </button>
                  </div>
                )}
              </div>
            ))}
            {invites.length ? (
              <div className="border-t border-gray-200">
                <div className="px-4 py-2 text-xs uppercase tracking-[0.22em] text-gray-500">
                  Pending invites
                </div>
                {invites.map((invite) => (
                  <div
                    key={`invite-${invite.id}`}
                    className="grid grid-cols-[1.5fr_2fr_1fr_1fr] gap-2 border-t border-gray-200 px-4 py-3 text-sm text-gray-800"
                  >
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-xs text-blue-700">
                        {invite.email.slice(0, 1).toUpperCase()}
                      </span>
                      {invite.email.split("@")[0]}
                    </div>
                    <div className="text-gray-600">{invite.email}</div>
                    <div className="text-gray-500">Pending</div>
                    {isOwner ? (
                      <button
                        type="button"
                        className="text-xs text-rose-700 hover:text-rose-700"
                        onClick={() => handleCancelInvite(invite.id)}
                        disabled={cancelingInviteId === invite.id}
                      >
                        {cancelingInviteId === invite.id
                          ? "Canceling..."
                          : "Cancel"}
                      </button>
                    ) : (
                      <span className="text-xs text-gray-500">Pending</span>
                    )}
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {error ? (
            <p className="text-xs text-rose-700">{error}</p>
          ) : null}
        </div>
      </div>
      <AddPeopleModal
        open={addOpen}
        spaceId={spaceId}
        spaceName={spaceName}
        onClose={() => setAddOpen(false)}
        onInvited={refreshAccess}
      />
      {confirmRemoveId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Remove member
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  This will remove the user from the space. To confirm, type{" "}
                  <span className="font-semibold text-gray-800">remove</span>.
                </p>
              </div>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-800"
                onClick={() => setConfirmRemoveId(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <input
              className="mt-4 w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-900"
              placeholder="Type remove"
              value={confirmRemoveInput}
              onChange={(event) => setConfirmRemoveInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleConfirmRemove();
                }
              }}
            />
            {confirmRemoveInput.trim() &&
            confirmRemoveInput.trim().toLowerCase() !== "remove" ? (
              <p className="mt-2 text-xs text-rose-700">
                Type REMOVE to confirm.
              </p>
            ) : null}
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                className="rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-xs text-gray-800 hover:bg-gray-200"
                onClick={() => setConfirmRemoveId(null)}
                disabled={busyMemberId === confirmRemoveId}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-lg bg-rose-500 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-400 disabled:opacity-60"
                onClick={handleConfirmRemove}
                disabled={
                  busyMemberId === confirmRemoveId ||
                  confirmRemoveInput.trim().toLowerCase() !== "remove"
                }
              >
                {busyMemberId === confirmRemoveId ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
