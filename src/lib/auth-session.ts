import "server-only";

import { cookies } from "next/headers";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  verifySessionToken,
} from "@/lib/auth";

export async function requireSessionUser() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (accessToken) {
    try {
      const payload = await verifySessionToken(accessToken, "access");
      return payload.user;
    } catch {
      // try refresh token next
    }
  }

  if (refreshToken) {
    try {
      const payload = await verifySessionToken(refreshToken, "refresh");
      return payload.user;
    } catch {
      // no valid session
    }
  }

  return null;
}
