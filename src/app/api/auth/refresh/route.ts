import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  getAccessTokenMaxAge,
  getCookieOptions,
  getRefreshTokenMaxAge,
  signAccessToken,
  signRefreshToken,
  verifySessionToken,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: "Missing refresh token." }, { status: 401 });
  }

  try {
    const payload = await verifySessionToken(refreshToken, "refresh");
    const [accessToken, rotatedRefreshToken] = await Promise.all([
      signAccessToken(payload.user),
      signRefreshToken(payload.user),
    ]);

    const response = NextResponse.json({
      user: payload.user,
      authenticated: true,
    });

    response.cookies.set(
      ACCESS_TOKEN_COOKIE,
      accessToken,
      getCookieOptions(getAccessTokenMaxAge())
    );
    response.cookies.set(
      REFRESH_TOKEN_COOKIE,
      rotatedRefreshToken,
      getCookieOptions(getRefreshTokenMaxAge())
    );

    return response;
  } catch {
    const response = NextResponse.json(
      { message: "Refresh token expired." },
      { status: 401 }
    );
    response.cookies.delete(ACCESS_TOKEN_COOKIE);
    response.cookies.delete(REFRESH_TOKEN_COOKIE);
    return response;
  }
}
