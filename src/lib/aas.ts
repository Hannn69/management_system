// AAS = the Ministry of Commerce identity provider ("Login with AAS Officer Account").
// Server-side only: this module reads MOC_OAUTH_CLIENT_SECRET and must never be imported by client code.
import { createHash, randomBytes } from "crypto";
import { jwtVerify, SignJWT } from "jose";
import { MOCOAuthClient } from "moc-oauth-client";
import { getJwtSecret } from "@/lib/auth";

export const AAS_PKCE_COOKIE = "aasPkce";
const PKCE_TTL = "5m";

export function isAasConfigured() {
  return Boolean(
    process.env.MOC_OAUTH_BASE_URL &&
      process.env.MOC_OAUTH_CLIENT_ID &&
      process.env.MOC_OAUTH_CLIENT_SECRET &&
      process.env.MOC_OAUTH_REDIRECT_URI
  );
}

// Built lazily: the constructor throws if a MOC_OAUTH_* variable is missing, and an unconfigured
// environment should only affect the AAS routes, not the rest of the app.
let client: MOCOAuthClient | null = null;

export function getAasClient() {
  if (!client) {
    client = new MOCOAuthClient({
      baseUrl: process.env.MOC_OAUTH_BASE_URL,
      clientId: process.env.MOC_OAUTH_CLIENT_ID,
      clientSecret: process.env.MOC_OAUTH_CLIENT_SECRET,
      redirectUri: process.env.MOC_OAUTH_REDIRECT_URI,
    });
  }
  return client;
}

/** Empty string disables the domain check (any AAS account with a matching local user may sign in). */
export function getAllowedEmailDomain() {
  return (process.env.AAS_ALLOWED_EMAIL_DOMAIN ?? "@moc.gov.kh").trim().toLowerCase();
}

export function createPkce() {
  const nonce = randomBytes(16).toString("hex");
  const codeVerifier = randomBytes(32).toString("base64url");
  const codeChallenge = createHash("sha256").update(codeVerifier).digest("base64url");
  return { nonce, codeVerifier, codeChallenge };
}

async function sign(payload: Record<string, unknown>, expiresIn: string) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getJwtSecret());
}

/** `state` sent to the provider: carries only the nonce. */
export const signState = (nonce: string) => sign({ nonce, purpose: "aas-state" }, PKCE_TTL);

/** Cookie value that holds the PKCE code_verifier between the redirect out and the callback. */
export const signPkceCookie = (nonce: string, codeVerifier: string) =>
  sign({ nonce, codeVerifier, purpose: "aas-pkce" }, PKCE_TTL);

/** Short-lived proof, checked by the API, that this email was verified by AAS. */
export const signAssertion = (email: string) => sign({ email, purpose: "aas-signin" }, "2m");

export async function readState(token: string) {
  const { payload } = await jwtVerify(token, getJwtSecret());
  if (payload.purpose !== "aas-state" || typeof payload.nonce !== "string") {
    throw new Error("Invalid state");
  }
  return payload.nonce;
}

export async function readPkceCookie(token: string) {
  const { payload } = await jwtVerify(token, getJwtSecret());
  if (
    payload.purpose !== "aas-pkce" ||
    typeof payload.nonce !== "string" ||
    typeof payload.codeVerifier !== "string"
  ) {
    throw new Error("Invalid PKCE cookie");
  }
  return { nonce: payload.nonce, codeVerifier: payload.codeVerifier };
}
