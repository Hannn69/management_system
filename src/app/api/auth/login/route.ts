import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  getAccessTokenMaxAge,
  getCookieOptions,
  getRefreshTokenMaxAge,
  signAccessToken,
  signRefreshToken,
} from "@/lib/auth";
import { validateUserCredentials } from "@/lib/auth-backend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim();
    const password = String(body.password || "");
    const rememberMe = body.rememberMe === true;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await validateUserCredentials(email, password);

    if (!user) {
      return NextResponse.json(
        { message: "Incorrect email or password." },
        { status: 401 }
      );
    }

    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken(user),
      signRefreshToken(user, rememberMe),
    ]);

    const response = NextResponse.json({
      user,
      authenticated: true,
    });

    response.cookies.set(
      ACCESS_TOKEN_COOKIE,
      accessToken,
      getCookieOptions(rememberMe ? getAccessTokenMaxAge() : undefined)
    );
    response.cookies.set(
      REFRESH_TOKEN_COOKIE,
      refreshToken,
      getCookieOptions(rememberMe ? getRefreshTokenMaxAge() : undefined)
    );

    return response;
  } catch (error) {
    console.error("Login failed", error);
    return NextResponse.json(
      { message: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
