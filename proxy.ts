import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  getAccessTokenMaxAge,
  getCookieOptions,
  signAccessToken,
  verifySessionToken,
} from "@/lib/auth";

const AUTH_ROUTE = "/";
const DEFAULT_PROTECTED_ROUTE = "/dashboard";

function isPublicAsset(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/favicon.ico" ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicAsset(pathname)) {
    return NextResponse.next();
  }

  const isAuthRoute = pathname === AUTH_ROUTE;
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  try {
    if (accessToken) {
      await verifySessionToken(accessToken, "access");
      if (isAuthRoute) {
        return NextResponse.redirect(new URL(DEFAULT_PROTECTED_ROUTE, request.url));
      }
      return NextResponse.next();
    }
  } catch {
    // access token expired or invalid
  }

  if (refreshToken) {
    try {
      const refreshPayload = await verifySessionToken(refreshToken, "refresh");
      const rotatedAccessToken = await signAccessToken(refreshPayload.user);

      const response = isAuthRoute
        ? NextResponse.redirect(new URL(DEFAULT_PROTECTED_ROUTE, request.url))
        : NextResponse.next();

      response.cookies.set(
        ACCESS_TOKEN_COOKIE,
        rotatedAccessToken,
        getCookieOptions(getAccessTokenMaxAge())
      );

      return response;
    } catch {
      const response = isAuthRoute
        ? NextResponse.next()
        : NextResponse.redirect(new URL(AUTH_ROUTE, request.url));
      response.cookies.delete(ACCESS_TOKEN_COOKIE);
      response.cookies.delete(REFRESH_TOKEN_COOKIE);
      return response;
    }
  }

  if (!isAuthRoute) {
    return NextResponse.redirect(new URL(AUTH_ROUTE, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
