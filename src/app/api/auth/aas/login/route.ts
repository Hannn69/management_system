import { NextRequest, NextResponse } from "next/server";
import {
  AAS_PKCE_COOKIE,
  createPkce,
  getAasClient,
  isAasConfigured,
  signPkceCookie,
  signState,
} from "@/lib/aas";
import { getCookieOptions } from "@/lib/auth";

// AAS login, step 1: the login page navigates the browser here, and we send it on to the identity provider.
export async function GET(request: NextRequest) {
  const failTo = (error: string) => NextResponse.redirect(new URL(`/?error=${error}`, request.url));

  if (!isAasConfigured()) {
    return failTo("aas_not_configured");
  }

  try {
    const { nonce, codeVerifier, codeChallenge } = createPkce();
    const state = await signState(nonce);

    const result = await getAasClient().getLoginToken({
      state,
      codeChallenge,
      codeChallengeMethod: "S256",
    });
    if (!result.success) {
      console.error("AAS login could not start:", result.error?.message);
      return failTo("aas_unavailable");
    }

    const response = NextResponse.redirect(result.data.redirectUri);
    response.cookies.set(AAS_PKCE_COOKIE, await signPkceCookie(nonce, codeVerifier), getCookieOptions(5 * 60));
    return response;
  } catch (error) {
    console.error("AAS login could not start", error);
    return failTo("aas_unavailable");
  }
}
