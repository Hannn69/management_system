import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { hash } from "bcryptjs";

export interface StoredUserRecord {
  id: number;
  slug: string;
  email: string;
  username: string;
  passwordHash: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  loginEnabled: boolean;
  companyId: number | null;
  locationId: number | null;
  createdAt: string;
  updatedAt: string;
}

export type PublicUserRecord = Omit<StoredUserRecord, "passwordHash">;

interface UserStoreFile {
  initializedFromBackend: boolean;
  users: StoredUserRecord[];
}

interface ListUsersOptions {
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

interface CreateUserInput {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  phoneNumber?: string;
  loginEnabled?: boolean;
  companyId?: number | null;
  locationId?: number | null;
}

interface UpdateUserInput {
  email?: string;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  phoneNumber?: string;
  loginEnabled?: boolean;
  companyId?: number | null;
  locationId?: number | null;
}

function getSortableValue(user: StoredUserRecord, sort: string) {
  switch (sort) {
    case "firstName":
      return `${user.firstName || ""} ${user.lastName || ""}`.trim();
    case "email":
      return user.email;
    case "username":
      return user.username;
    case "createdAt":
      return user.createdAt;
    case "updatedAt":
      return user.updatedAt;
    default:
      return String((user as StoredUserRecord & Record<string, unknown>)[sort] ?? "");
  }
}

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
const dataDir = path.join(process.cwd(), ".data");
const usersFile = path.join(dataDir, "users.json");

async function ensureDataDir() {
  await mkdir(dataDir, { recursive: true });
}

async function fetchBackendUsers(): Promise<StoredUserRecord[]> {
  const params = new URLSearchParams({
    page: "1",
    limit: "500",
    sort: "createdAt",
    order: "desc",
    search: "",
  });
  const response = await fetch(`${apiBase}/users?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to fetch backend users.");
  }

  const data = await response.json();
  const records = Array.isArray(data.records) ? data.records : [];

  return records.map((record: Partial<StoredUserRecord> & { email: string; username: string }) => ({
    id: Number(record.id),
    slug: String(record.slug || randomUUID()),
    email: record.email,
    username: record.username,
    passwordHash: String(record.passwordHash || ""),
    firstName: record.firstName ?? null,
    lastName: record.lastName ?? null,
    displayName: record.displayName ?? null,
    phoneNumber: record.phoneNumber ?? null,
    loginEnabled: record.loginEnabled ?? true,
    companyId: record.companyId ?? null,
    locationId: record.locationId ?? null,
    createdAt: String(record.createdAt || new Date().toISOString()),
    updatedAt: String(record.updatedAt || new Date().toISOString()),
  }));
}

async function readStore(): Promise<UserStoreFile> {
  await ensureDataDir();

  try {
    const raw = await readFile(usersFile, "utf8");
    return JSON.parse(raw) as UserStoreFile;
  } catch {
    const initialUsers = await fetchBackendUsers().catch(() => []);
    const initialStore: UserStoreFile = {
      initializedFromBackend: true,
      users: initialUsers,
    };
    await writeStore(initialStore);
    return initialStore;
  }
}

async function writeStore(store: UserStoreFile) {
  await ensureDataDir();
  await writeFile(usersFile, JSON.stringify(store, null, 2), "utf8");
}

export async function listStoredUsers(options: ListUsersOptions = {}) {
  const {
    search = "",
    page = 1,
    limit = 10,
    sort = "createdAt",
    order = "desc",
  } = options;

  const store = await readStore();
  const query = search.trim().toLowerCase();

  const filtered = store.users.filter((user) => {
    if (!query) {
      return true;
    }

    return [
      user.email,
      user.username,
      user.firstName || "",
      user.lastName || "",
      user.displayName || "",
    ]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  const sorted = [...filtered].sort((a, b) => {
    const aValue = getSortableValue(a, sort);
    const bValue = getSortableValue(b, sort);
    return order === "asc"
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  const start = (page - 1) * limit;
  const records = sorted.slice(start, start + limit);

  return {
    records,
    total: filtered.length,
  };
}

export async function getStoredUserById(id: string | number) {
  const store = await readStore();
  return store.users.find((user) => String(user.id) === String(id)) || null;
}

export async function getStoredUserByEmail(email: string) {
  const store = await readStore();
  return (
    store.users.find(
      (user) => user.email.toLowerCase() === email.trim().toLowerCase()
    ) || null
  );
}

export async function createStoredUser(input: CreateUserInput) {
  const store = await readStore();

  if (
    store.users.some(
      (user) =>
        user.email.toLowerCase() === input.email.toLowerCase() ||
        user.username.toLowerCase() === input.username.toLowerCase()
    )
  ) {
    throw new Error("User with that email or username already exists.");
  }

  const now = new Date().toISOString();
  const passwordHash = await hash(input.password, 12);
  const nextId =
    store.users.reduce((max, user) => Math.max(max, Number(user.id)), 0) + 1;

  const record: StoredUserRecord = {
    id: nextId,
    slug: randomUUID(),
    email: input.email.trim(),
    username: input.username.trim(),
    passwordHash,
    firstName: input.firstName?.trim() || null,
    lastName: input.lastName?.trim() || null,
    displayName: input.displayName?.trim() || null,
    phoneNumber: input.phoneNumber?.trim() || null,
    loginEnabled: input.loginEnabled ?? true,
    companyId: input.companyId ?? null,
    locationId: input.locationId ?? null,
    createdAt: now,
    updatedAt: now,
  };

  store.users.unshift(record);
  await writeStore(store);
  return record;
}

export async function updateStoredUser(id: string | number, input: UpdateUserInput) {
  const store = await readStore();
  const index = store.users.findIndex((user) => String(user.id) === String(id));

  if (index === -1) {
    return null;
  }

  const current = store.users[index];

  if (
    input.email &&
    store.users.some(
      (user) =>
        user.id !== current.id &&
        user.email.toLowerCase() === input.email!.toLowerCase()
    )
  ) {
    throw new Error("Another user already uses that email.");
  }

  if (
    input.username &&
    store.users.some(
      (user) =>
        user.id !== current.id &&
        user.username.toLowerCase() === input.username!.toLowerCase()
    )
  ) {
    throw new Error("Another user already uses that username.");
  }

  let passwordHash = current.passwordHash;
  if (input.password) {
    passwordHash = await hash(input.password, 12);
  }

  const updated: StoredUserRecord = {
    ...current,
    email: input.email?.trim() || current.email,
    username: input.username?.trim() || current.username,
    passwordHash,
    firstName:
      input.firstName !== undefined ? input.firstName.trim() || null : current.firstName,
    lastName:
      input.lastName !== undefined ? input.lastName.trim() || null : current.lastName,
    displayName:
      input.displayName !== undefined
        ? input.displayName.trim() || null
        : current.displayName,
    phoneNumber:
      input.phoneNumber !== undefined
        ? input.phoneNumber.trim() || null
        : current.phoneNumber,
    loginEnabled:
      input.loginEnabled !== undefined ? input.loginEnabled : current.loginEnabled,
    companyId: input.companyId !== undefined ? input.companyId : current.companyId,
    locationId:
      input.locationId !== undefined ? input.locationId : current.locationId,
    updatedAt: new Date().toISOString(),
  };

  store.users[index] = updated;
  await writeStore(store);
  return updated;
}

export async function deleteStoredUser(id: string | number) {
  const store = await readStore();
  const nextUsers = store.users.filter((user) => String(user.id) !== String(id));

  if (nextUsers.length === store.users.length) {
    return false;
  }

  store.users = nextUsers;
  await writeStore(store);
  return true;
}

export function toPublicUserRecord(user: StoredUserRecord): PublicUserRecord {
  const { passwordHash, ...record } = user;
  void passwordHash;
  return record;
}
