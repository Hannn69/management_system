import { NextRequest, NextResponse } from "next/server";
import {
  AAS_PKCE_COOKIE,
  getAasClient,
  getAllowedEmailDomain,
  isAasConfigured,
  readPkceCookie,
  readState,
  signAssertion,
} from "@/lib/aas";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  SessionUser,
  getAccessTokenMaxAge,
  getCookieOptions,
  getRefreshTokenMaxAge,
  signAccessToken,
  signRefreshToken,
} from "@/lib/auth";

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";

const SESSION_EXPIRED = "Invalid or expired login session. Please try again.";

function fail(message: string, status: number) {
  const response = NextResponse.json({ message }, { status });
  // The code_verifier is single-use: drop it whatever happened.
  response.cookies.set(AAS_PKCE_COOKIE, "", { ...getCookieOptions(0), maxAge: 0 });
  return response;
}

// AAS login, step 2: the /auth/callback page posts the { code, state } the provider gave the browser.
export async function POST(request: NextRequest) {
  if (!isAasConfigured()) {
    return fail("AAS sign-in is not configured.", 503);
  }

  try {
    const body = (await request.json().catch(() => ({}))) as { code?: unknown; state?: unknown };
    if (typeof body.code !== "string" || typeof body.state !== "string" || !body.code || !body.state) {
      return fail("Missing sign-in details from AAS. Please try again.", 400);
    }

    const pkceCookie = request.cookies.get(AAS_PKCE_COOKIE)?.value;
    if (!pkceCookie) return fail(SESSION_EXPIRED, 401);

    let codeVerifier: string;
    try {
      const nonce = await readState(body.state);
      const pkce = await readPkceCookie(pkceCookie);
      if (pkce.nonce !== nonce) return fail(SESSION_EXPIRED, 401);
      codeVerifier = pkce.codeVerifier;
    } catch {
      return fail(SESSION_EXPIRED, 401);
    }

    const result = await getAasClient().validateAuthorizationCode({ code: body.code, codeVerifier });
    if (!result.success || !result.data.isValid || !result.data.payload) {
      return fail("AAS authentication failed. Please try again.", 401);
    }

    const email = result.data.payload.email?.trim().toLowerCase();
    const domain = getAllowedEmailDomain();
    if (!email || (domain && !email.endsWith(domain))) {
      return fail(`Only ${domain || "approved"} accounts can sign in with AAS.`, 403);
    }

    const lookup = await fetch(`${apiBase}/auth/aas-lookup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assertion: await signAssertion(email) }),
      cache: "no-store",
    }).catch(() => null);

    if (!lookup) return fail("The authentication service is unreachable.", 502);
    if (!lookup.ok) {
      const data = (await lookup.json().catch(() => ({}))) as { message?: string };
      const status = lookup.status === 403 ? 403 : 401;
      return fail(data.message || "AAS sign-in failed. Please try again.", status);
    }

    const { user: account } = (await lookup.json()) as {
      user: {
        id: number | string;
        email: string;
        username?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        displayName?: string | null;
      };
    };

    const user: SessionUser = {
      id: String(account.id),
      email: account.email,
      username: account.username || account.email,
      firstName: account.firstName || null,
      lastName: account.lastName || null,
      displayName: account.displayName || null,
    };

    const [accessToken, refreshToken] = await Promise.all([signAccessToken(user), signRefreshToken(user)]);

    const response = NextResponse.json({ user, authenticated: true });
    response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, getCookieOptions(getAccessTokenMaxAge()));
    response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, getCookieOptions(getRefreshTokenMaxAge()));
    response.cookies.set(AAS_PKCE_COOKIE, "", { ...getCookieOptions(0), maxAge: 0 });
    return response;
  } catch (error) {
    console.error("AAS sign-in failed", error);
    return fail("AAS sign-in failed. Please try again.", 500);
  }
}
