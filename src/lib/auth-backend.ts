import { SessionUser } from "@/lib/auth";

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";

interface SignInUser {
  id: number | string;
  email: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
}

/** Checks the credentials against the API, which owns the password hashes. */
export async function validateUserCredentials(
  email: string,
  password: string
): Promise<SessionUser | null> {
  const response = await fetch(`${apiBase}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  if (response.status === 400 || response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Unable to reach the authentication service.");
  }

  const { user } = (await response.json()) as { user: SignInUser };

  return {
    id: String(user.id),
    email: user.email,
    username: user.username || user.email,
    firstName: user.firstName || null,
    lastName: user.lastName || null,
    displayName: user.displayName || null,
  };
}
