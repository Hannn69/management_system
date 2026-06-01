import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  verifySessionToken,
} from "@/lib/auth";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  try {
    if (accessToken) {
      const payload = await verifySessionToken(accessToken, "access");
      return NextResponse.json({ authenticated: true, user: payload.user });
    }

    if (refreshToken) {
      const payload = await verifySessionToken(refreshToken, "refresh");
      return NextResponse.json({ authenticated: true, user: payload.user });
    }
  } catch {
    // fall through
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
