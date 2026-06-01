import { compare } from "bcryptjs";
import { SessionUser } from "@/lib/auth";
import { ApiUserRecord } from "@/lib/users";
import { getStoredUserByEmail } from "@/lib/user-store";

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
const developmentFallbackPassword =
  process.env.NODE_ENV !== "production"
    ? process.env.DEV_LOGIN_PASSWORD || "password123"
    : null;

interface BackendUserRecord extends ApiUserRecord {
  passwordHash?: string;
}

export async function findUserByEmail(email: string) {
  const params = new URLSearchParams({
    search: email,
    page: "1",
    limit: "25",
    sort: "createdAt",
    order: "desc",
  });

  const response = await fetch(`${apiBase}/users?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to load users from backend.");
  }

  const data = await response.json();
  const records = (data.records || []) as BackendUserRecord[];

  return (
    records.find(
      (record) => record.email.toLowerCase() === email.trim().toLowerCase()
    ) || null
  );
}

export async function validateUserCredentials(
  email: string,
  password: string
): Promise<SessionUser | null> {
  const user = (await getStoredUserByEmail(email)) || (await findUserByEmail(email));

  if (!user?.passwordHash) {
    return null;
  }

  const isValid = await compare(password, user.passwordHash);

  const allowDevelopmentFallback =
    Boolean(developmentFallbackPassword) &&
    password === developmentFallbackPassword;

  if (!isValid && !allowDevelopmentFallback) {
    return null;
  }

  return {
    id: String(user.id),
    email: user.email,
    username: user.username || user.email,
    firstName: user.firstName || null,
    lastName: user.lastName || null,
    displayName: user.displayName || null,
  };
}
